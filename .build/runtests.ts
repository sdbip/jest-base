import fs from 'fs'
import { ANSI, styled } from './ansi-styles'
import { Sound } from './Sound'
import { StaticAnalysis } from './StaticAnalysis'
import { TestReport } from './TestReport'

const watch = (process.argv.indexOf('--watch') >= 0)
if (watch) {

  fs.watch('.build/', (eventType, filename) => {
    if (filename.startsWith('.')) return
    console.log(eventType, filename)
    console.log(styled([ANSI.bold, ANSI.red, ANSI.whiteBg]), '🛠 Build files changed 🔌')
    process.exit(0)
  })

  fs.watch('./', { recursive: true }, async (eventType, filename) => {
    if (filename.startsWith('.')) return
    console.log(eventType, filename)
    process.exit(0)
  })
}

runTests()


async function runTests() {
  console.clear()
  console.log('\n')

  const testResult = await TestReport.run()
  console.log('\n\n')
  testResult.report()

  const lintResult = await StaticAnalysis.run()
  lintResult.report()

  console.log('\n\n')

  const sound = testResult.isFailure ? Sound.failure :
    lintResult.hasIssues ? Sound.lintIssue : Sound.success
  sound.play()
}
