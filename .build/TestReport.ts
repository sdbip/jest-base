import { runCLI } from '@jest/core'
import { AggregatedResult } from '@jest/test-result'
import { Config } from '@jest/types'
import { ANSI, styled } from './ansi-styles'

export class TestReport {
  private readonly results: AggregatedResult

  get isFailure() { return !this.results.success }

  constructor({ results }: { results: AggregatedResult }) {
    this.results = results
  }

  static async run() {
    const result = await runCLI({ silent: true } as Config.Argv, ['./'])
    return new TestReport(result)
  }

  report() {
    console.log(
      styled(this.isFailure ? styles.failure : styles.success,
        this.isFailure ? '💣 TESTS ARE FAILING 💣' : '💖 Tests run green 🍾'))
  }
}

const styles = {
  failure: [ANSI.bold, ANSI.red, ANSI.whiteBg],
  success: [ANSI.bold, ANSI.green],
}
