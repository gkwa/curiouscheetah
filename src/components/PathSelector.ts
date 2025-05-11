import { Logger } from "../utils/Logger"
import { ConfigService } from "../services/ConfigService"

export class PathSelector {
  private container: HTMLDivElement
  private pathInput: HTMLInputElement
  private configService: ConfigService

  constructor(configService: ConfigService) {
    this.configService = configService
    this.container = document.createElement("div")
    this.pathInput = document.createElement("input")

    Logger.debug("PathSelector initialized")
  }

  public render(): HTMLElement {
    // Create path input container
    this.container.style.marginBottom = "20px"
    this.container.style.display = "flex"
    this.container.style.gap = "10px"
    this.container.style.alignItems = "center"

    const pathLabel = document.createElement("label")
    pathLabel.textContent = "Directory path: "
    pathLabel.style.flexShrink = "0"

    this.pathInput.type = "text"
    this.pathInput.className = "search-input"
    this.pathInput.style.flexGrow = "1"

    // Load path from configService
    const savedPath = this.configService.getScanPath()
    this.pathInput.value = savedPath

    this.pathInput.addEventListener("change", () => {
      // Save path to configService when changed
      this.configService.setScanPath(this.pathInput.value)
      Logger.debug(`Scan path saved: ${this.pathInput.value}`)
    })

    this.container.appendChild(pathLabel)
    this.container.appendChild(this.pathInput)

    return this.container
  }

  public getPath(): string {
    return this.pathInput.value.trim() || this.configService.getScanPath()
  }

  public setPath(path: string): void {
    this.pathInput.value = path
    this.configService.setScanPath(path)
  }
}
