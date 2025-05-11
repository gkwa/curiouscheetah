import { Logger } from "../utils/Logger"
import { FileItem, FileListData } from "../types"
import { FileDataProvider } from "./providers/FileDataProvider"
import { JsonFileDataProvider } from "./providers/JsonFileDataProvider"

// Define event types for the file service
export type FileServiceEventHandler = () => void

export class FileService {
  private files: string[] = []
  private fileItems: FileItem[] = []
  private jsonBlob: string = ""
  private onFilesChangedHandlers: FileServiceEventHandler[] = []
  private dataProvider: FileDataProvider

  constructor(jsonFileUrl: string) {
    this.dataProvider = new JsonFileDataProvider(jsonFileUrl)
    Logger.debug("FileService initialized")
  }

  /**
   * Register a callback to be called when files change
   */
  public onFilesChanged(handler: FileServiceEventHandler): void {
    this.onFilesChangedHandlers.push(handler)
  }

  /**
   * Notify all listeners that files have changed
   */
  private notifyFilesChanged(): void {
    this.onFilesChangedHandlers.forEach((handler) => handler())
  }

  /**
   * Gets the current list of files (just paths)
   */
  public getFiles(): string[] {
    return this.files
  }

  /**
   * Gets the current list of file items (with metadata)
   */
  public getFileItems(): FileItem[] {
    return this.fileItems
  }

  /**
   * Load file data from the data provider
   */
  public async scanDirectory(rootDir?: string): Promise<string[]> {
    Logger.info("Loading files from data provider")

    try {
      // Load file data from the provider
      const data = await this.dataProvider.loadFiles()

      // Store the full file items
      this.fileItems = data.files || []

      // Extract just the paths from the file items
      this.files = this.fileItems.map((item) => item.path)

      // Apply filter if rootDir is provided
      if (rootDir && rootDir !== "/" && rootDir !== "") {
        this.files = this.files.filter((path) => path.startsWith(rootDir))
      }

      Logger.debug(`Loaded ${this.files.length} files`)

      // Generate JSON blob
      this.generateJsonBlob()

      // Notify listeners that files have changed
      this.notifyFilesChanged()

      return this.files
    } catch (error) {
      Logger.error(`Failed to load file list: ${error}`)
      // Initialize empty arrays on error
      this.files = []
      this.fileItems = []
      // Notify listeners about the change
      this.notifyFilesChanged()
      return []
    }
  }

  /**
   * Generate a JSON blob of the file list
   */
  public generateJsonBlob(): string {
    this.jsonBlob = JSON.stringify(
      {
        files: this.files,
        fileItems: this.fileItems,
      },
      null,
      2,
    )
    Logger.info("Generated JSON blob of file list")
    return this.jsonBlob
  }

  /**
   * Get the current JSON blob
   */
  public getJsonBlob(): string {
    return this.jsonBlob
  }

  /**
   * Load files from a JSON blob
   */
  public loadFromJson(json: string): void {
    try {
      const data = JSON.parse(json)

      if (Array.isArray(data.files)) {
        this.files = data.files

        // If file items are included, use them
        if (Array.isArray(data.fileItems)) {
          this.fileItems = data.fileItems
        } else {
          // Otherwise, create simple file items from paths
          this.fileItems = this.files.map((path) => ({
            path,
            type: "file",
            size: null,
            lastModified: new Date().toISOString(),
          }))
        }

        this.jsonBlob = json
        Logger.info(`Loaded ${this.files.length} files from JSON`)

        // Notify listeners that files have changed
        this.notifyFilesChanged()
      } else {
        Logger.error("Invalid JSON format: expected { files: [] }")
      }
    } catch (error) {
      Logger.error(`Failed to parse JSON: ${error}`)
    }
  }
}
