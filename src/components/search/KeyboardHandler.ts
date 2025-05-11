import { SuggestionsContainer } from "./SuggestionsContainer"

export class KeyboardHandler {
  private suggestionsContainer: SuggestionsContainer
  private onSelectCallback: () => void

  constructor(
    suggestionsContainer: SuggestionsContainer,
    onSelectCallback: () => void
  ) {
    this.suggestionsContainer = suggestionsContainer
    this.onSelectCallback = onSelectCallback
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (!this.suggestionsContainer.isSuggestionsVisible()) return

    // Ctrl+N: Move down
    if (event.ctrlKey && event.key === "n") {
      event.preventDefault()
      this.suggestionsContainer.moveSelection(1)
    }
    // Ctrl+P: Move up
    else if (event.ctrlKey && event.key === "p") {
      event.preventDefault()
      this.suggestionsContainer.moveSelection(-1)
    }
    // Enter: Select current item
    else if (event.key === "Enter") {
      event.preventDefault()
      this.suggestionsContainer.selectCurrent()
    }
    // Escape: Hide suggestions
    else if (event.key === "Escape") {
      event.preventDefault()
      this.suggestionsContainer.hideSuggestions()
    }
  }
}
