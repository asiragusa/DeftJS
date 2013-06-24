/*!
DeftJS 0.8.1-pre

Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
Ext.define("Deft.core.Class",{alternateClassName:["Deft.Class"],statics:{registerPreprocessor:function(b,d,a,c){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){Ext.Class.registerPreprocessor(b,function(e,f,g){return d.call(this,e,f,f,g)}).setDefaultPreprocessorPosition(b,a,c)}else{Ext.Class.registerPreprocessor(b,function(f,g,e,h){return d.call(this,f,g,e,h)},[b],a,c)}},hookOnClassCreated:function(a,b){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){Ext.Function.interceptBefore(a,"onClassCreated",b)}else{Ext.Function.interceptBefore(a,"onCreated",b)}},hookOnClassExtended:function(c,b){var a;if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){a=function(d,e){return b.call(this,d,e,e)}}else{a=b}if(c.onClassExtended!=null){Ext.Function.interceptBefore(c,"onClassExtended",a)}else{c.onClassExtended=a}},extendsClass:function(c,b){try{if(Ext.getClassName(b)===c){return true}if(b!=null?b.superclass:void 0){if(Ext.getClassName(b.superclass)===c){return true}else{return Deft.Class.extendsClass(c,Ext.getClass(b.superclass))}}else{return false}}catch(a){return false}}}});Ext.define("Deft.core.Component",{override:"Ext.Component",alternateClassName:["Deft.Component"],constructor:(function(){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){return function(a){if(a!==void 0&&!this.$injected&&(a.inject!=null)){Deft.Injector.inject(a.inject,this,false);this.$injected=true}return this.callOverridden(arguments)}}else{return function(a){if(a!==void 0&&!this.$injected&&(a.inject!=null)){Deft.Injector.inject(a.inject,this,false);this.$injected=true}return this.callParent(arguments)}}})(),setParent:function(c){var b,a;if(Ext.getVersion("touch")!=null){b=this.getParent();a=this.callParent(arguments);if(b===null&&c!==null){this.fireEvent("added",this,c)}else{if(b!==null&&c!==null){this.fireEvent("removed",this,b);this.fireEvent("added",this,c)}else{if(b!==null&&c===null){this.fireEvent("removed",this,b)}}}return a}else{return this.callParent(arguments)}},is:function(a){return Ext.ComponentQuery.is(this,a)},isDescendantOf:function(a){var b;if(Ext.getVersion("touch")!=null){b=this.getParent();while(b!=null){if(b===a){return true}b=b.getParent()}return false}else{return this.callParent(arguments)}}});Ext.define("Deft.log.Logger",{alternateClassName:["Deft.Logger"],singleton:true,log:function(b,a){if(a==null){a="info"}},error:function(a){this.log(a,"error")},info:function(a){this.log(a,"info")},verbose:function(a){this.log(a,"verbose")},warn:function(a){this.log(a,"warn")},deprecate:function(a){this.log(a,"deprecate")}},function(){var a;if(Ext.getVersion("extjs")!=null){this.log=function(c,b){if(b==null){b="info"}if(b==="verbose"){b==="info"}if(b==="deprecate"){b="warn"}Ext.log({msg:c,level:b})}}else{if(Ext.isFunction((a=Ext.Logger)!=null?a.log:void 0)){this.log=Ext.bind(Ext.Logger.log,Ext.Logger)}}});Ext.define("Deft.util.Function",{alternateClassName:["Deft.Function"],statics:{spread:function(b,a){return function(c){if(!Ext.isArray(c)){Ext.Error.raise({msg:"Error spreading passed Array over target function arguments: passed a non-Array."})}return b.apply(a,c)}},memoize:function(d,c,a){var b;b={};return function(f){var e;e=Ext.isFunction(a)?a.apply(c,arguments):f;if(!(e in b)){b[e]=d.apply(c,arguments)}return b[e]}},extract:function(a,b){var c;c=a[b];delete a[b];return c}}});Ext.define("Deft.event.LiveEventListener",{alternateClassName:["Deft.LiveEventListener"],requires:["Ext.ComponentQuery"],mixins:{observable:"Ext.util.Observable"},constructor:function(a){Ext.apply(this,a);if(this.options===null){this.options={}}this.mixins.observable.constructor.call(this);this.components=[]},destroy:function(){var b,d,a,c;c=this.components;for(d=0,a=c.length;d<a;d++){b=c[d];this.unregister(b,true)}this.components=null},overrideComponent:function(b){var a;if(b.liveHandlers!==void 0){return}b.liveHandlers={};a=b.fireEvent;b.fireEvent=function(e){var d,g,c,f;if(a.apply(this,arguments)===false){return false}if(this.liveHandlers[e]===void 0){return}f=this.liveHandlers[e];for(g=0,c=f.length;g<c;g++){d=f[g];if(d.observable.matches(this)&&d.fireEvent.apply(d,arguments)===false){return false}}}},handle:function(){return this.fn.apply(this.scope,arguments)},register:function(b){var c,a;a=Ext.Array.indexOf(this.components,b);if(this.selector===null&&b!==this.container||a!==-1){return}this.components.push(b);this.overrideComponent(b);if(b.liveHandlers[this.eventName]===void 0){b.liveHandlers[this.eventName]=[]}c=Ext.create("Ext.util.Observable");c.observable=this;c.addListener(this.eventName,this.handle,this,this.options);b.on(this.eventName,Ext.emptyFn,this,this.options);b.liveHandlers[this.eventName].push(c)},unregister:function(b,c){var a;if(c==null){c=false}a=Ext.Array.indexOf(this.components,b);if(a!==-1){b.un(this.eventName,Ext.emptyFn,this,this.options);Ext.Array.remove(b.liveHandlers[this.eventName],this);if(c===false){Ext.Array.erase(this.components,a,1)}}},matches:function(a){if(this.selector===null){return a===this.container}if(this.container===null){return true}return a.isDescendantOf(this.container)}});Ext.define("Deft.event.LiveEventBus",{alternateClassName:["Deft.LiveEventBus"],requires:["Ext.Component","Ext.ComponentManager","Deft.event.LiveEventListener"],singleton:true,constructor:function(){this.listeners={}},destroy:function(){var f,c,a,e,b,d;d=this.listeners;for(a in d){c=d[a];for(e=0,b=c.length;e<b;e++){f=c[e];f.destroy()}}this.listeners=null},addListener:function(b,a,c,f,e,d){var g;g=Ext.create("Deft.event.LiveEventListener",{selector:a,container:b,eventName:c,fn:f,scope:e,options:d});this.listeners[a]=this.listeners[a]||[];this.listeners[a].push(g)},removeListener:function(b,a,c,e,d){var f;f=this.findListener(b,a,c,e,d);if(f!=null){Ext.Array.remove(this.listeners[a],f);f.destroy()}},on:function(b,a,c,f,e,d){return this.addListener(b,a,c,f,e,d)},un:function(b,a,c,e,d){return this.removeListener(b,a,c,e,d)},findListener:function(a,c,f,g,i){var b,d,h,e;if(this.listeners[c]===void 0){return null}e=this.listeners[c];for(d=0,h=e.length;d<h;d++){b=e[d];if(b.container===a&&b.eventName===f&&b.fn===g&&b.scope===i){return b}}return null},register:function(c,a){var f,e,b,d;if(a==null){a=null}c.on("added",this.onComponentAdded,this);c.on("removed",this.onComponentRemoved,this);if(this.listeners[a]){d=this.listeners[a];for(e=0,b=d.length;e<b;e++){f=d[e];f.register.apply(f,arguments)}}},unregister:function(b){var e,d,a,c;b.un("added",this.onComponentAdded,this);b.un("removed",this.onComponentRemoved,this);if(this.listeners[null]){c=this.listeners[null];for(d=0,a=c.length;d<a;d++){e=c[d];e.unregister(b)}}},onComponentAdded:function(i,a,h,f){var b,g,c,d,j,e;e=this.listeners;for(c in e){g=e[c];if(c!==null&&i.is(c)){for(d=0,j=g.length;d<j;d++){b=g[d];b.register(i)}}}},onComponentRemoved:function(h,a,f){var b,g,c,d,i,e;e=this.listeners;for(c in e){g=e[c];if(c!==null&&h.is(c)){for(d=0,i=g.length;d<i;d++){b=g[d];b.unregister(h)}}}}},function(){Ext.Function.interceptAfter(Ext.ComponentManager,"register",function(a){Deft.event.LiveEventBus.register(a)});Ext.Function.interceptAfter(Ext.ComponentManager,"unregister",function(a){Deft.event.LiveEventBus.unregister(a)})});Ext.define("Deft.ioc.DependencyProvider",{requires:["Deft.log.Logger"],config:{identifier:null,className:null,parameters:null,fn:null,value:void 0,singleton:true,eager:false},constructor:function(b){var a;this.initConfig(b);if((b.value!=null)&&b.value.constructor===Object){this.setValue(b.value)}if(this.getEager()){if(this.getValue()!=null){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': a 'value' cannot be created eagerly."})}if(!this.getSingleton()){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': only singletons can be created eagerly."})}}if(this.getClassName()!=null){a=Ext.ClassManager.get(this.getClassName());if(!(a!=null)){Deft.Logger.warn("Synchronously loading '"+(this.getClassName())+"'; consider adding Ext.require('"+(this.getClassName())+"') above Ext.onReady.");Ext.syncRequire(this.getClassName());a=Ext.ClassManager.get(this.getClassName())}if(!(a!=null)){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': unrecognized class name or alias: '"+(this.getClassName())+"'"})}}if(!this.getSingleton()){if(this.getClassName()!=null){if(Ext.ClassManager.get(this.getClassName()).singleton){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': singleton classes cannot be configured for injection as a prototype. Consider removing 'singleton: true' from the class definition."})}}if(this.getValue()!=null){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': a 'value' can only be configured as a singleton."})}}else{if((this.getClassName()!=null)&&(this.getParameters()!=null)){if(Ext.ClassManager.get(this.getClassName()).singleton){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': parameters cannot be applied to singleton classes. Consider removing 'singleton: true' from the class definition."})}}}return this},resolve:function(c){var a,b;Deft.Logger.log("Resolving '"+(this.getIdentifier())+"'.");if(this.getValue()!==void 0){return this.getValue()}a=null;if(this.getFn()!=null){Deft.Logger.log("Executing factory function.");a=this.getFn().call(null,c)}else{if(this.getClassName()!=null){if(Ext.ClassManager.get(this.getClassName()).singleton){Deft.Logger.log("Using existing singleton instance of '"+(this.getClassName())+"'.");a=Ext.ClassManager.get(this.getClassName())}else{Deft.Logger.log("Creating instance of '"+(this.getClassName())+"'.");b=this.getParameters()!=null?[this.getClassName()].concat(this.getParameters()):[this.getClassName()];a=Ext.create.apply(this,b)}}else{Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': no 'value', 'fn', or 'className' was specified."})}}if(this.getSingleton()){this.setValue(a)}return a}});Ext.define("Deft.ioc.Injector",{alternateClassName:["Deft.Injector"],requires:["Ext.Component","Deft.log.Logger","Deft.ioc.DependencyProvider"],singleton:true,constructor:function(){this.providers={};this.injectionStack=[];return this},configure:function(b){var a;Deft.Logger.log("Configuring the injector.");a={};Ext.Object.each(b,function(d,c){var e;Deft.Logger.log("Configuring dependency provider for '"+d+"'.");if(Ext.isString(c)){e=Ext.create("Deft.ioc.DependencyProvider",{identifier:d,className:c})}else{e=Ext.create("Deft.ioc.DependencyProvider",Ext.apply({identifier:d},c))}this.providers[d]=e;a[d]=e},this);Ext.Object.each(a,function(c,d){if(d.getEager()){Deft.Logger.log("Eagerly creating '"+(d.getIdentifier())+"'.");d.resolve()}},this)},reset:function(){Deft.Logger.log("Resetting the injector.");this.providers={}},canResolve:function(a){var b;b=this.providers[a];return b!=null},resolve:function(a,b){var c;c=this.providers[a];if(c!=null){return c.resolve(b)}else{Ext.Error.raise({msg:"Error while resolving value to inject: no dependency provider found for '"+a+"'."})}},inject:function(e,f,j){var h,a,b,c,d,i,g;if(j==null){j=true}i=Ext.getClassName(f);if(Ext.Array.contains(this.injectionStack,i)){d=this.injectionStack.join(" -> ");this.injectionStack=[];Ext.Error.raise({msg:"Error resolving dependencies for '"+i+"'. A circular dependency exists in its injections: "+d+" -> *"+i+"*"});return null}this.injectionStack.push(i);h={};if(Ext.isString(e)){e=[e]}Ext.Object.each(e,function(n,o){var m,k,l;l=Ext.isArray(e)?o:n;m=o;k=this.resolve(m,f);if(l in f.config){Deft.Logger.log("Injecting '"+m+"' into '"+l+"' config.");h[l]=k}else{Deft.Logger.log("Injecting '"+m+"' into '"+l+"' property.");f[l]=k}},this);this.injectionStack=[];if(j){for(a in h){g=h[a];c="set"+Ext.String.capitalize(a);f[c].call(f,g)}}else{if((Ext.getVersion("extjs")!=null)&&f instanceof Ext.ClassManager.get("Ext.Component")){f.injectConfig=h}else{if(Ext.isFunction(f.initConfig)){b=f.initConfig;f.initConfig=function(l){var k;k=b.call(this,Ext.Object.merge({},l||{},h));return k}}}}return f}},function(){if(Ext.getVersion("extjs")!=null){if(Ext.getVersion("core").isLessThan("4.1.0")){Ext.Component.override({constructor:function(a){a=Ext.Object.merge({},a||{},this.injectConfig||{});delete this.injectConfig;return this.callOverridden([a])}})}else{Ext.define("Deft.InjectableComponent",{override:"Ext.Component",constructor:function(a){a=Ext.Object.merge({},a||{},this.injectConfig||{});delete this.injectConfig;return this.callParent([a])}})}}});Ext.define("Deft.mixin.Injectable",{requires:["Deft.core.Class","Deft.ioc.Injector","Deft.log.Logger"],onClassMixedIn:function(a){Deft.Logger.deprecate("Deft.mixin.Injectable has been deprecated and can now be omitted - simply use the 'inject' class annotation on its own.")}},function(){var a;if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){a=function(){return function(){if(!this.$injected){Deft.Injector.inject(this.inject,this,false);this.$injected=true}return this.callOverridden(arguments)}}}else{a=function(){return function(){if(!this.$injected){Deft.Injector.inject(this.inject,this,false);this.$injected=true}return this.callParent(arguments)}}}Deft.Class.registerPreprocessor("inject",function(b,e,j,i){var g,f,c,h,d;if(Ext.isString(e.inject)){e.inject=[e.inject]}if(Ext.isArray(e.inject)){g={};d=e.inject;for(c=0,h=d.length;c<h;c++){f=d[c];g[f]=f}e.inject=g}Deft.Class.hookOnClassCreated(j,function(k){k.override({constructor:a()})});Deft.Class.hookOnClassExtended(e,function(m,n,l){var k;Deft.Class.hookOnClassCreated(l,function(o){o.override({constructor:a()})});if((k=n.inject)==null){n.inject={}}Ext.applyIf(n.inject,m.superclass.inject)})},"before","extend")});Ext.define("Deft.mvc.Observer",{requires:["Deft.core.Class","Ext.util.Observable","Deft.util.Function"],statics:{mergeObserve:function(b,l){var d,q,m,r,g,k,o,i,n,p,e,f,a,j,h,c;if(!Ext.isObject(b)){a={}}else{a=Ext.clone(b)}if(!Ext.isObject(l)){g={}}else{g=Ext.clone(l)}i=["buffer","single","delay","element","target","destroyable"];o=function(A){var D,z,u,C,t,v,y,x,B,s,w;w=[];for(C in A){u=A[C];if(Ext.isArray(u)){z={};for(y=0,B=u.length;y<B;y++){v=u[y];if(Ext.Object.getSize(v)===1){Ext.apply(z,v)}else{D={};if((v!=null?v.fn:void 0)!=null){D.fn=v.fn}if((v!=null?v.scope:void 0)!=null){D.scope=v.scope}for(x=0,s=i.length;x<s;x++){t=i[x];if((v!=null?v[t]:void 0)!=null){D[t]=v[t]}}z[v.event]=[D]}}w.push(A[C]=z)}else{w.push(void 0)}}return w};o(a);o(g);for(k in g){q=g[k];for(d in q){m=q[d];if(Ext.isString(m)){g[k][d]=m.replace(" ","").split(",")}if(!(a!=null?a[k]:void 0)){a[k]={}}if(!(a!=null?(h=a[k])!=null?h[d]:void 0:void 0)){a[k][d]=g[k][d];delete g[k][d]}}}for(j in a){p=a[j];for(n in p){e=p[n];if(Ext.isString(e)){a[j][n]=e.split(",")}if(g!=null?(c=g[j])!=null?c[n]:void 0:void 0){r=g[j][n];f=a[j][n];a[j][n]=Ext.Array.unique(Ext.Array.insert(f,0,r))}}}return a}},constructor:function(b){var a,c,f,d,e;this.listeners=[];d=b!=null?b.host:void 0;e=b!=null?b.target:void 0;c=b!=null?b.events:void 0;this.scope=b!=null?b.scope:void 0;if(d&&e&&(this.isPropertyChain(e)||this.isTargetObservable(d,e))){for(a in c){f=c[a];this.createHandler(d,e,a,f)}}else{Deft.Logger.warn("Could not create observers on '"+e+"' because '"+e+"' is not an Ext.util.Observable")}return this},createHandler:function(f,c,b,e){var i,g,j,h,a,d;if(Ext.isString(e)){e=e.replace(" ","").split(",")}if(Ext.isObject(e)){e=[e]}for(a=0,d=e.length;a<d;a++){g=e[a];h=this.scope||f;j=null;if(Ext.isObject(g)){j=Ext.clone(g);if(j!=null?j.event:void 0){b=Deft.util.Function.extract(j,"event")}if(j!=null?j.fn:void 0){g=Deft.util.Function.extract(j,"fn")}if(j!=null?j.scope:void 0){h=Deft.util.Function.extract(j,"scope")}}i={eventName:b,handler:g,scope:h,host:f,target:c,options:j};this.bindHandler(i)}return this},bindHandler:function(b){var a;a=this.locateReferences(b.host,b.target,b.handler);if(a){a.target.on(b.eventName,a.handler,b.scope,b.options);this.listeners.push({targetName:b.target,target:a.target,event:b.eventName,handler:a.handler,scope:b.scope});Deft.Logger.log("Created observer on '"+b.target+"' for event '"+b.eventName+"'.")}else{Deft.Logger.warn("Could not create observer on '"+b.target+"' for event '"+b.eventName+"'.")}return this},isTargetObservable:function(b,e){var a,d,c;a=this.locateTarget(b,e);if(!(a!=null)){return false}d=Ext.ClassManager.getClass(a);if(Deft.Class.extendsClass("Ext.dom.Element",d)){return true}if((a.isObservable!=null)||(((c=a.mixins)!=null?c.observable:void 0)!=null)){return true}else{return Deft.Class.extendsClass("Ext.util.Observable",d)||Deft.Class.extendsClass("Ext.mixin.Observable",d)}},locateTarget:function(b,c){var a;if(Ext.isFunction(b["get"+Ext.String.capitalize(c)])){a=b["get"+Ext.String.capitalize(c)].call(b);return a}else{if((b!=null?b[c]:void 0)!=null){a=b[c];return a}else{return null}}},isPropertyChain:function(a){return Ext.isString(a)&&a.indexOf(".")>-1},locateReferences:function(c,d,a){var b,e;b=this.scope||c;if(this.isPropertyChain(d)){e=this.parsePropertyChain(c,d);if(!e){return null}c=e.host;d=e.target}if(Ext.isFunction(a)){return{target:this.locateTarget(c,d),handler:a}}else{if(Ext.isFunction(b[a])){return{target:this.locateTarget(c,d),handler:b[a]}}else{return null}}},parsePropertyChain:function(a,b){var c;if(Ext.isString(b)){c=b.split(".")}else{if(Ext.isArray(b)){c=b}else{return null}}if(c.length>1&&(this.locateTarget(a,c[0])!=null)){return this.parsePropertyChain(this.locateTarget(a,c[0]),c.slice(1))}else{if(this.isTargetObservable(a,c[0])){return{host:a,target:c[0]}}else{return null}}},destroy:function(){var d,c,a,b;b=this.listeners;for(c=0,a=b.length;c<a;c++){d=b[c];Deft.Logger.log("Removing observer on '"+d.targetName+"' for event '"+d.event+"'.");d.target.un(d.event,d.handler,d.scope)}this.listeners=[]}});Ext.define("Deft.mvc.ComponentSelectorListener",{requires:["Deft.event.LiveEventBus"],constructor:function(c){var b,e,a,d;Ext.apply(this,c);if(this.componentSelector.live){Deft.LiveEventBus.addListener(this.componentSelector.view,this.componentSelector.selector,this.eventName,this.fn,this.scope,this.options)}else{d=this.componentSelector.components;for(e=0,a=d.length;e<a;e++){b=d[e];b.on(this.eventName,this.fn,this.scope,this.options)}}return this},destroy:function(){var b,d,a,c;if(this.componentSelector.live){Deft.LiveEventBus.removeListener(this.componentSelector.view,this.componentSelector.selector,this.eventName,this.fn,this.scope)}else{c=this.componentSelector.components;for(d=0,a=c.length;d<a;d++){b=c[d];b.un(this.eventName,this.fn,this.scope)}}}});Ext.define("Deft.mvc.ComponentSelector",{requires:["Ext.ComponentQuery","Deft.log.Logger","Deft.mvc.ComponentSelectorListener"],constructor:function(c){var a,e,g,b,d,f;Ext.apply(this,c);this.selectorListeners=[];if(Ext.isObject(this.listeners)){f=this.listeners;for(a in f){g=f[a];e=g;d=this.scope;b=null;if(Ext.isObject(g)){b=Ext.apply({},g);if(b.fn!=null){e=b.fn;delete b.fn}if(b.scope!=null){d=b.scope;delete b.scope}}if(Ext.isString(e)&&Ext.isFunction(d[e])){e=d[e]}if(!Ext.isFunction(e)){Ext.Error.raise({msg:"Error adding '"+a+"' listener: the specified handler '"+e+"' is not a Function or does not exist."})}this.addListener(a,e,d,b)}}return this},destroy:function(){var d,c,a,b;b=this.selectorListeners;for(c=0,a=b.length;c<a;c++){d=b[c];d.destroy()}this.selectorListeners=[]},addListener:function(a,d,c,b){var e;if(this.findListener(a,d,c)!=null){Ext.Error.raise({msg:"Error adding '"+a+"' listener: an existing listener for the specified function was already registered for '"+this.selector+"."})}Deft.Logger.log("Adding '"+a+"' listener to '"+(this.selector||"view")+"'.");e=Ext.create("Deft.mvc.ComponentSelectorListener",{componentSelector:this,eventName:a,fn:d,scope:c,options:b});this.selectorListeners.push(e)},removeListener:function(a,c,b){var d;d=this.findListener(a,c,b);if(d!=null){Deft.Logger.log("Removing '"+a+"' listener from '"+this.selector+"'.");d.destroy();Ext.Array.remove(this.selectorListeners,d)}},findListener:function(b,d,c){var g,f,a,e;e=this.selectorListeners;for(f=0,a=e.length;f<a;f++){g=e[f];if(g.eventName===b&&g.fn===d&&g.scope===c){return g}}return null}});Ext.define("Deft.mvc.ViewController",{alternateClassName:["Deft.ViewController"],requires:["Deft.core.Class","Deft.log.Logger","Deft.mvc.ComponentSelector","Deft.mvc.Observer"],config:{view:null},observe:{},control:{},constructor:function(a){if(a==null){a={}}this.initConfig(a);this.registeredObservers={};if(a.view){this.controlView(a.view)}if(Ext.Object.getSize(this.observe)>0){this.createObservers()}return this},controlView:function(a){if(a instanceof Ext.ClassManager.get("Ext.Component")){this.setView(a);this.registeredComponentReferences={};this.registeredComponentSelectors={};this.initComponentSelectors={};this.observeComponentSelectors={};this.initializeView()}else{Ext.Error.raise({msg:"Error constructing ViewController: the configured 'view' is not an Ext.Component."})}},init:function(){},destroy:function(){var d,c,a,b;this.cleanupDefaultViewListeners();b=this.observeComponentSelectors;for(a in b){c=b[a];c.destroy();delete this.observeComponentSelectors[a]}for(d in this.registeredComponentReferences){this.removeComponentReference(d)}for(a in this.registeredComponentSelectors){this.removeComponentSelector(a)}this.removeObservers();return true},$control:(function(){var a;if(Ext.getVersion("extjs")){return a={view:{beforedestroy:{fn:"onViewBeforeDestroy"},afterrender:{single:true,fn:"onViewInitialize"}}}}else{return a={view:{intiialize:{single:true,fn:"onViewInitialize"}}}}})(),setupDefaultViewListeners:function(){var a;a=Ext.create("Deft.mvc.ComponentSelector",{view:this.getView(),selector:null,listeners:this.$control.view,scope:this,live:true});this.initComponentSelectors[null]=a;if(!this.control.view){this.control.view={}}},cleanupDefaultViewListeners:function(){this.initComponentSelectors[null].destroy();delete this.initComponentSelectors[null]},onViewInitialize:function(){this.init()},createViewObservers:function(a,b){a.$observers={};return this.createObservers(b.observe,a.$observers,a)},removeViewObservers:function(a){return this.removeObservers(a.$observers)},addComponentObserver:function(a,c){var b;if(Ext.getVersion("extjs")){b=Ext.create("Deft.mvc.ComponentSelector",{view:this.getView(),selector:a,listeners:{afterrender:{fn:"createViewObservers",observe:c},removed:{fn:"removeViewObservers"}},scope:this,live:true})}else{b=Ext.create("Deft.mvc.ComponentSelector",{view:this.getView(),selector:a,listeners:{initialize:{fn:"createViewObservers",observe:c},removed:{fn:"removeViewObservers"}},scope:this,live:true})}return this.observeComponentSelectors[a]=b},initializeView:function(){var c,i,a,k,b,j,f,d,e,m,g,l,h;d=this.getView().rendered||this.getView().initialized;this.setupDefaultViewListeners();h=this.control;for(b in h){c=h[b];e=null;if(b!=="view"){if(Ext.isString(c)){e=c}else{if(c.selector!=null){e=c.selector}else{e="#"+b}}}j=null;if(Ext.isObject(c.listeners)){j=c.listeners}else{if(!((c.selector!=null)||(c.live!=null)||(c.observe!=null))){j=c}}this.addComponentReference(b,e);this.addComponentSelector(e,j);if(Ext.isObject(c.observe)){this.addComponentObserver(e,c.observe)}if(d===true){k="get"+Ext.String.capitalize(b);a=this[k]();if(!Ext.isArray(a)){a=[a]}for(g=0,l=a.length;g<l;g++){i=a[g];if(i!==null){Deft.LiveEventBus.register(i,e)}}}}if(Ext.getVersion("extjs")!=null){if(this.getView().rendered){this.onViewInitialize()}}else{m=this;f=this.getView().destroy;this.getView().destroy=function(){if(m.destroy()!==false){return f.call(this)}return false};if(this.getView().initialized){this.onViewInitialize()}}},onViewBeforeDestroy:function(){return this.destroy()},addComponentReference:function(c,a){var b;if(this.registeredComponentReferences[c]!=null){Ext.Error.raise({msg:"Error adding component reference: an existing component reference was already registered as '"+c+"'."})}if(c!=="view"){b="get"+Ext.String.capitalize(c);if(this[b]==null){Deft.Logger.log("Adding '"+c+"' component reference for selector: '"+a+"'.");this[b]=Ext.Function.pass(this.getViewComponent,[a],this);this[b].generated=true;this.registeredComponentReferences[c]=true}}},removeComponentReference:function(b){var a;Deft.Logger.log("Removing '"+b+"' component reference.");if(this.registeredComponentReferences[b]==null){Ext.Error.raise({msg:"Error removing component reference: no component reference is registered as '"+b+"'."})}if(b!=="view"){a="get"+Ext.String.capitalize(b);if(this[a].generated){this[a]=null}}delete this.registeredComponentReferences[b]},getViewComponent:function(a){var b;if(a!=null){b=Ext.ComponentQuery.query(a,this.getView());if(b.length===0){return null}else{if(b.length===1){return b[0]}else{return b}}}else{return this.getView()}},addComponentSelector:function(a,b){var c,d;Deft.Logger.log("Adding component selector for: '"+(a||"view")+"'.");d=this.getComponentSelector(a);if(d!=null){Ext.Error.raise({msg:"Error adding component selector: an existing component selector was already registered for '"+a+"'."})}c=Ext.create("Deft.mvc.ComponentSelector",{view:this.getView(),selector:a,listeners:b,scope:this,live:true});this.registeredComponentSelectors[a]=c},removeComponentSelector:function(a){var b;Deft.Logger.log("Removing component selector for '"+a+"'.");b=this.getComponentSelector(a);if(b==null){Ext.Error.raise({msg:"Error removing component selector: no component selector registered for '"+a+"'."})}b.destroy();delete this.registeredComponentSelectors[a]},getComponentSelector:function(a){return this.registeredComponentSelectors[a]},createObservers:function(e,b,c){var a,d;if(e==null){e=this.observe}if(b==null){b=this.registeredObservers}if(c==null){c=this}for(d in e){a=e[d];this.addObserver(d,a,b,c)}},addObserver:function(e,c,b,d){var a;if(b==null){b=this.registeredObservers}if(d==null){d=this}a=Ext.create("Deft.mvc.Observer",{host:d,target:e,events:c,scope:this});return b[e]=a},removeObservers:function(b){var a,c;if(b==null){b=this.registeredObservers}for(c in b){a=b[c];a.destroy();delete b[c]}}},function(){return Deft.Class.registerPreprocessor("observe",function(b,c,a,d){Deft.Class.hookOnClassExtended(c,function(f,h,e){var g;if(f.superclass&&((g=f.superclass)!=null?g.observe:void 0)&&Deft.Class.extendsClass("Deft.mvc.ViewController",f)){h.observe=Deft.mvc.Observer.mergeObserve(f.superclass.observe,h.observe)}})},"before","extend")});Ext.define("Deft.mvc.Application",{alternateClassName:["Deft.Application"],initialized:false,constructor:function(a){if(a==null){a={}}this.initConfig(a);Ext.onReady(function(){this.init();this.initialized=true},this);return this},init:function(){}});Ext.define("Deft.mixin.Controllable",{requires:["Ext.Component","Deft.core.Class","Deft.log.Logger"],onClassMixedIn:function(a){Deft.Logger.deprecate("Deft.mixin.Controllable has been deprecated and can now be omitted - simply use the 'controller' class annotation on its own.")}},function(){var b,a;a=function(c){return function(f){var d;if(f==null){f={}}if(this.$controlled){return this[c](arguments)}if(!(this instanceof Ext.ClassManager.get("Ext.Component"))){Ext.Error.raise({msg:"Error constructing ViewController: the configured 'view' is not an Ext.Component."})}try{d=Ext.create(this.controller,f.controllerConfig||this.controllerConfig||{})}catch(e){Deft.Logger.warn("Error initializing view controller: an error occurred while creating an instance of the specified controller: '"+this.controller+"'.");throw e}if(this.getController===void 0){this.getController=function(){return d}}d.controlView(this);this.$controlled=true;this[c](arguments);return this}};if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){b="callOverridden"}else{b="callParent"}Deft.Class.registerPreprocessor("controller",function(e,f,c,g){var d;Deft.Class.hookOnClassCreated(c,function(h){h.override({constructor:a(b)})});Deft.Class.hookOnClassExtended(f,function(i,j,h){Deft.Class.hookOnClassCreated(h,function(k){k.override({constructor:a(b)})})});d=this;Ext.require([f.controller],function(){if(g!=null){g.call(d,e,f,c)}});return false},"before","extend")});Ext.define("Deft.promise.Promise",{alternateClassName:["Deft.Promise"],statics:{when:function(a){var b;if(a instanceof Ext.ClassManager.get("Deft.promise.Promise")||a instanceof Ext.ClassManager.get("Deft.promise.Deferred")){return a.then()}else{if(Ext.isObject(a)&&Ext.isFunction(a.then)){b=Ext.create("Deft.promise.Deferred");a.then(function(c){b.resolve(c)},function(c){b.reject(c)});return b.then()}else{b=Ext.create("Deft.promise.Deferred");b.resolve(a);return b.then()}}},all:function(a){return this.when(a).then({success:function(n){var q,l,i,h,r,d,e,j,p,k,m,c,f,s,g,b,o;r=Ext.create("Deft.promise.Deferred");s=n.length;c=new Array(n);m=0;g=function(t){r.update(t);return t};f=function(t,u){c[t]=u;m++;if(m===s){i();r.resolve(c)}return u};k=function(t){i();r.reject(t);return t};l=function(t){i();r.cancel(t);return t};i=function(){return g=f=k=l=Ext.emptyFn};h=function(t){return function(u){return f(t,u)}};d=function(t){return k(t)};j=function(t){return g(t)};q=function(t){return l(t)};for(e=b=0,o=n.length;b<o;e=++b){p=n[e];if(e in n){this.when(p).then({success:h(e),failure:d,progress:j,cancel:q})}}return r.getPromise()},scope:this})},any:function(a){return this.some(a,1).then({success:function(b){return b[0]}})},some:function(b,a){return this.when(b).then({success:function(p){var t,n,k,u,o,f,g,l,s,m,i,q,h,e,j,d,c,r;d=[];q=a;i=(p.length-q)+1;u=Ext.create("Deft.promise.Deferred");if(p.length<a){u.reject(new Error("Too few Promises or values were supplied to obtain the requested number of resolved values."))}else{o=a===1?"No Promises were resolved.":"Too few Promises were resolved.";j=function(v){u.update(v);return v};h=function(v){d.push(v);q--;if(q===0){k();u.resolve(d)}return v};m=function(v){i--;if(i===0){k();u.reject(new Error(o))}return v};n=function(v){i--;if(i===0){k();u.reject(new Error(o))}return v};k=function(){return j=h=m=n=Ext.emptyFn};e=function(v){return h(v)};f=function(v){return m(v)};l=function(v){return j(v)};t=function(v){return n(v)};for(g=c=0,r=p.length;c<r;g=++c){s=p[g];if(g in p){this.when(s).then({success:e,failure:f,progress:l,cancel:t})}}}return u.getPromise()},scope:this})},memoize:function(d,c,a){var b;b=Deft.util.Function.memoize(d,c,a);return Ext.bind(function(){return this.all(Ext.Array.toArray(arguments)).then(function(e){return b.apply(c,e)})},this)},map:function(c,b){var a;a=function(d){return function(e){return b(e,d,c)}};return this.when(c).then({success:function(i){var f,d,g,h,e;g=new Array(i.length);for(f=h=0,e=i.length;h<e;f=++h){d=i[f];if(f in i){g[f]=this.when(d).then(a(f))}}return this.reduce(g,this.reduceIntoArray,g)},scope:this})},reduce:function(c,b,a){var d;d=arguments.length===3;return this.when(c).then({success:function(f){var e,g;g=this.when;e=[function(i,j,h){return g(i).then(function(k){return g(j).then(function(l){return b(k,l,h,f)})})}];if(d){e.push(a)}return this.when(this.reduceArray.apply(f,e))},scope:this})},reduceArray:function(b,a){var e,g,d,f,c;d=0;g=Object(this);f=g.length>>>0;e=arguments;if(e.length<=1){while(true){if(d in g){c=g[d++];break}if(++d>=f){throw new TypeError()}}}else{c=e[1]}while(d<f){if(d in g){c=b(c,g[d],d,g)}d++}return c},reduceIntoArray:function(b,c,a){b[a]=c;return b}},id:null,constructor:function(a){this.id=a.id;this.deferred=a.deferred;return this},then:function(a){return this.deferred.then.apply(this.deferred,arguments)},otherwise:function(b,a){return this.deferred.otherwise.apply(this.deferred,arguments)},always:function(b,a){return this.deferred.always.apply(this.deferred,arguments)},cancel:function(a){return this.deferred.cancel(a)},getState:function(){return this.deferred.getState()},toString:function(){if(this.id!=null){return"Promise "+this.id}return"Promise"}},function(){if(Array.prototype.reduce!=null){this.reduceArray=Array.prototype.reduce}});Ext.define("Deft.promise.Deferred",{alternateClassName:["Deft.Deferred"],requires:["Deft.log.Logger","Deft.promise.Promise"],statics:{enableLogging:true,logMessage:function(a){if(Deft.promise.Deferred.enableLogging){return Deft.Logger.log(a)}}},id:null,constructor:function(a){if(a==null){a={}}this.id=a.id;this.state="pending";this.progress=void 0;this.value=void 0;this.progressCallbacks=[];this.successCallbacks=[];this.failureCallbacks=[];this.cancelCallbacks=[];this.promise=Ext.create("Deft.Promise",{id:this.id?"of "+this.id:null,deferred:this});return this},then:function(f){var h,i,k,a,c,j,b,d,g,e;if(Ext.isObject(f)){b=f.success,a=f.failure,c=f.progress,i=f.cancel,j=f.scope}else{b=arguments[0],a=arguments[1],c=arguments[2],i=arguments[3],j=arguments[4]}e=[b,a,c,i];for(d=0,g=e.length;d<g;d++){h=e[d];if(!(Ext.isFunction(h)||h===null||h===void 0)){Ext.Error.raise({msg:"Error while registering callback with "+this+": a non-function specified."})}}k=Ext.create("Deft.promise.Deferred",{id:"transformed result of "+this});this.register(this.wrapCallback(k,b,j,"success","resolve"),this.successCallbacks,"resolved",this.value);this.register(this.wrapCallback(k,a,j,"failure","reject"),this.failureCallbacks,"rejected",this.value);this.register(this.wrapCallback(k,i,j,"cancel","cancel"),this.cancelCallbacks,"cancelled",this.value);this.register(this.wrapProgressCallback(k,c,j),this.progressCallbacks,"pending",this.progress);Deft.promise.Deferred.logMessage("Returning "+(k.getPromise())+".");return k.getPromise()},otherwise:function(c,a){var b;if(Ext.isObject(c)){b=c,c=b.fn,a=b.scope}return this.then({failure:c,scope:a})},always:function(c,a){var b;if(Ext.isObject(c)){b=c,c=b.fn,a=b.scope}return this.then({success:c,failure:c,cancel:c,scope:a})},update:function(a){Deft.promise.Deferred.logMessage(""+this+" updated with progress: "+a);if(this.state==="pending"){this.progress=a;this.notify(this.progressCallbacks,a)}else{if(this.state!=="cancelled"){Ext.Error.raise({msg:"Error: this "+this+" has already been completed and cannot be modified."})}}},resolve:function(a){Deft.promise.Deferred.logMessage(""+this+" resolved with value: "+a);this.complete("resolved",a,this.successCallbacks)},reject:function(a){Deft.promise.Deferred.logMessage(""+this+" rejected with error: "+a);this.complete("rejected",a,this.failureCallbacks)},cancel:function(a){Deft.promise.Deferred.logMessage(""+this+" cancelled with reason: "+a);this.complete("cancelled",a,this.cancelCallbacks)},getPromise:function(){return this.promise},getState:function(){return this.state},toString:function(){if(this.id!=null){return"Deferred "+this.id}return"Deferred"},wrapCallback:function(b,f,c,e,d){var a;a=this;if(f!=null){Deft.promise.Deferred.logMessage("Registering "+e+" callback for "+a+".")}return function(i){var g;if(Ext.isFunction(f)){try{Deft.promise.Deferred.logMessage("Calling "+e+" callback registered for "+a+".");g=f.call(c,i);if(g instanceof Ext.ClassManager.get("Deft.promise.Promise")||g instanceof Ext.ClassManager.get("Deft.promise.Deferred")){Deft.promise.Deferred.logMessage(""+(b.getPromise())+" will be completed based on the "+g+" returned by the "+e+" callback.");g.then(Ext.bind(b.resolve,b),Ext.bind(b.reject,b),Ext.bind(b.update,b),Ext.bind(b.cancel,b))}else{Deft.promise.Deferred.logMessage(""+(b.getPromise())+" resolved with the value returned by the "+e+" callback: "+g+".");b.resolve(g)}}catch(h){if(Ext.Array.contains(["RangeError","ReferenceError","SyntaxError","TypeError"],h.name)){Deft.Logger.error("Error: "+e+" callback for "+a+" threw: "+(h.stack!=null?h.stack:h))}else{Deft.promise.Deferred.logMessage(""+(b.getPromise())+" rejected with the Error returned by the "+e+" callback: "+h)}b.reject(h)}}else{Deft.promise.Deferred.logMessage(""+(b.getPromise())+" resolved with the value: "+i+".");b[d](i)}}},wrapProgressCallback:function(b,d,c){var a;a=this;if(d!=null){Deft.promise.Deferred.logMessage("Registering progress callback for "+a+".")}return function(g){var e;if(Ext.isFunction(d)){try{Deft.promise.Deferred.logMessage("Calling progress callback registered for "+a+".");e=d.call(c,g);Deft.promise.Deferred.logMessage(""+(b.getPromise())+" updated with progress returned by the progress callback: "+e+".");b.update(e)}catch(f){Deft.Logger.error("Error: progress callback registered for "+a+" threw: "+(f.stack!=null?f.stack:f))}}else{Deft.promise.Deferred.logMessage(""+(b.getPromise())+" updated with progress: "+g);b.update(g)}}},register:function(d,a,c,b){if(Ext.isFunction(d)){if(this.state==="pending"){a.push(d);if(this.state===c&&b!==void 0){this.notify([d],b)}}else{if(this.state===c){this.notify([d],b)}}}},complete:function(c,b,a){if(this.state==="pending"){this.state=c;this.value=b;this.notify(a,b);this.releaseCallbacks()}else{if(this.state!=="cancelled"){Ext.Error.raise({msg:"Error: this "+this+" has already been completed and cannot be modified."})}}},notify:function(b,d){var e,c,a;for(c=0,a=b.length;c<a;c++){e=b[c];e(d)}},releaseCallbacks:function(){this.progressCallbacks=null;this.successCallbacks=null;this.failureCallbacks=null;this.cancelCallbacks=null}});Ext.define("Deft.promise.Chain",{alternateClassName:["Deft.Chain"],requires:["Deft.promise.Promise"],statics:{sequence:function(a,b){return Deft.Promise.reduce(a,function(c,d){return Deft.Promise.when(d.call(b)).then(function(e){c.push(e);return c})},[])},parallel:function(a,b){return Deft.Promise.map(a,function(c){return c.call(b)})},pipeline:function(b,c,a){return Deft.Promise.reduce(b,function(e,d){return d.call(c,e)},a)}}});
