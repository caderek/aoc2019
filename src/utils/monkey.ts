interface Object {
  chain(fn: (...args: any[]) => any): any
  tap<T>(fn: (arg: T, ...args: any[]) => any): T
}

Object.prototype.chain = function(fn) {
  return fn(this)
}

Object.prototype.tap = function(fn) {
  fn(this)
  return this
}
