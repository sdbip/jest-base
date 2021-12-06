import { ESLint, Linter } from 'eslint'
import { ANSI, styled } from './ansi-styles'

export class StaticAnalysis {
  get hasIssues() { return this.issues.length > 0 }
  private readonly issues: ESLint.LintResult[]

  constructor(issues: ESLint.LintResult[]) {
    this.issues = issues
  }

  static async run({includeBuildSource}: {includeBuildSource: boolean}) {
    const sources = includeBuildSource ? ['**/*.ts', '.build/**/*.ts'] : '**/*.ts'
    const result = await new ESLint().lintFiles(sources)
    return new StaticAnalysis(result.filter(x => x.errorCount || x.warningCount))
  }

  report() {
    console.log(
      styled(this.hasIssues ? styles.issue : styles.ok),
      this. hasIssues ? '🧹 Code needs cleanup 🧹' : '🧹 Code looks beautiful 🧹')

    for (const err of this.issues) {
      console.error(`\n${err.filePath}`)
      for (const msg of err.messages) {
        console.error(
          styled(ANSI.gray, `  ${msg.line}:${msg.column}`),
          severityString(msg),
          msg.message,
          styled(ANSI.gray, msg.ruleId ?? undefined))
      }
    }
  }
}

export enum Level { ok, warn, error }

const styles = {
  issue: [ANSI.bold, ANSI.yellow],
  ok: [ANSI.bold, ANSI.blue],
}

function severityString(msg: Linter.LintMessage): string {
  return msg.severity == Level.error
    ? styled(ANSI.red, 'error')
    : msg.severity == Level.warn
      ? styled(ANSI.yellow, 'warning')
      : 'info'
}
