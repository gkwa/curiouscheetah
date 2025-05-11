// Using the types from microfuzz
export interface SearchResult {
  item: string
  score: number
}

export interface FileItem {
  path: string
  type?: string
  size?: number | null
  lastModified?: string
}

export interface FileListData {
  files: FileItem[]
}
