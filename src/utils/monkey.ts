interface Array<T> {
  chain<T>(fn: (arg: T) => any): any
  tap<T>(fn: (arg: T) => any): T
}

Object.defineProperty(Array.prototype, "chain", {
  value: function(fn) {
    return fn(this)
  },
})

Object.defineProperty(Array.prototype, "tap", {
  value: function(fn) {
    fn(this)
    return this
  },
})

interface String {
  chain<T>(fn: (arg: T) => any): any
  tap<T>(fn: (arg: T) => any): T
}

Object.defineProperty(String.prototype, "chain", {
  value: function(fn) {
    return fn(this)
  },
})

Object.defineProperty(String.prototype, "tap", {
  value: function(fn) {
    fn(this)
    return this
  },
})
