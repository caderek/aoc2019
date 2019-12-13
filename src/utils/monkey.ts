interface Array<T> {
  chain<T>(fn: (arg: T) => any): any
  tap<T>(fn: (arg: T) => any): T
}

Array.prototype.chain = function(fn) {
  return fn(this)
}

Array.prototype.tap = function(fn) {
  fn(this)
  return this
}

interface String {
  chain<T>(fn: (arg: T) => any): any
  tap<T>(fn: (arg: T) => any): T
}

String.prototype.chain = function(fn) {
  return fn(this)
}

String.prototype.tap = function(fn) {
  fn(this)
  return this
}
