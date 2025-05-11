import { UIFactory } from "./UIFactory"
import { FileService } from "../../services/FileService"

export class DataDisplayPanel {
  private jsonButton: HTMLButtonElement
  private jsonDisplay: HTMLPreElement
  private fileService: FileService

  constructor(fileService: FileService) {
    this.fileService = fileService
    this.jsonButton = UIFactory.createButton("Show JSON Data", this.toggleJsonDisplay.bind(this))
    this.jsonDisplay = document.createElement("pre")

    this.setupJsonDisplay()
  }

  private setupJsonDisplay(): void {
    this.jsonDisplay.style.padding = "10px"
    this.jsonDisplay.style.marginTop = "10px"
    this.jsonDisplay.style.backgroundColor = "#f8f8f8"
    this.jsonDisplay.style.border = "1px solid #ddd"
    this.jsonDisplay.style.borderRadius = "4px"
    this.jsonDisplay.style.maxHeight = "200px"
    this.jsonDisplay.style.overflow = "auto"
    this.jsonDisplay.style.display = "none"
  }

  private toggleJsonDisplay(): void {
    const jsonBlob = this.fileService.getJsonBlob()
    this.jsonDisplay.textContent = jsonBlob || "// No JSON data available"

    if (this.jsonDisplay.style.display === "none") {
      this.jsonDisplay.style.display = "block"
      this.jsonButton.textContent = "Hide JSON Data"
    } else {
      this.jsonDisplay.style.display = "none"
      this.jsonButton.textContent = "Show JSON Data"
    }
  }

  public updateIfVisible(): void {
    if (this.jsonDisplay.style.display === "block") {
      this.jsonDisplay.textContent = this.fileService.getJsonBlob()
    }
  }

  public render(): HTMLElement {
    const container = document.createElement("div")
    container.appendChild(this.jsonButton)
    container.appendChild(this.jsonDisplay)

    return container
  }
}
