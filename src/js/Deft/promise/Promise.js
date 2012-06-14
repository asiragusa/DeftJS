// Generated by CoffeeScript 1.3.3
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).

Promise.when(), all(), any(), map() and reduce() methods adapted from:
[when.js](https://github.com/cujojs/when)
Copyright (c) B Cavalier & J Hann
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

Ext.define('Deft.promise.Promise', {
  alternateClassName: ['Deft.Promise'],
  statics: {
    /**
    		Returns a new {@link Deft.promise.Promise} that:
    		- resolves immediately for the specified value, or
    		- resolves, rejects, updates or cancels when the specified {@link Deft.promise.Deferred} or {@link Deft.promise.Promise} is resolved, rejected, updated or cancelled.
    */

    when: function(promiseOrValue) {
      var deferred;
      if (promiseOrValue instanceof Ext.ClassManager.get('Deft.promise.Promise') || promiseOrValue instanceof Ext.ClassManager.get('Deft.promise.Deferred')) {
        return promiseOrValue.then();
      } else if (Ext.isObject(promiseOrValue) && Ext.isFunction(promiseOrValue.then)) {
        deferred = Ext.create('Deft.promise.Deferred');
        promiseOrValue.then(function(value) {
          deferred.resolve(value);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.then();
      } else {
        deferred = Ext.create('Deft.promise.Deferred');
        deferred.resolve(promiseOrValue);
        return deferred.then();
      }
    },
    /**
    		Returns a new {@link Deft.promise.Promise} that will only resolve once all the specified `promisesOrValues` have resolved.
    		The resolution value will be an Array containing the resolution value of each of the `promisesOrValues`.
    */

    all: function(promisesOrValues) {
      var promise, results;
      results = new Array(promisesOrValues.length);
      promise = this.reduce(promisesOrValues, this.reduceIntoArray, results);
      return this.when(promise);
    },
    /**
    		Returns a new {@link Deft.promise.Promise} that will only resolve once any one of the the specified `promisesOrValues` has resolved.
    		The resolution value will be the resolution value of the triggering `promiseOrValue`.
    */

    any: function(promisesOrValues) {
      var complete, deferred, index, progressFunction, promiseOrValue, rejectFunction, rejecter, resolveFunction, resolver, updater, _i, _len;
      deferred = Ext.create('Deft.promise.Deferred');
      updater = function(progress) {
        deferred.update(progress);
      };
      resolver = function(value) {
        complete();
        deferred.resolve(value);
      };
      rejecter = function(error) {
        complete();
        deferred.reject(error);
      };
      complete = function() {
        return updater = resolver = rejecter = function() {};
      };
      resolveFunction = function(value) {
        return resolver(value);
      };
      rejectFunction = function(value) {
        return rejector(value);
      };
      progressFunction = function(value) {
        return updater(value);
      };
      for (index = _i = 0, _len = promisesOrValues.length; _i < _len; index = ++_i) {
        promiseOrValue = promisesOrValues[index];
        if (index in promisesOrValues) {
          this.when(promiseOrValue).then(resolveFunction, rejectFunction, progressFunction);
        }
      }
      return this.when(deferred);
    },
    /**
    		Returns a new function that wraps the specified function and caches the results for previously processed inputs.
    		Similar to `Deft.util.Function::memoize()`, except it allows input to contain promises and/or values.
    */

    memoize: function(fn, scope, hashFn) {
      return this.all(Ext.Array.toArray(arguments)).then(Deft.util.Function.spread(function() {
        return Deft.util.memoize(arguments, scope, hashFn);
      }, scope));
    },
    /**
    		Traditional map function, similar to `Array.prototype.map()`, that allows input to contain promises and/or values.
    		The specified map function may return either a value or a promise.
    */

    map: function(promisesOrValues, mapFunction) {
      var index, promiseOrValue, results, _i, _len;
      results = new Array(promisesOrValues.length);
      for (index = _i = 0, _len = promisesOrValues.length; _i < _len; index = ++_i) {
        promiseOrValue = promisesOrValues[index];
        if (index in promisesOrValues) {
          results[index] = this.when(promiseOrValue).then(mapFunction);
        }
      }
      return this.reduce(results, this.reduceIntoArray, results);
    },
    /**
    		Traditional reduce function, similar to `Array.reduce()`, that allows input to contain promises and/or values.
    */

    reduce: function(promisesOrValues, reduceFunction, initialValue) {
      var reduceArguments, whenResolved;
      whenResolved = this.when;
      reduceArguments = [
        function(previousValueOrPromise, currentValueOrPromise, currentIndex) {
          return whenResolved(previousValueOrPromise).then(function(previousValue) {
            return whenResolved(currentValueOrPromise).then(function(currentValue) {
              return reduceFunction(previousValue, currentValue, currentIndex, promisesOrValues);
            });
          });
        }
      ];
      if (arguments.length === 3) {
        reduceArguments.push(initialValue);
      }
      return this.when(this.reduceArray.apply(promisesOrValues, reduceArguments));
    },
    /**
    		Fallback implementation when Array.reduce is not available.
    		@private
    */

    reduceArray: function(reduceFunction, initialValue) {
      var args, array, index, length, reduced;
      index = 0;
      array = Object(this);
      length = array.length >>> 0;
      args = arguments;
      if (args.length <= 1) {
        while (true) {
          if (index in array) {
            reduced = array[index++];
            break;
          }
          if (++index >= length) {
            throw new TypeError();
          }
        }
      } else {
        reduced = args[1];
      }
      while (index < length) {
        if (index in array) {
          reduced = reduceFunction(reduced, array[index], index, array);
        }
        index++;
      }
      return reduced;
    },
    /**
    		@private
    */

    reduceIntoArray: function(previousValue, currentValue, currentIndex) {
      previousValue[currentIndex] = currentValue;
      return previousValue;
    }
  },
  constructor: function(deferred) {
    this.deferred = deferred;
    return this;
  },
  /**
  	Returns a new {@link Deft.promise.Promise} with the specified callbacks registered to be called when this {@link Deft.promise.Promise} is resolved, rejected, updated or cancelled.
  */

  then: function(callbacks) {
    return this.deferred.then.apply(this.deferred, arguments);
  },
  /**
  	Returns a new {@link Deft.promise.Promise} with the specified callback registered to be called when this {@link Deft.promise.Promise} is rejected.
  */

  otherwise: function(callback) {
    return this.deferred.otherwise(callback);
  },
  /**
  	Returns a new {@link Deft.promise.Promise} with the specified callback registered to be called when this {@link Deft.promise.Promise} is resolved, rejected or cancelled.
  */

  always: function(callback) {
    return this.deferred.always(callback);
  },
  /**
  	Cancel this {@link Deft.promise.Promise} and notify relevant callbacks.
  */

  cancel: function(reason) {
    return this.deferred.cancel(reason);
  },
  /**
  	Get this {@link Deft.promise.Promise}'s current state.
  */

  getState: function() {
    return this.deferred.getState();
  }
}, function() {
  if (Array.prototype.reduce != null) {
    this.reduceArray = Array.prototype.reduce;
  }
});
