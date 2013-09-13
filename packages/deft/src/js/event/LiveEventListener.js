// Generated by CoffeeScript 1.6.3
/*
Copyright (c) 2012-2013 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Event listener for events fired via the Deft.event.LiveEventBus.
* @private
*/

Ext.define('Deft.event.LiveEventListener', {
  alternateClassName: ['Deft.LiveEventListener'],
  requires: ['Ext.ComponentQuery'],
  constructor: function(config) {
    Ext.apply(this, config);
    if (this.options === null) {
      this.options = {};
    }
    this.components = [];
  },
  destroy: function() {
    var component, _i, _len, _ref;
    _ref = this.components;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      component = _ref[_i];
      this.unregister(component, true);
    }
    this.components = null;
  },
  /**
  	* Overrides the fireEvent method, so the event is fired also in the custom live handlers
  */

  overrideComponent: function(component) {
    var oldFireAction, oldFireEvent;
    if (component.liveHandlers !== void 0) {
      return;
    }
    component.liveHandlers = {};
    if (component.fireEventArgs) {
      oldFireEvent = component.fireEventArgs;
      component.fireEventArgs = function(event, params) {
        var args, handler, _i, _len, _ref;
        if (oldFireEvent.apply(this, arguments) === false) {
          return false;
        }
        if (this.liveHandlers[event] === void 0) {
          return;
        }
        args = [event].concat(Array.prototype.slice.call(params || [], 0));
        _ref = this.liveHandlers[event];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          if (handler.observable.matches(this) && handler.fireEvent.apply(handler, args) === false) {
            return false;
          }
        }
      };
    } else {
      oldFireEvent = component.fireEvent;
      component.fireEvent = function(event) {
        var handler, _i, _len, _ref;
        if (oldFireEvent.apply(this, arguments) === false) {
          return false;
        }
        if (this.liveHandlers[event] === void 0) {
          return;
        }
        _ref = this.liveHandlers[event];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          if (handler.observable.matches(this) && handler.fireEvent.apply(handler, arguments) === false) {
            return false;
          }
        }
      };
    }
    if (!component.fireAction) {
      return;
    }
    oldFireAction = component.fireAction;
    component.fireAction = function(event, params) {
      var args, handler, _i, _len, _ref;
      if (this.liveHandlers[event] === void 0) {
        return oldFireAction.apply(this, arguments);
      }
      args = [event].concat(Array.prototype.slice.call(params || [], 0));
      _ref = this.liveHandlers[event];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        if (handler.observable.matches(this) && handler.fireEvent.apply(handler, args) === false) {
          return false;
        }
      }
    };
  },
  handle: function() {
    return this.fn.apply(this.scope, arguments);
  },
  register: function(component) {
    var event, index;
    index = Ext.Array.indexOf(this.components, component);
    if (this.selector === null && component !== this.container || index !== -1) {
      return;
    }
    this.components.push(component);
    this.overrideComponent(component);
    if (component.liveHandlers[this.eventName] === void 0) {
      component.liveHandlers[this.eventName] = [];
    }
    event = Ext.create('Ext.util.Observable');
    event.observable = this;
    event.addListener(this.eventName, this.handle, this, this.options);
    component.on(this.eventName, Ext.emptyFn, this, this.options);
    component.liveHandlers[this.eventName].push(event);
  },
  unregister: function(component, destroying) {
    var index;
    if (destroying == null) {
      destroying = false;
    }
    index = Ext.Array.indexOf(this.components, component);
    if (index !== -1) {
      component.un(this.eventName, Ext.emptyFn, this, this.options);
      Ext.Array.remove(component.liveHandlers[this.eventName], this);
      if (destroying === false) {
        Ext.Array.erase(this.components, index, 1);
      }
    }
  },
  matches: function(component) {
    if (this.selector === null) {
      return component === this.container;
    }
    if (this.container === null) {
      return true;
    }
    return component.isDescendantOf(this.container);
  }
});
