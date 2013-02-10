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
  constructor: function(config) {
    Ext.apply(this, config);
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
  register: function(component, container, pos, eOpts) {
    if (this.matches(component)) {
      this.components.push(component);
      component.on(this.eventName, this.fn, this.scope, this.options);
      if (this.eventName === 'added') {
        this.fn.apply(this.scope || window, arguments);
      }
    }
  },
  unregister: function(component) {
    var index;
    index = Ext.Array.indexOf(this.components, component);
    if (index !== -1) {
      component.un(this.eventName, this.fn, this.scope);
      Ext.Array.erase(this.components, index, 1);
    }
  },
  matches: function(component) {
    if (this.selector === null && this.container === component) {
      return true;
    }
    if (this.container === null && component.is(this.selector)) {
      return true;
    }
    return component.is(this.selector) && component.isDescendantOf(this.container);
  }
});
