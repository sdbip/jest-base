import pathLib from 'path'
import { sh } from './sh'

export class Sound {
  static readonly success = new Sound('sounds/success.mp3')
  static readonly lintIssue = new Sound('sounds/lint.mp3')
  static readonly failure = new Sound('sounds/fail.mp3')
  readonly filename: string

  constructor(filename: string) { this.filename = filename }

  async play() {
    playSound(this.filename)
  }
}

async function playSound(filename: string) {
  const path = pathLib.resolve(__dirname, filename)
  await sh('afplay', [path])
}
