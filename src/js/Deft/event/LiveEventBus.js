// Generated by CoffeeScript 1.4.0
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Event bus for live component selectors.
*/

Ext.define('Deft.event.LiveEventBus', {
  alternateClassName: ['Deft.LiveEventBus'],
  requires: ['Ext.Component', 'Ext.ComponentManager', 'Deft.event.LiveEventListener'],
  singleton: true,
  constructor: function() {
    this.listeners = {};
  },
  destroy: function() {
    var listener, listeners, selector, _i, _len, _ref;
    _ref = this.listeners;
    for (selector in _ref) {
      listeners = _ref[selector];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        listener = listeners[_i];
        listener.destroy();
      }
    }
    this.listeners = null;
  },
  addListener: function(container, selector, eventName, fn, scope, options) {
    var listener;
    listener = Ext.create('Deft.event.LiveEventListener', {
      selector: selector,
      container: container,
      eventName: eventName,
      fn: fn,
      scope: scope,
      options: options
    });
    this.listeners[selector] = this.listeners[selector] || [];
    this.listeners[selector].push(listener);
  },
  removeListener: function(container, selector, eventName, fn, scope) {
    var listener;
    listener = this.findListener(container, selector, eventName, fn, scope);
    if (listener != null) {
      Ext.Array.remove(this.listeners[selector], listener);
      listener.destroy();
    }
  },
  on: function(container, selector, eventName, fn, scope, options) {
    return this.addListener(container, selector, eventName, fn, scope, options);
  },
  un: function(container, selector, eventName, fn, scope) {
    return this.removeListener(container, selector, eventName, fn, scope);
  },
  findListener: function(container, selector, eventName, fn, scope) {
    var listener, _i, _len, _ref;
    if (this.listeners[selector] === void 0) {
      return null;
    }
    _ref = this.listeners[selector];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      if (listener.container === container && listener.eventName === eventName && listener.fn === fn && listener.scope === scope) {
        return listener;
      }
    }
    return null;
  },
  register: function(component) {
    var listener, _i, _len, _ref;
    component.on('added', this.onComponentAdded, this);
    component.on('removed', this.onComponentRemoved, this);
    if (this.listeners[null]) {
      _ref = this.listeners[null];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener.register.apply(listener, arguments);
      }
    }
  },
  unregister: function(component) {
    var listener, _i, _len, _ref;
    component.un('added', this.onComponentAdded, this);
    component.un('removed', this.onComponentRemoved, this);
    if (this.listeners[null]) {
      _ref = this.listeners[null];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener.unregister(component);
      }
    }
  },
  onComponentAdded: function(component, container, pos, eOpts) {
    var listener, listeners, selector, _i, _len, _ref;
    _ref = this.listeners;
    for (selector in _ref) {
      listeners = _ref[selector];
      if (selector !== null && component.is(selector)) {
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          listener.register.apply(listener, arguments);
        }
      }
    }
  },
  onComponentRemoved: function(component, container, eOpts) {
    var listener, listeners, selector, _i, _len, _ref;
    _ref = this.listeners;
    for (selector in _ref) {
      listeners = _ref[selector];
      if (selector !== null && component.is(selector)) {
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          listener.unregister(component);
        }
      }
    }
  }
}, function() {
  Ext.Function.interceptAfter(Ext.ComponentManager, 'register', function(component) {
    Deft.event.LiveEventBus.register(component);
  });
  Ext.Function.interceptAfter(Ext.ComponentManager, 'unregister', function(component) {
    Deft.event.LiveEventBus.unregister(component);
  });
});
