import { FileSearchApp } from "./components/FileSearchApp/FileSearchApp"
import { FileService } from "./services/FileService"
import { Logger } from "./utils/Logger"
import { ConfigService } from "./services/ConfigService"

// Initialize logger with verbosity based on URL params
const urlParams = new URLSearchParams(window.location.search)
const verboseCount = (urlParams.getAll("verbose").length || 0) + (urlParams.getAll("v").length || 0)
Logger.setVerbosity(verboseCount)

// Initialize the configuration service
const configService = new ConfigService()

// Get the JSON file URL from URL params or use default
const jsonFileUrl = urlParams.get("json") || configService.getJsonFileUrl() || "sample-files.json"
configService.setJsonFileUrl(jsonFileUrl)

// Initialize the file service with the JSON file URL
const fileService = new FileService(jsonFileUrl)

// Initialize and render the app
const app = new FileSearchApp(fileService, configService)
app.render(document.getElementById("app")!)

// Load files automatically on startup
;(async () => {
  try {
    await fileService.scanDirectory()
    Logger.info("Initial file load complete")
  } catch (error) {
    Logger.error(`Initial file load failed: ${error}`)
  }
})()
