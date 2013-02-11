// Generated by CoffeeScript 1.4.0
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Event listener for events fired via the Deft.event.LiveEventBus.
* @private
*/

Ext.define('Deft.event.LiveEventListener', {
  alternateClassName: ['Deft.LiveEventListener'],
  requires: ['Ext.ComponentQuery'],
  mixins: {
    observable: 'Ext.util.Observable'
  },
  constructor: function(config) {
    Ext.apply(this, config);
    if (this.options === null) {
      this.options = {};
    }
    this.mixins.observable.constructor.call(this);
    this.components = [];
  },
  destroy: function() {
    var component, _i, _len, _ref;
    _ref = this.components;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      component = _ref[_i];
      component.un(this.eventName, this.fn, this.scope);
    }
    this.components = null;
  },
  overrideComponent: function(component) {
    var oldFireEvent;
    if (component.liveHandlers !== void 0) {
      return;
    }
    component.liveHandlers = {};
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
  },
  handle: function() {
    return this.fn.apply(this.scope, arguments);
  },
  register: function(component, container, pos, eOpts) {
    var event;
    if (this.selector === null && component !== this.container) {
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
    if (this.eventName === 'added' && this.selector !== null) {
      this.fn.apply(this.scope || window, arguments);
    }
  },
  unregister: function(component) {
    var index;
    index = Ext.Array.indexOf(this.components, component);
    if (index !== -1) {
      Ext.Array.remove(component.liveHandlers[this.eventName], this);
      Ext.Array.erase(this.components, index, 1);
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
