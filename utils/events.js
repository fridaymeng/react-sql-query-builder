const EventEmitter = {
  events : {},
  trigger (event, data) {
    if (!this.events[event]) return;
    for (let i = 0; i < this.events[event].length; i++){
        this.events[event][i](data);
    }
  },
  on (event, callback) {
    if (!this.events[event]){
      this.events[event] = [];
    }
    event && this.events[event].push(callback);
  },
  off (event) {
    if(this.events && this.events[event]) {
      delete this.events[event];
    }
  }
};

export default EventEmitter;