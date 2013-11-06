###
Copyright (c) 2012-2013 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
###

###*
* A mixin that creates and attaches the specified view controller(s) to the target view. Used in conjunction with Deft.mvc.ViewController.
* @deprecated 0.8 Deft.mixin.Controllable has been deprecated and can now be omitted - simply use the \'controller\' class annotation on its own.
###
Ext.define( 'Deft.mixin.Controllable',
	requires: [
		'Ext.Component'
		
		'Deft.core.Class'
		'Deft.log.Logger'
	]
	
	###*
	@private
	###
	onClassMixedIn: ( targetClass ) ->
		Deft.Logger.deprecate( 'Deft.mixin.Controllable has been deprecated and can now be omitted - simply use the \'controller\' class annotation on its own.' )
		return
,
	->
		if Ext.getVersion( 'extjs' ) and Ext.getVersion( 'core' ).isLessThan( '4.1.0' )
			callParentMethod = "callOverridden"
		else
			# Sencha Touch 2.0+, Ext JS 4.1+
			callParentMethod = "callParent"
		
		createControllerInterceptor = () ->
			return ( config = {} ) ->
				if not @ instanceof Ext.ClassManager.get( 'Ext.Component' ) or @$controlled
					return @[ callParentMethod ]( arguments )
				
				controllers = {}
				
				for className in @$controllers
					try
						controller = Ext.create( className, config.controllerConfig || @$controllerConfig[ className ] )
						controllers[ className ] = controller
						controller.controlView( @ )
					catch error
						# NOTE: Ext.Logger.error() will throw an error, masking the error we intend to rethrow, so warn instead.
						Deft.Logger.warn( "Error initializing view controller: an error occurred while creating an instance of the specified controller: '#{ @controller }'." )
						throw error
			
				defaultController = @$controllers[ 0 ]
				
				if @getController is undefined
					@getController = ( className = defaultController ) ->
						return controllers[ className ]
			
				@$controlled = true
				
				return @[ callParentMethod ]( arguments )
			
		
		if Ext.cmd
			oldDerive = Ext.cmd.derive
			Ext.cmd.derive = ( className, base, data, enumerableMembers, xtypes, xtypesChain, xtypeMap, aliases, mixins, names, createdFn ) ->
				if ! data.controller
					oldDerive.apply( @, arguments )
					return
				
				data.$controllers = [ data.controller ]
				data.$controllerConfig = {}
				data.$controllerConfig[ data.controller ] = data.controllerConfig || {}
				
				oldCreated = createdFn
				createdFn = ( Class ) ->
					Class.override(
						constructor: createControllerInterceptor()
					)
					
					if oldCreated
						return oldCreated.apply( @, arguments )
						
					return
				
				oldExtended = data.onClassExtended
				data.onClassExtended = ( Class, data, hooks ) ->
					# Override the constructor for this class with a controller interceptor.
					Deft.Class.hookOnClassCreated( hooks, ( Class ) ->
						Class.override(
							constructor: createControllerInterceptor()
						)
						
						data.$controllers ?= []
						data.$controllerConfig ?= {}
						
						for controller in Class.superclass.$controllers || []
							data.$controllers.push(controller)
						
						Ext.applyIf( data.$controllerConfig, Class.superclass.$controllerConfig )
						
						return
					)
					
					if oldExtended 
						return oldExtended.apply( @, arguments )
					
					return
					
				oldDerive.apply( @, arguments )
					
		
		Deft.Class.registerPreprocessor( 
			'controller'
			( Class, data, hooks, callback ) ->
				data.$controllers = [ data.controller ]
				
				data.$controllerConfig = {}
				data.$controllerConfig[ data.controller ] = data.controllerConfig || {}

				# Override the constructor for this class with a controller interceptor.
				Deft.Class.hookOnClassCreated( hooks, ( Class ) ->
					Class.override(
						constructor: createControllerInterceptor()
					)
					return
				)
				
				# Process any classes that extend this class.
				Deft.Class.hookOnClassExtended( data, ( Class, data, hooks ) ->
					# Override the constructor for this class with a controller interceptor.
					Deft.Class.hookOnClassCreated( hooks, ( Class ) ->
						Class.override(
							constructor: createControllerInterceptor()
						)
						
						data.$controllers ?= []
						data.$controllerConfig ?= {}
						
						for controller in Class.superclass.$controllers || []
							data.$controllers.push(controller)
						
						Ext.applyIf( data.$controllerConfig, Class.superclass.$controllerConfig )
						
						return
					)
					return
				)
				
				# Automatically require the controller class.
				self = @
				Ext.require( [ data.controller ], ->
					if callback?
						callback.call( self, Class, data, hooks )
					return
				)
				return false
			'before'
			'extend'
		)
	
		return
)

