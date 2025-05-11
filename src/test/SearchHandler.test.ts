import { describe, it, expect, beforeEach, vi } from "vitest"
import { SearchHandler } from "../components/search/SearchHandler"
import { SuggestionsContainer } from "../components/search/SuggestionsContainer"

// Mock the microfuzz dependency
vi.mock("@nozbe/microfuzz", () => {
  return {
    default: (items: string[]) => (query: string) => {
      return items.filter((item) => item.includes(query)).map((item) => ({ item, score: 1 }))
    },
  }
})

describe("SearchHandler", () => {
  let searchHandler: SearchHandler
  let mockSuggestionsContainer: SuggestionsContainer
  let mockFiles: string[]

  beforeEach(() => {
    // Mock files to search
    mockFiles = ["src/main.ts", "src/components/FileSearchApp.ts", "src/utils/Logger.ts"]

    // Mock the suggestions container
    mockSuggestionsContainer = {
      updateSuggestions: vi.fn(),
      getElement: vi.fn(),
      moveSelection: vi.fn(),
      selectCurrent: vi.fn(),
      showSuggestions: vi.fn(),
      hideSuggestions: vi.fn(),
      isVisible: vi.fn(),
      getSelectedIndex: vi.fn(),
    } as unknown as SuggestionsContainer

    // Create search handler with mock dependencies
    searchHandler = new SearchHandler(() => mockFiles, mockSuggestionsContainer)

    // Mock console to avoid test output pollution
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("should handle empty query", () => {
    searchHandler.handleInput("")
    expect(mockSuggestionsContainer.updateSuggestions).toHaveBeenCalledWith([])
  })

  it("should filter files based on search query", () => {
    searchHandler.handleInput("components")
    expect(mockSuggestionsContainer.updateSuggestions).toHaveBeenCalledWith(
      expect.arrayContaining(["src/components/FileSearchApp.ts"]),
    )
  })

  it("should handle query with no matches", () => {
    searchHandler.handleInput("nonexistent")
    expect(mockSuggestionsContainer.updateSuggestions).toHaveBeenCalledWith([])
  })

  it("should refresh items when requested", () => {
    // Mock getItems to return a different list the second time
    const getItemsMock = vi
      .fn()
      .mockReturnValueOnce(mockFiles)
      .mockReturnValueOnce([...mockFiles, "src/new/file.ts"])

    const handler = new SearchHandler(getItemsMock, mockSuggestionsContainer)

    // Verify initial state
    handler.handleInput("components")
    expect(mockSuggestionsContainer.updateSuggestions).toHaveBeenCalledWith(
      expect.arrayContaining(["src/components/FileSearchApp.ts"]),
    )

    // Reset mock to check next call
    vi.mocked(mockSuggestionsContainer.updateSuggestions).mockReset()

    // Refresh and search again
    handler.refreshItems()
    handler.handleInput("new")

    // Should find the new file
    expect(mockSuggestionsContainer.updateSuggestions).toHaveBeenCalledWith(
      expect.arrayContaining(["src/new/file.ts"]),
    )
  })
})
