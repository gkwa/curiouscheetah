import { describe, it, expect, beforeEach, vi } from "vitest"
import { FileService } from "../services/FileService"

describe("FileService", () => {
  let fileService: FileService

  beforeEach(() => {
    fileService = new FileService("sample-files.json")
    // Mock console.error to avoid polluting test output
    vi.spyOn(console, "error").mockImplementation(() => {})

    // Create a mock implementation of fetch
    const mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            files: [
              {
                path: "src/main.ts",
              },
              {
                path: "src/components/FileSearchApp.ts",
              },
              {
                path: "src/utils/Logger.ts",
              },
            ],
          }),
      }),
    )

    // Replace the global fetch with our mock version
    vi.stubGlobal("fetch", mockFetch)
  })

  it("should initialize with empty files array", () => {
    expect(fileService.getFiles()).toEqual([])
  })

  it("should scan directory and generate files list", async () => {
    await fileService.scanDirectory("src/")
    expect(fileService.getFiles().length).toBeGreaterThan(0)
    expect(fileService.getFiles().every((file) => file.startsWith("src/"))).toBe(true)
  })

  it("should generate and retrieve a JSON blob", async () => {
    await fileService.scanDirectory()
    const jsonBlob = fileService.getJsonBlob()
    expect(jsonBlob).toBeTruthy()

    const parsed = JSON.parse(jsonBlob)
    expect(parsed).toHaveProperty("files")
    expect(Array.isArray(parsed.files)).toBe(true)
  })

  it("should load files from a JSON blob", () => {
    const testFiles = ["file1.txt", "file2.txt", "dir/file3.txt"]
    const testJson = JSON.stringify({ files: testFiles })

    fileService.loadFromJson(testJson)
    expect(fileService.getFiles()).toEqual(testFiles)
  })

  it("should handle invalid JSON", () => {
    const invalidJson = '{ "files": this is not valid json }'
    fileService.loadFromJson(invalidJson)
    expect(fileService.getFiles()).toEqual([])
  })

  it("should handle fetch errors gracefully", async () => {
    // Override the successful mock with an error mock
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")))

    const result = await fileService.scanDirectory()
    expect(result).toEqual([])
  })

  it("should filter files by directory path", async () => {
    await fileService.scanDirectory("src/components/")
    expect(fileService.getFiles().length).toBe(1)
    expect(fileService.getFiles()[0]).toBe("src/components/FileSearchApp.ts")
  })
})
