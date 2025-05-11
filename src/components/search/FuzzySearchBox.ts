import { Logger } from "../../utils/Logger"
import { SearchHandler } from "./SearchHandler"
import { SuggestionsContainer } from "./SuggestionsContainer"
import { KeyboardHandler } from "./KeyboardHandler"

export class FuzzySearchBox {
  private container: HTMLElement
  private input: HTMLInputElement
  private suggestionsContainer: SuggestionsContainer
  private keyboardHandler: KeyboardHandler
  private searchHandler: SearchHandler
  private getItems: () => string[]
  private onSelect: (selectedItem: string) => void

  constructor(
    container: HTMLElement,
    getItems: () => string[],
    onSelect: (selectedItem: string) => void,
  ) {
    this.container = container
    this.getItems = getItems
    this.onSelect = onSelect

    // Create input element
    this.input = document.createElement("input")
    this.input.type = "text"
    this.input.className = "search-input"
    this.input.placeholder = "Type to search files... (Ctrl+N/P to navigate)"

    // Initialize handlers and containers
    this.suggestionsContainer = new SuggestionsContainer(this.selectItem.bind(this))
    this.searchHandler = new SearchHandler(getItems, this.suggestionsContainer)
    this.keyboardHandler = new KeyboardHandler(
      this.suggestionsContainer,
      this.selectItem.bind(this),
    )

    // Add elements to container
    this.container.appendChild(this.input)
    this.container.appendChild(this.suggestionsContainer.getElement())

    // Bind event listeners
    this.bindEventListeners()

    // Initialize with current items
    this.refresh()

    // Automatically focus the input (with a small delay to ensure DOM is ready)
    setTimeout(() => {
      this.focus()
    }, 100)

    Logger.debug("FuzzySearchBox initialized")
  }

  private bindEventListeners(): void {
    this.input.addEventListener("input", () => {
      this.searchHandler.handleInput(this.input.value.trim())
    })

    this.input.addEventListener("keydown", (event) => {
      this.keyboardHandler.handleKeyDown(event)
    })

    this.input.addEventListener("blur", () => {
      // Use setTimeout to allow click events on suggestion items to fire first
      setTimeout(() => {
        this.suggestionsContainer.hideSuggestions()
      }, 200)
    })

    this.input.addEventListener("focus", () => {
      if (this.input.value.trim() !== "") {
        this.searchHandler.handleInput(this.input.value.trim())
      }
    })
  }

  /**
   * Get the container element for the search box
   */
  public getContainer(): HTMLElement {
    return this.container
  }

  /**
   * Get the current search input value
   */
  public getCurrentValue(): string {
    return this.input.value.trim()
  }

  /**
   * Set the search input value and trigger a search
   */
  public setSearchValue(value: string): void {
    this.input.value = value
    // Wait a moment to ensure the DOM is ready
    setTimeout(() => {
      this.searchHandler.handleInput(value)
      this.focus()
    }, 50)
  }

  /**
   * Focus the search input
   */
  public focus(): void {
    this.input.focus()
    Logger.debug("Search input focused")
  }

  /**
   * Handle selection of an item
   */
  private selectItem(selectedItem: string): void {
    this.input.value = selectedItem
    this.onSelect(selectedItem)
    this.suggestionsContainer.hideSuggestions()
    Logger.info(`Selected item: ${selectedItem}`)
  }

  /**
   * Refresh the suggestions list when files change
   */
  public refresh(): void {
    this.searchHandler.refreshItems()

    // Re-run search if there's a current query
    if (this.input.value.trim()) {
      this.searchHandler.handleInput(this.input.value.trim())
    }

    Logger.debug("FuzzySearchBox refreshed with new data")
  }
}
