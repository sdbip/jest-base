import { ESLint } from 'eslint'
import { ANSI, styled } from './ansi-styles'

export class StaticAnalysis {
  readonly lintErrors: ESLint.LintResult[]
  get hasIssues() { return this.lintErrors.length > 0 }

  constructor(lintErrors: ESLint.LintResult[]) {
    this.lintErrors = lintErrors
  }

  static async run() {
    const lintedFiles = '**/*.ts' // Use ['**/*.ts', '.build/**/*.ts'] to include the build scripts
    const lintResult = await new ESLint().lintFiles(lintedFiles)

    return new StaticAnalysis(lintResult.filter(x => x.errorCount || x.warningCount))
  }

  report() {
    console.log(
      styled(this.hasIssues ? styles.lintIssue : styles.prettyCode),
      this. hasIssues ? '🧹 Code needs cleanup 🧹' : '🧹 Code looks beautiful 🧹')

    for (const err of this.lintErrors) {
      console.error(`\n${err.filePath}`)
      for (const msg of err.messages) {

        console.error(
          styled(ANSI.gray, `  ${msg.line}:${msg.column}`),
          msg.severity == Level.error
            ? styled(ANSI.red, 'error')
            : msg.severity == Level.warn
              ? styled(ANSI.yellow, 'warning')
              : 'info',
          msg.message,
          styled(ANSI.gray, msg.ruleId ?? undefined))
      }
    }
  }
}

export enum Level { ok, warn, error }

const styles = {
  lintIssue: [ANSI.bold, ANSI.yellow],
  prettyCode: [ANSI.bold, ANSI.blue],
}
