
export default function(triggerInterval = 1000) {
  let watches = [];

  this.watch = function(callback) {
    watches.push(callback); 
  };

  this.unwatch = function(callback) {
    watches = watches.filter(c => c !== callback);
  };

  setInterval(() => {
    watches.forEach(cb => cb.call(this));
  }, triggerInterval);
}