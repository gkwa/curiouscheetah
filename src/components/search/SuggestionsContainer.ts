import { Logger } from "../../utils/Logger"

export class SuggestionsContainer {
  private container: HTMLDivElement
  private suggestions: string[] = []
  private selectedIndex: number = -1
  private suggestionsVisible: boolean = false
  private onSelectCallback: (selectedItem: string) => void

  constructor(onSelectCallback: (selectedItem: string) => void) {
    this.onSelectCallback = onSelectCallback
    
    // Create suggestions container
    this.container = document.createElement("div")
    this.container.className = "suggestions"
    this.container.style.display = "none"
    this.container.style.maxHeight = "300px"
    this.container.style.overflowY = "auto"
  }

  public getElement(): HTMLDivElement {
    return this.container
  }

  public updateSuggestions(items: string[]): void {
    this.suggestions = items
    this.renderSuggestions()
    
    if (items.length > 0) {
      this.showSuggestions()
      this.selectedIndex = 0
      this.highlightSelected()
    } else {
      this.hideSuggestions()
    }
  }

  public moveSelection(direction: number): void {
    if (this.suggestions.length === 0) return

    this.selectedIndex =
      (this.selectedIndex + direction + this.suggestions.length) %
      this.suggestions.length
    this.highlightSelected()

    // Ensure the selected item is visible by scrolling to it
    this.scrollToSelected()
    
    Logger.debug(`Selection moved to index ${this.selectedIndex}`)
  }

  public selectCurrent(): void {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.suggestions.length) {
      const selectedItem = this.suggestions[this.selectedIndex]
      this.onSelectCallback(selectedItem)
    }
  }

  public showSuggestions(): void {
    this.container.style.display = "block"
    this.suggestionsVisible = true
  }

  public hideSuggestions(): void {
    this.container.style.display = "none"
    this.suggestionsVisible = false
    this.selectedIndex = -1
  }

  public isSuggestionsVisible(): boolean {
    return this.suggestionsVisible
  }

  public getSelectedIndex(): number {
    return this.selectedIndex
  }

  private renderSuggestions(): void {
    this.container.innerHTML = ""

    if (this.suggestions.length === 0) {
      const noResults = document.createElement("div")
      noResults.className = "no-results"
      noResults.textContent = "No matching files found"
      this.container.appendChild(noResults)
      return
    }

    this.suggestions.forEach((suggestion, index) => {
      const item = document.createElement("div")
      item.className = "suggestion-item"
      item.textContent = suggestion

      item.addEventListener("click", () => {
        this.selectedIndex = index
        this.selectCurrent()
      })

      this.container.appendChild(item)
    })
  }

  private highlightSelected(): void {
    const items = this.container.querySelectorAll(".suggestion-item")

    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add("highlighted")
      } else {
        item.classList.remove("highlighted")
      }
    })
  }

  private scrollToSelected(): void {
    const selectedElement = this.container.querySelector('.highlighted') as HTMLElement
    if (selectedElement) {
      // Get the position of the selected element relative to the container
      const containerRect = this.container.getBoundingClientRect()
      const selectedRect = selectedElement.getBoundingClientRect()
      
      // Check if element is outside visible area
      const isAbove = selectedRect.top < containerRect.top
      const isBelow = selectedRect.bottom > containerRect.bottom
      
      if (isAbove) {
        // Scroll so the element is at the top
        this.container.scrollTop += selectedRect.top - containerRect.top
      } else if (isBelow) {
        // Scroll so the element is at the bottom
        this.container.scrollTop += selectedRect.bottom - containerRect.bottom
      }
    }
  }
}
