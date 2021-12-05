import child_process from 'child_process'

export async function sh(command: string, args: string[]) {
  return new Promise((resolve, reject) => {
    const child = child_process.spawn(command, args)
    child.on('error', reject)
    child.on('exit', (code) => { resolve({ code }) })
  })
}
