import microfuzz from "@nozbe/microfuzz"
import { Logger } from "../../utils/Logger"
import { SearchResult } from "../../types"
import { SuggestionsContainer } from "./SuggestionsContainer"

export class SearchHandler {
  private getItems: () => string[]
  private suggestionsContainer: SuggestionsContainer
  private fuzzySearcher: any = null
  private suggestions: string[] = []

  constructor(getItems: () => string[], suggestionsContainer: SuggestionsContainer) {
    this.getItems = getItems
    this.suggestionsContainer = suggestionsContainer
    this.refreshItems()
  }

  public refreshItems(): void {
    // Get the latest items
    this.suggestions = this.getItems()

    // Create a new fuzzy searcher with the latest items
    this.fuzzySearcher = microfuzz(this.suggestions)
  }

  public handleInput(query: string): void {
    if (query === "") {
      this.suggestionsContainer.updateSuggestions([])
      return
    }

    // Use microfuzz for fuzzy matching
    try {
      // Search the items using the fuzzy searcher
      const results = this.fuzzySearcher(query)

      // Filter by score and sort by best match
      const filteredSuggestions = results
        .filter((result: SearchResult) => result.score > 0)
        .sort((a: SearchResult, b: SearchResult) => b.score - a.score)
        .map((result: SearchResult) => result.item)

      this.suggestionsContainer.updateSuggestions(filteredSuggestions)

      Logger.debug(`Found ${filteredSuggestions.length} suggestions for "${query}"`)
    } catch (error) {
      Logger.error(`Error in fuzzy search: ${error}`)
      this.suggestionsContainer.updateSuggestions([])
    }
  }
}
