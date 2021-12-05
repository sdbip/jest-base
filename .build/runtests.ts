import fs from 'fs'
import { ANSI, styled } from './ansi-styles'
import { Sound } from './Sound'
import { StaticAnalysis } from './StaticAnalysis'
import { TestReport } from './TestReport'

const watch = (process.argv.indexOf('--watch') >= 0)
let isRunning = false
runTests().then(() => {
  if (!watch) return
  
  fs.watch('.build/', (eventType, filename: string) => {
    if (filename.startsWith('.')) return
    console.log(eventType, filename)
    console.log(styled([ANSI.bold, ANSI.red, ANSI.whiteBg]), '🛠 Build files changed 🔌')
    process.exit(1)
  })
  
  fs.watch('./', { recursive: true }, async (eventType, filename: string) => {
    if (filename.startsWith('.') || isRunning) return
    isRunning = true
    console.log(eventType, filename)
    await runTests()
    isRunning = false
  })  
})


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
