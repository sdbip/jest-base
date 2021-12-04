import { runCLI } from '@jest/core'
import { Config } from '@jest/types'
import child_process from 'child_process'
import { ESLint } from 'eslint'
import fs from 'fs'
import pathLib from 'path'

runTests()

const watch = (process.argv.indexOf('--watch') >= 0)
watch && fs.watch('.build/', (eventType, filename: string) => {
  if (filename.startsWith('.')) return
  console.log(eventType, filename)
  console.log(styled(styles.failure), '🛠 Build files changed 🔌')
  process.exit(1)
})

let isRunning = false
watch && fs.watch('./', {recursive: true}, async (eventType, filename: string) => {
  if (filename.startsWith('.') || isRunning) return
  isRunning = true
  console.log(eventType, filename)
  await runTests()
  isRunning = false
})

const sounds = {
  success: 'sounds/success.mp3',
  lintIssue: 'sounds/lint.mp3',
  failure: 'sounds/fail.mp3'
}

async function runTests() {
  const lintedFiles = '**/*.ts' // Use ['**/*.ts', '.build/**/*.ts'] to include the build scripts
  const lintResult = await new ESLint().lintFiles(lintedFiles)
  const lintErrors = lintResult.filter(x => x.errorCount || x.warningCount)
  const hasLintErrors = lintErrors.length

  console.clear()
  console.log('\n')
  const testResult = await runCLI({ silent: true } as Config.Argv, ['./'])
  const isFailure = !testResult.results.success
  console.log('\n\n')

  const sound =
    isFailure ? sounds.failure :
    hasLintErrors ? sounds.lintIssue :
    sounds.success
  playSound(sound)

  reportTestResults()
  reportLintResults()

  console.log('\n\n')

  function reportTestResults() {
    console.log(
      styled(isFailure ? styles.failure : styles.success,
        isFailure ? '💣 TESTS ARE FAILING 💣' : '💖 Tests run green 🍾'))
  }

  function reportLintResults() {
    console.log(
      styled(hasLintErrors ? styles.lintIssue : styles.prettyCode),
      hasLintErrors ? '🧹 Code needs cleanup 🧹' : '🧹 Code looks beautiful 🧹')

    for (const err of lintErrors) {
      console.error(`\n${err.filePath}`)
      for (const msg of err.messages) {

        console.error(
          styled(ANSI.gray, `  ${msg.line}:${msg.column}`),
          msg.severity == 2
            ? styled(ANSI.red, 'error')
            : msg.severity == 1
              ? styled(ANSI.yellow, 'warning')
              : 'info',
          msg.message,
          styled(ANSI.gray, msg.ruleId ?? undefined))
      }
    }
  }
}

async function playSound(filename: string) {
  const path = pathLib.resolve(__dirname, filename)
  await sh('afplay', [path])
}

async function sh(command: string, args: string[]) {
  return new Promise((resolve, reject) => {
    const child = child_process.spawn(command, args)
    child.on('error', reject)
    child.on('exit', (code) => { resolve({ code }) })
  })
}

enum ANSI {
  bold =   '\x1b[1m',
  green =  '\x1b[32m',
  blue =   '\x1b[34m',
  red =    '\x1b[91m',
  yellow = '\x1b[33m',
  gray =   '\x1b[90m',

  whiteBg = '\x1b[107m',

  off = '\x1b[0m'
}

const styles = {
  failure: [ANSI.bold, ANSI.red, ANSI.whiteBg],
  success: [ANSI.bold, ANSI.green],
  lintIssue: [ANSI.bold, ANSI.yellow],
  prettyCode: [ANSI.bold, ANSI.blue],
}

function styled(ansiCodes: ANSI|ANSI[], s: string | undefined = undefined) {
  if (typeof ansiCodes === 'string') ansiCodes = [ansiCodes]
  const ansi = ansiCodes.join('')
  return s === undefined
    ? `${ansi}%s\x1b[0m`
    : `${ansi}${s}\x1b[0m`
}
