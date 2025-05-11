import { UIFactory } from "./UIFactory"

export class ActionButtonPanel {
  private reloadButton: HTMLButtonElement
  private reloadCallback: () => void

  constructor(reloadCallback: () => void) {
    this.reloadCallback = reloadCallback
    this.reloadButton = UIFactory.createButton(
      "Reload Data (Ctrl+R)",
      this.reloadCallback,
      "Reload file data from JSON (Ctrl+R)",
    )
  }

  public render(): HTMLElement {
    const buttonContainer = document.createElement("div")
    buttonContainer.style.marginBottom = "20px"
    buttonContainer.appendChild(this.reloadButton)

    return buttonContainer
  }

  public disableReloadButton(): void {
    this.reloadButton.disabled = true
    this.reloadButton.textContent = "Reloading..."
  }

  public enableReloadButton(): void {
    this.reloadButton.textContent = "Data Reloaded!"
    setTimeout(() => {
      this.reloadButton.textContent = "Reload Data (Ctrl+R)"
      this.reloadButton.disabled = false
    }, 1500)
  }

  public showReloadError(): void {
    this.reloadButton.textContent = "Reload Failed!"
    setTimeout(() => {
      this.reloadButton.textContent = "Reload Data (Ctrl+R)"
      this.reloadButton.disabled = false
    }, 1500)
  }
}
