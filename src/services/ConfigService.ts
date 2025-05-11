import { Logger } from "../utils/Logger"

/**
 * Service for managing application configuration
 */
export class ConfigService {
  private readonly LOCAL_STORAGE_PREFIX = "curiousCheetah_"
  private readonly DEFAULT_SCAN_PATH = "src/"
  private readonly DEFAULT_JSON_FILE_URL = "sample-files.json"

  constructor() {
    Logger.debug("ConfigService initialized")
  }

  /**
   * Get a configuration value from localStorage
   */
  public get(key: string): string | null {
    return localStorage.getItem(this.LOCAL_STORAGE_PREFIX + key)
  }

  /**
   * Set a configuration value in localStorage
   */
  public set(key: string, value: string): void {
    localStorage.setItem(this.LOCAL_STORAGE_PREFIX + key, value)
    Logger.debug(`Config set: ${key} = ${value}`)
  }

  /**
   * Get the path for directory scanning
   */
  public getScanPath(): string {
    return this.get("scanPath") || this.DEFAULT_SCAN_PATH
  }

  /**
   * Set the path for directory scanning
   */
  public setScanPath(path: string): void {
    this.set("scanPath", path)
  }

  /**
   * Get the URL for the JSON file containing file data
   */
  public getJsonFileUrl(): string {
    return this.get("jsonFileUrl") || this.DEFAULT_JSON_FILE_URL
  }

  /**
   * Set the URL for the JSON file containing file data
   */
  public setJsonFileUrl(url: string): void {
    this.set("jsonFileUrl", url)
  }
}
