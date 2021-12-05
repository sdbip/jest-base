export enum ANSI {
  bold =   '\x1b[1m',
  green =  '\x1b[32m',
  blue =   '\x1b[34m',
  red =    '\x1b[91m',
  yellow = '\x1b[33m',
  gray =   '\x1b[90m',

  whiteBg = '\x1b[107m',

  off = '\x1b[0m'
}

export function styled(ansiCodes: ANSI|ANSI[], s: string | undefined = undefined) {
  if (typeof ansiCodes === 'string') ansiCodes = [ansiCodes]
  const ansi = ansiCodes.join('')
  return s === undefined
    ? `${ansi}%s\x1b[0m`
    : `${ansi}${s}\x1b[0m`
}
