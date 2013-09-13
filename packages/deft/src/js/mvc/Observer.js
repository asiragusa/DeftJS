// Generated by CoffeeScript 1.6.3
/*
Copyright (c) 2012-2013 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* @private
* Used by Deft.mvc.ViewController to handle events fired from injected objects.
*/

Ext.define('Deft.mvc.Observer', {
  requires: ['Deft.core.Class', 'Ext.util.Observable', 'Deft.util.Function'],
  statics: {
    /**
    		* Merges child and parent observers into a single object. This differs from a normal object merge because
    		* a given observer target and event can potentially have multiple handlers declared in different parent or
    		* child classes. It transforms an event handler value into an array of values, and merges the arrays of handlers
    		* from child to parent. This maintains the handlers even if both parent and child classes have handlers for the
    		* same target and event.
    */

    mergeObserve: function(originalParentObserve, originalChildObserve) {
      var childEvent, childEvents, childHandler, childHandlerArray, childObserve, childTarget, convertConfigArray, eventOptionNames, parentEvent, parentEvents, parentHandler, parentHandlerArray, parentObserve, parentTarget, _ref, _ref1;
      if (!Ext.isObject(originalParentObserve)) {
        parentObserve = {};
      } else {
        parentObserve = Ext.clone(originalParentObserve);
      }
      if (!Ext.isObject(originalChildObserve)) {
        childObserve = {};
      } else {
        childObserve = Ext.clone(originalChildObserve);
      }
      eventOptionNames = ["buffer", "single", "delay", "element", "target", "destroyable"];
      convertConfigArray = function(observeConfig) {
        var handlerConfig, newObserveEvents, observeEvents, observeTarget, thisEventOptionName, thisObserveEvent, _i, _j, _len, _len1, _results;
        _results = [];
        for (observeTarget in observeConfig) {
          observeEvents = observeConfig[observeTarget];
          if (Ext.isArray(observeEvents)) {
            newObserveEvents = {};
            for (_i = 0, _len = observeEvents.length; _i < _len; _i++) {
              thisObserveEvent = observeEvents[_i];
              if (Ext.Object.getSize(thisObserveEvent) === 1) {
                Ext.apply(newObserveEvents, thisObserveEvent);
              } else {
                handlerConfig = {};
                if ((thisObserveEvent != null ? thisObserveEvent.fn : void 0) != null) {
                  handlerConfig.fn = thisObserveEvent.fn;
                }
                if ((thisObserveEvent != null ? thisObserveEvent.scope : void 0) != null) {
                  handlerConfig.scope = thisObserveEvent.scope;
                }
                for (_j = 0, _len1 = eventOptionNames.length; _j < _len1; _j++) {
                  thisEventOptionName = eventOptionNames[_j];
                  if ((thisObserveEvent != null ? thisObserveEvent[thisEventOptionName] : void 0) != null) {
                    handlerConfig[thisEventOptionName] = thisObserveEvent[thisEventOptionName];
                  }
                }
                newObserveEvents[thisObserveEvent.event] = [handlerConfig];
              }
            }
            _results.push(observeConfig[observeTarget] = newObserveEvents);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      convertConfigArray(parentObserve);
      convertConfigArray(childObserve);
      for (childTarget in childObserve) {
        childEvents = childObserve[childTarget];
        for (childEvent in childEvents) {
          childHandler = childEvents[childEvent];
          if (Ext.isString(childHandler)) {
            childObserve[childTarget][childEvent] = childHandler.replace(' ', '').split(',');
          }
          if (!(parentObserve != null ? parentObserve[childTarget] : void 0)) {
            parentObserve[childTarget] = {};
          }
          if (!(parentObserve != null ? (_ref = parentObserve[childTarget]) != null ? _ref[childEvent] : void 0 : void 0)) {
            parentObserve[childTarget][childEvent] = childObserve[childTarget][childEvent];
            delete childObserve[childTarget][childEvent];
          }
        }
      }
      for (parentTarget in parentObserve) {
        parentEvents = parentObserve[parentTarget];
        for (parentEvent in parentEvents) {
          parentHandler = parentEvents[parentEvent];
          if (Ext.isString(parentHandler)) {
            parentObserve[parentTarget][parentEvent] = parentHandler.split(',');
          }
          if (childObserve != null ? (_ref1 = childObserve[parentTarget]) != null ? _ref1[parentEvent] : void 0 : void 0) {
            childHandlerArray = childObserve[parentTarget][parentEvent];
            parentHandlerArray = parentObserve[parentTarget][parentEvent];
            parentObserve[parentTarget][parentEvent] = Ext.Array.unique(Ext.Array.insert(parentHandlerArray, 0, childHandlerArray));
          }
        }
      }
      return parentObserve;
    }
  },
  /**
  	* Expects a config object with properties for host, target, and events.
  */

  constructor: function(config) {
    var eventName, events, handler, handlerArray, host, options, references, scope, target, _i, _len;
    this.listeners = [];
    host = config != null ? config.host : void 0;
    target = config != null ? config.target : void 0;
    events = config != null ? config.events : void 0;
    this.scope = config != null ? config.scope : void 0;
    if (host && target && (this.isPropertyChain(target) || this.isTargetObservable(host, target))) {
      for (eventName in events) {
        handlerArray = events[eventName];
        if (Ext.isString(handlerArray)) {
          handlerArray = handlerArray.replace(' ', '').split(',');
        }
        for (_i = 0, _len = handlerArray.length; _i < _len; _i++) {
          handler = handlerArray[_i];
          scope = this.scope || host;
          options = null;
          if (Ext.isObject(handler)) {
            options = Ext.clone(handler);
            if (options != null ? options.event : void 0) {
              eventName = this.extract(options, "event");
            }
            if (options != null ? options.fn : void 0) {
              handler = this.extract(options, "fn");
            }
            if (options != null ? options.scope : void 0) {
              scope = this.extract(options, "scope");
            }
          }
          references = this.locateReferences(host, target, handler);
          if (references) {
            references.target.on(eventName, references.handler, scope, options);
            this.listeners.push({
              targetName: target,
              target: references.target,
              event: eventName,
              handler: references.handler,
              scope: scope
            });
            Deft.Logger.log("Created observer on '" + target + "' for event '" + eventName + "'.");
          } else {
            Deft.Logger.warn("Could not create observer on '" + target + "' for event '" + eventName + "'.");
          }
        }
      }
    } else {
      Deft.Logger.warn("Could not create observers on '" + target + "' because '" + target + "' is not an Ext.util.Observable");
    }
    return this;
  },
  /**
  	* Returns true if the passed host has a target that is Observable.
  	* Checks for an isObservable=true property, observable mixin, or if the class extends Observable.
  */

  isTargetObservable: function(host, target) {
    var hostTarget, hostTargetClass, _ref;
    hostTarget = this.locateTarget(host, target);
    if (hostTarget == null) {
      return false;
    }
    hostTargetClass = Ext.ClassManager.getClass(hostTarget);
    if (Deft.Class.extendsClass('Ext.dom.Element', hostTargetClass)) {
      return true;
    }
    if ((hostTarget.isObservable != null) || (((_ref = hostTarget.mixins) != null ? _ref.observable : void 0) != null)) {
      return true;
    } else {
      return Deft.Class.extendsClass(hostTargetClass, 'Ext.util.Observable') || Deft.Class.extendsClass(hostTargetClass, 'Ext.mixin.Observable');
    }
  },
  /**
  	* Attempts to locate an observer target given the host object and target property name.
  	* Checks for both host[ target ], and host.getTarget().
  */

  locateTarget: function(host, target) {
    var result;
    if (Ext.isFunction(host['get' + Ext.String.capitalize(target)])) {
      result = host['get' + Ext.String.capitalize(target)].call(host);
      return result;
    } else if ((host != null ? host[target] : void 0) != null) {
      result = host[target];
      return result;
    } else {
      return null;
    }
  },
  /**
  	* Returns true if the passed target is a string containing a '.', indicating that it is referencing a nested property.
  */

  isPropertyChain: function(target) {
    return Ext.isString(target) && target.indexOf('.') > -1;
  },
  /**
  	* Given a host object, target property name, and handler, return object references for the final target and handler function.
  	* If necessary, recurse down a property chain to locate the final target object for the event listener.
  */

  locateReferences: function(host, target, handler) {
    var handlerHost, propertyChain;
    handlerHost = this.scope || host;
    if (this.isPropertyChain(target)) {
      propertyChain = this.parsePropertyChain(host, target);
      if (!propertyChain) {
        return null;
      }
      host = propertyChain.host;
      target = propertyChain.target;
    }
    if (Ext.isFunction(handler)) {
      return {
        target: this.locateTarget(host, target),
        handler: handler
      };
    } else if (Ext.isFunction(handlerHost[handler])) {
      return {
        target: this.locateTarget(host, target),
        handler: handlerHost[handler]
      };
    } else {
      return null;
    }
  },
  /**
  	* Given a target property chain and a property host object, recurse down the property chain and return
  	* the final host object from the property chain, and the final object that will accept the event listener.
  */

  parsePropertyChain: function(host, target) {
    var propertyChain;
    if (Ext.isString(target)) {
      propertyChain = target.split('.');
    } else if (Ext.isArray(target)) {
      propertyChain = target;
    } else {
      return null;
    }
    if (propertyChain.length > 1 && (this.locateTarget(host, propertyChain[0]) != null)) {
      return this.parsePropertyChain(this.locateTarget(host, propertyChain[0]), propertyChain.slice(1));
    } else if (this.isTargetObservable(host, propertyChain[0])) {
      return {
        host: host,
        target: propertyChain[0]
      };
    } else {
      return null;
    }
  },
  /**
  	* Retrieves the value for the specified object key and removes the pair
  	* from the object.
  */

  extract: function(object, key) {
    var value;
    value = object[key];
    delete object[key];
    return value;
  },
  /**
  	* Iterate through the listeners array and remove each event listener.
  */

  destroy: function() {
    var listenerData, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listenerData = _ref[_i];
      Deft.Logger.log("Removing observer on '" + listenerData.targetName + "' for event '" + listenerData.event + "'.");
      listenerData.target.un(listenerData.event, listenerData.handler, listenerData.scope);
    }
    this.listeners = [];
  }
});
