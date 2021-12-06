import fs from 'fs'
import { ANSI, styled } from './ansi-styles'
import { Sound } from './Sound'
import { StaticAnalysis } from './StaticAnalysis'
import { TestReport } from './TestReport'

const watchForSourceChanges = (process.argv.indexOf('--watch') >= 0)
const includeBuildSource = process.argv.indexOf('--lint_build') > 0

if (watchForSourceChanges) {
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

  const lintResult = await StaticAnalysis.run({includeBuildSource})
  lintResult.report()

  console.log('\n\n')

  const sound = testResult.isFailure ? Sound.failure :
    lintResult.hasIssues ? Sound.lintIssue : Sound.success
  sound.play()
}
