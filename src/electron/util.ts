export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function transformToOctal(val: number) : number {
  return parseInt(val.toString(), 8)
}