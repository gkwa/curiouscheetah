/**
 * Simple logger that respects verbosity levels
 */
export class Logger {
  private static verbosityLevel: number = 0

  // Log levels
  private static readonly LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  }

  /**
   * Set the verbosity level based on the number of --verbose flags
   */
  public static setVerbosity(level: number): void {
    this.verbosityLevel = level
    this.debug(`Verbosity level set to ${level}`)
  }

  /**
   * Log an error message (always shown)
   */
  public static error(message: string): void {
    this.log(message, this.LEVELS.ERROR)
  }

  /**
   * Log a warning message (shown with -v)
   */
  public static warn(message: string): void {
    this.log(message, this.LEVELS.WARN)
  }

  /**
   * Log an info message (shown with -vv)
   */
  public static info(message: string): void {
    this.log(message, this.LEVELS.INFO)
  }

  /**
   * Log a debug message (shown with -vvv)
   */
  public static debug(message: string): void {
    this.log(message, this.LEVELS.DEBUG)
  }

  /**
   * Internal logging function
   */
  private static log(message: string, level: number): void {
    if (level <= this.verbosityLevel) {
      const levelName =
        Object.keys(this.LEVELS).find(
          (key) => this.LEVELS[key as keyof typeof this.LEVELS] === level,
        ) || "UNKNOWN"

      // In a browser environment, console.error outputs to stderr
      console.error(`[${levelName}] ${message}`)
    }
  }
}
