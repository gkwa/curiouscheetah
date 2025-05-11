export class UIFactory {
  /**
   * Create a title area with subtitle
   */
  public static createTitleArea(subtitleText: string): HTMLElement {
    const titleArea = document.createElement("div")
    titleArea.style.marginBottom = "20px"

    const appSubtitle = document.createElement("p")
    appSubtitle.textContent = subtitleText
    appSubtitle.style.color = "#666"
    appSubtitle.style.marginTop = "10px"

    titleArea.appendChild(appSubtitle)

    return titleArea
  }

  /**
   * Create a styled button
   */
  public static createButton(
    text: string,
    onClick: () => void,
    tooltip?: string,
  ): HTMLButtonElement {
    const button = document.createElement("button")
    button.textContent = text
    button.style.padding = "10px"
    button.style.cursor = "pointer"
    button.style.backgroundColor = "#f0f0f0"
    button.style.border = "1px solid #ccc"
    button.style.borderRadius = "4px"

    if (tooltip) {
      button.title = tooltip
    }

    button.addEventListener("click", onClick)

    return button
  }
}
