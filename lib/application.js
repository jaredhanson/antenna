/**
 * Module dependencies.
 */
var Router = require('./router')
  , configurable = require('configurable')
  , debug = require('debug')('antenna');


/**
 * Application prototype.
 */
var app = exports = module.exports = {};
configurable(app);

/**
 * Initialize application.
 *
 * @api private
 */
app.init = function() {
  this.topic = '';
  this.settings = {};
  this._stack = [];
  this._router = new Router();
  this.defaultConfiguration();
};

/**
 * Initialize application configuration.
 *
 * @api private
 */
app.defaultConfiguration = function(){
  this.set('env', process.env.NODE_ENV || 'development');
  this.set('case sensitive routing', true);
  debug('booting in %s mode', this.get('env'));
  
  // router
  this.__defineGetter__('router', function() {
    this._usedRouter = true;
    this._router.caseSensitive = this.enabled('case sensitive routing');
    this._router.strict = this.enabled('strict routing');
    return this._router.middleware;
  });
};

/**
 * Utilize the given middleware `fn` for the given `topic`, defaulting to _/_.
 *
 * Examples:
 *
 *     app.use(antenna.json());
 *
 * @param {String|Function} topic
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */
app.use = function(topic, fn) {
  if ('string' != typeof topic) {
    fn = topic;
    topic = '';
  }
  
  // wrap sub-apps
  if ('function' == typeof fn.handle) {
    var server = fn;
    server.topic = topic;
    fn = function(msg, next) {
      server.handle(msg, next);
    };
  }
  
  // add the middleware
  debug('use %s %s', topic || '#', fn.name || 'anonymous');
  this._stack.push({ topic: topic, handle: fn });
  return this;
}

/**
 * Declare a listener for messages sent to `topic`.
 *
 * @param {String} path
 * @param {Function|Array} fns
 * @return {app} for chaining
 * @api public
 */
app.listen = function(topic) {
  var args = [].slice.call(arguments);
  
  // if no router attached yet, attach the router
  if (!this._usedRouter) { this.use(this.router); }
  
  // setup route
  this._router.route.apply(this._router, args);
  return this;
}

/**
 * Handle messages, by running them through the middleware stack.
 *
 * @api private
 */
app.handle = function(msg, out) {
  var self = this
    , stack = this._stack
    , idx = 0;
  
  function next(err) {
    var layer = stack[idx++];
    
    // all done
    if (!layer) {
      // delegate to parent
      if (out) { return out(err); }
      // TODO: Implement default behavior for unhandled messages.
      if (err) {
        console.error(err.stack);
      }
      return;
    }
    
    try {
      // skip this layer if the topic doesn't match, noting that topic names are
      // case sensitive
      if (0 != msg.topic.indexOf(layer.topic)) return next(err);
      
      debug('%s %s', layer.handle.name || 'anonymous', layer.topic);
      var arity = layer.handle.length;
      if (err) {
        if (arity == 3) {
          layer.handle(err, msg, next);
        } else {
          next(err);
        }
      } else if (arity < 3) {
        layer.handle(msg, next);
      } else {
        next();
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
}
