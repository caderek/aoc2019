interface Object {
  chain<T>(fn: (arg: T) => any): any
  tap<T>(fn: (arg: T) => any): T
}

Object.prototype.chain = function(fn) {
  return fn(this)
}

Object.prototype.tap = function(fn) {
  fn(this)
  return this
}
