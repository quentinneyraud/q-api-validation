module.exports = class Event {
  constructor () {
    this.events = {}
  }

  emit (event, datas) {
    if (!this.events[event]) return

    this.events[event]
      .slice()
      .forEach(cb => cb.call(this, datas))
  }

  on (event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off (event, callback) {
    if (!this.events[event]) {
      return
    }

    const index = this.events[event].indexOf(callback)

    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }

  once (event, callback) {
    const removeCallback = () => {
      this.off(event, callback)
      this.off(event, removeCallback)
    }

    this.on(event, callback)
    this.on(event, removeCallback)
  }
}
