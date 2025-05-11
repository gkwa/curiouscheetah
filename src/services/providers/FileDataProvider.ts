import { FileListData } from "../../types"

/**
 * Interface for file data providers
 */
export interface FileDataProvider {
  /**
   * Load files from the provider
   */
  loadFiles(): Promise<FileListData>
}
