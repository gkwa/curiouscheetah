import { Logger } from "../../utils/Logger"
import { FileDataProvider } from "./FileDataProvider"
import { FileListData } from "../../types"

/**
 * Provider that loads file data from a JSON file
 */
export class JsonFileDataProvider implements FileDataProvider {
  private jsonFileUrl: string

  constructor(jsonFileUrl: string) {
    this.jsonFileUrl = jsonFileUrl
    Logger.debug(`JsonFileDataProvider initialized with URL: ${jsonFileUrl}`)
  }

  /**
   * Load files from the JSON file
   */
  public async loadFiles(): Promise<FileListData> {
    Logger.info(`Loading files from JSON file: ${this.jsonFileUrl}`)

    try {
      // Fetch the JSON file
      const response = await fetch(this.jsonFileUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch file list: ${response.status} ${response.statusText}`)
      }

      // Parse the response as JSON
      const data: FileListData = await response.json()

      return data
    } catch (error) {
      Logger.error(`Failed to load file list from JSON: ${error}`)
      throw error
    }
  }

  /**
   * Update the URL of the JSON file
   */
  public setJsonFileUrl(url: string): void {
    this.jsonFileUrl = url
    Logger.info(`Updated JSON file URL to: ${url}`)
  }
}
