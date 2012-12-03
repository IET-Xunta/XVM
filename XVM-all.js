/**
* XVM: Xeovisor Minimo 
* ----------------------------------------------
* Copyright (c) 2012, Xunta de Galicia. All rights reserved.
* Code licensed under the BSD License: 
*   LICENSE.txt file available at the root application directory
*
* https://forxa.mancomun.org/projects/xeoportal
* http://xeovisorminimo.forxa.mancomun.org
*
*/

/**
 * XeoVisor minimo uses YAML files to config application files. Is
 * neccesary JS-YAML library to do this operation.
 */

/**
 * Namespace to XeoVisor Mínimo
 */

var XVM = {
	
	/**
	 * The version number
	 */
	VERSION_NUMBER : 2,
	
	/**
	 * Loaders namespace 
	 */
	Loader : {},
	
	/**
	 * Control namespace
	 */
	Control : {},
	
	/**
	 * Utils namespace
	 */
	Util : { 
		'getLocationSearch' : function() {
			return window.location.search;
		}
	},
	
	/**
	 * Events namespace
	 */
	Event : {},
	
	/**
	 * Event Bus
	 * Saves inside the eventbus of XVM
	 */
	EventBus : null,

	/**
	 * Default Global Reader
	 */
	Reader : null,

	/**
	 * Default Map Div Name
	 */
	DIVNAME : 'map',

	/**
	 * Default Map Config File URL
	 */
	CONFIGFILE : 'file:///home/jlopez/workspace-web/XVM/config/map.options.yaml',

	/**
	 * Default Layers Config File URL
	 */
	LAYERSFILE : 'file:///home/jlopez/workspace-web/XVM/config/map.layers.yaml',

	/**
	 * Default Controls Config File URL
	 */
	CONTROLSFILE : 'file:///home/jlopez/workspace-web/XVM/config/map.controls.yaml',

	/**
	 * Default Controls Folder
	 */
	CONTROLSFOLDER : 'file:///home/jlopez/workspace-web/Control',

	/**
	 * Default method for building the global objects
	 */
	_initGlobalContext : function() {
		this.EventBus = new XVM.Event.EventBus();
		this.Reader = new XVM.Loader.Reader();
	},

	/**
	 * Default method for building loaders
	 */
	_createDefaultLoaders : function() {
		new XVM.Loader.Config();
		new XVM.Loader.Layers();
		new XVM.Loader.Controls();
	},

	/**
	 * Default method for building a map
	 */
	createDefaultMap : function(divName) {
		this._initGlobalContext();
		new XVM.Map(divName);
		this._createDefaultLoaders();
	}
};

XVM.Class = function() {
};

XVM.Class.prototype.initialize = function() {
	throw 'It is necessary overwrite this method';
};

XVM.Class.extend = function(def) {
	var classDef = function() {
		if(arguments[0] !== XVM.Class) {
			this.initialize.apply(this, arguments);
		}
	};

	var proto = new this(XVM.Class);
	var superClass = this.prototype;

	for(var n in def) {
		var item = def[n];
		if( item instanceof Function)
			item.$ = superClass;
		proto[n] = item;
	}

	classDef.prototype = proto;

	//Give this new class the same static extend method
	classDef.extend = this.extend;
	return classDef;
};

XVM.Map = function() {
	
	/**
	 * Property
	 * {Array(OpenLayers.Layer)}
	 */
	this.OLLayers = null;
	
	/**
	 * Saves OpenLayers Map
	 * Property
	 * {OpenLayers.Map}
	 */
	this.OLMap = null;
	
	/**
	 * Saves XVM Controls
	 * Property
	 * {Array(XVM.Control)}
	 */
	this.controls = [];
	
	/**
	 * Saves config parameters
	 * Property
	 * {Object}
	 */
	this.parameters = null;
	
	/**
	 * 
	 */
	this.loaded = 0;

	this.divName = null;

	/**
	 * Launched with event addConfigParameter
	 */
	this.addConfigParameters = function(parameters) {
		
		this.parameters = parameters;

		var options = {
			projection : new OpenLayers.Projection(parameters.map_settings.epsg.toString()),
			displayProjection: new OpenLayers.Projection(parameters.map_settings.epsg.toString()),
			units: parameters.map_settings.units,
			resolutions	: parameters.map_settings.resolutions,
			maxResolution: 1000,
			tileSize: new OpenLayers.Size(
				parseInt(parameters.map_settings.tile_size[0]),
				parseInt(parameters.map_settings.tile_size[1])
			),
			maxExtent : new OpenLayers.Bounds(
				parseInt(parameters.map_settings.bounds[0]),
				parseInt(parameters.map_settings.bounds[1]),
				parseInt(parameters.map_settings.bounds[2]),
				parseInt(parameters.map_settings.bounds[3])
			),
			controls : []
		};
		this.OLMap = new OpenLayers.Map(this.divName, options);
		$('#' + this.divName).css(
			{
				'height' : parameters.general.height_map + 'px',  
				'width' : parameters.general.width_map + 'px',
				'margin' : parameters.general.margin + 'px'
			}
		);
		this.OLMap.panel = new OpenLayers.Control.Panel();
		this.OLMap.addControl(this.OLMap.panel);
		this.loaded += 1;
		if(this.loaded == 3) {
			this.drawMap();
		};
	};
	
	/**
	 * Launched with event addLayers
	 */
	this.addLayers = function(layers) {
		if (!this.OLLayers) {
			this.OLLayers = layers;
			this.loaded += 1;
			if(this.loaded == 3) {
				this.drawMap();
			}
		} else {
			this.OLLayers = this.OLLayers.concat(layers);
			if(this.loaded == 3) {
				this.addLayersToOLMap(layers);
			}
		}
	};
	
	/**
	 * 
	 */
	this.addControls = function(controls) {
		this.controls = controls;
		this.loaded += 1;
		if(this.loaded == 3) {
			this.drawMap();
		}
	};
	
	this.addLayersToOLMap = function(layers) {
		//this.OLMap.addLayers(this.OLLayers);
		var baseLayer = this.OLMap.baseLayer;

		for(var n=0; n<layers.length; n++) {
			var layer = layers[n];
			this.OLMap.addLayer(layer);
			this.OLMap.setLayerIndex(layer, layer.layer_position);
			
			if (layer.isBaseLayer == true) {
				if (baseLayer == null) 
					baseLayer = layer;
				else 
					baseLayer = (baseLayer.layer_position > layer.layer_position) ? layer : baseLayer;	
			};
		};

		if (baseLayer != null) {
			this.OLMap.setBaseLayer(baseLayer);
		}
	};

	/**
	 * REFACTOR
	 */
	this.drawMap = function() {
		
		this.addLayersToOLMap(this.OLLayers);

		// Temporarily added control
		for(var n=0; n<this.controls.length; n++) {
			this.addXVMControl(this.controls[n]);
		}

		if (typeof this.parameters.view_settings !== 'undefined') {
			if ((typeof this.parameters.view_settings.bbox !== 'undefined')
					&& (this.parameters.view_settings.bbox.length == 4)) {
				var extent = new OpenLayers.Bounds(
					parseInt(this.parameters.view_settings.bbox[0]),
					parseInt(this.parameters.view_settings.bbox[1]),
					parseInt(this.parameters.view_settings.bbox[2]),
					parseInt(this.parameters.view_settings.bbox[3])
				);
				this.OLMap.zoomToExtent(extent, true);
			} else {
				if ((typeof this.parameters.view_settings.center !== 'undefined')
						&& (typeof this.parameters.view_settings.center.lon !== 'undefined')
						&& (typeof this.parameters.view_settings.center.lat !== 'undefined')) {
					var center = new OpenLayers.LonLat(
							this.parameters.view_settings.center.lon,
							this.parameters.view_settings.center.lat);
					this.OLMap.setCenter(center);
				}
				if (typeof this.parameters.view_settings.zoom !== 'undefined') {
					this.OLMap.zoomTo(this.parameters.view_settings.zoom);
				}
			}
		}
	};
	
	/**
	 * Constructor
	 */
	this.init = function(divName) {
		this.divName = (typeof divName === "undefined") ? XVM.DIVNAME : divName;
		OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
		XVM.EventBus.addListener(this, 'addConfigParameters', 'addConfigParameters');
		XVM.EventBus.addListener(this, 'addLayers', 'addLayers');
		XVM.EventBus.addListener(this, 'addControls', 'addControls');
	}
	
	this.addXVMControl = function(control) {
		if (!(control instanceof XVM.Control)) {
			throw 'Control not supported';
		}
		control.setOLMap(this.OLMap);
	};

	this.init();
};

function evalObject(object) {
	for(var o in object) {
        if(typeof(object[o]) === 'object'){
        	evalObject(object[o]);
        } else {
            if ((typeof(object[o]) === 'string') && (object[o].substring(0, 5) == "eval(") && (object[o].substring(object[o].length-1) == ")")) {
                object[o] = eval(object[o].substring(5, object[o].length-1));
            }
        }
    }
};

function isArray(a) {
	    return Object.prototype.toString.apply(a) === '[object Array]';
};

function overrideValues(object, override) {
	for(var o in object) {
        if((typeof object[o] === 'object') && (!isArray(object[o]))){
        	object[o] = overrideValues(object[o], override);
        } else {
        	if ((typeof override[o] !== 'undefined')) {
        		object[o] = override[o];
        	}
        }
    }
	return object;
};

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

XVM.Loader.Reader = function() {

	/**
	 * Load a new css file
	 *
	 * Method
	 * Parameters:
	 * {String} path to css file
	 */
	this.loadCssFile = function(path) {
		$.ajax({
			type: "GET",
			url: path,
			success: function()
			{
				var fileref=document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", this.url);
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		});
	};

	/**
	 * Parse a YAML file and save response into object
	 * attribute
	 *  
	 * Method
	 * Parameters: 
	 * {String} path to YAML file
	 * {Function} callback function to execute after loading
	 * {Object} context to execute the callback in
	 */
	this.readFromFile = function(path, callBack, context) {
		this._call(path,
			callBack,
			'text', 
			context);
	};
	
	this.loadScript = function(url, callBack, context) {
		$.ajax({
			type : 'GET',
			url : url,
			context : context,
			dataType : 'script',
			success : function(response) {
				callBack(response, this);
			},
			error : function(xhr, textStatus, errorThrown) {
				// TODO when error?
			}
		});
	};
	
	/**
	 * Private method to send AJAX petitions
	 * 
	 * Method
	 * Parameters:
	 * {String} URL 
	 * {Object} with AJAX parameters
	 * 
	 */
	this._call = function(url, callBack, datatype, context) {
		$.ajax({
			type : 'GET',
			url : url,
			context : context,
			dataType : datatype,
			success : function(response) {
				var responseObject = jsyaml.load(response);
				callBack(responseObject, this);
			},
			error : function(xhr, textStatus, errorThrown) {
				// TODO when error?
			}
		});
	};
	
	/**
	 * Reads parameters from URL and saves into context
	 * Needs that context has method *fromGETParameters*
	 * 
	 * Method
	 */
	this.getParamsFromURL = function(context) {
		var qs = XVM.Util.getLocationSearch();
		qs = qs.split("+").join(" ");
		context.fromGETParameters = {};
		var tokens, 
		re = /[?&]?([^=]+)=([^&]*)/g;

		while(tokens = re.exec(qs)) {
			context.fromGETParameters[decodeURIComponent(tokens[1]).toLowerCase()] = this.parseValue(tokens[2]);
		}
	};

	/**
	 * Parses URL config value and creates an array in case it's needed
	 *
	 * Method
	 */
	this.parseValue = function(value) {
		var elements = value.split(",");
		if (elements.length > 1) {
			for (var i = 0; i < elements.length; i++) {
				// Should we somehow cast the string to another type?
				elements[i] = decodeURIComponent(elements[i]);
			}
			return elements;
		} else {
			return decodeURIComponent(value);
		}
	};

};

XVM.Loader.Config = XVM.Class.extend({

	/**
	 * Reader
	 * Property
	 */
	reader : null,

	/**
	 * Object saves config parameters
	 * Property
	 * {Object}
	 */
	configParameters : {
		'general':{},
		'map_settings':{},
		'view_settings': {}
	},
	
	/**
	 * Object where reader saves GET parameters
	 * Property
	 * {Object}
	 */
	fromGETParameters : null,

	_readConfig : function() {
		this.reader.getParamsFromURL(this);
		this.reader.readFromFile(
			XVM.CONFIGFILE,
			function(responseObject, context) {
				var _this = context;
				$.extend(_this.configParameters, responseObject);
				if(_this.fromGETParameters.urlconfig != undefined) {
					_this.reader.readFromFile(
						_this.fromGETParameters.urlconfig, 
						function(responseObject, context) {
							var _this = context;
							$.extend(_this.configParameters, responseObject);
							_this._addParametersFromGET();		
						},
						_this);
				} else {
					_this._addParametersFromGET();
				}
		
			},
			this);
	},
	
	_addParametersFromGET : function() {
		if ((typeof this.configParameters.view_settings !== 'undefined')
				&& (typeof this.configParameters.view_settings.bbox !== 'undefined')
				&& (typeof this.fromGETParameters.lon !== 'undefined')
				&& (typeof this.fromGETParameters.lat !== 'undefined')) {
			delete this.configParameters.view_settings.bbox;
		}
		this.configParameters = overrideValues(this.configParameters, this.fromGETParameters);
		XVM.EventBus.fireEvent('addConfigParameters',this.configParameters);
	},

	
	/**
	 * Init method
	 * Parameters:
	 * {Object} Reader
	 */
	initialize : function(reader) {
		this.reader = (typeof reader === "undefined") ? XVM.Reader : reader;
		this._readConfig();
	}
});

XVM.Loader.Layers = XVM.Class.extend({

	/**
	 * Property
	 * {XVM.Loader.Reader}
	 */
	reader : null,
	
	/**
	 * Object where reader saves GET parameters
	 * Property
	 * {Object}
	 */
	fromGETParameters : null,
	
	/**
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	layers : new Array(),

	/**
	 * Method
	 */
	_readLayers : function() {
		this.reader.getParamsFromURL(this);
		this.reader.readFromFile(
			XVM.LAYERSFILE,
			this._readLayersCallback,
			this
		);
	},
	
	/**
	 * urlServiceLayer indicates where is the service with 
	 * layer structure
	 */
	_readLayersCallback : function(response, context) {
		var _this = context;
		if(response.urlServiceLayer != null) {
			_this.reader.readFromFile(
				response.urlServiceLayer, 
				_this._createLayers,
				_this
			);
		} else {
			var tmpresponse = response.layers;
			_this._createLayers(tmpresponse, _this);
		}
	},
	
	/**
	 *
	 */
	_createLayers : function(response, context) {
		var _this = context;
		if(_this.fromGETParameters.urlwms != undefined) {
			var GETLayer = {
			 	map_name : 'default',
			  	layer_name : _this.fromGETParameters.layertitle,
			  	wms_layer : _this.fromGETParameters.layerid,
			 	url : _this.fromGETParameters.url,
				visible : true,
			  	//layer_position : 0,
			  	//layer_group : 'Capas Base',
				parameters : {opacity : 1, singleTile : true},
				is_base : false
			};
			response.push(GETLayer);
		}

		for(var n=0; n<response.length; n++) {
			var objectLayer = response[n];
			if (objectLayer.type == 'wms') {
				var default_options = {
					isBaseLayer : false,
					visibility : true,
					singleTile : true,
					opacity : 0.75,
					transitionEffect : 'resize',
					buffer : 0
				};
				var layer_options = $.extend(default_options, objectLayer.parameters);
				var layer = new OpenLayers.Layer.WMS(
					objectLayer.layer_name,
					objectLayer.url,
					{
						//GetMap parameters
						layers: objectLayer.wms_layer,
						transparent : true,
						format : "image/png"
					},
					layer_options
				);

			_this.layers.push(layer);

			} else if(objectLayer.type == 'ajax') {
				eval('$.getJSON(objectLayer.url,\
					    "callback=?",\
					    function(data) {\
						var geojson_format = new OpenLayers.Format.GeoJSON();\
						var layer = new OpenLayers.Layer.Vector("' + objectLayer.layer_name + '");\
						layer.addFeatures(geojson_format.read(data));\
						XVM.EventBus.fireEvent("addLayers", [layer]);\
				});');
			} else if(objectLayer.type == 'geojson') {
				objectLayer.parameters.strategies = [new OpenLayers.Strategy.Fixed()];
				objectLayer.parameters.protocol = new OpenLayers.Protocol.HTTP({
					url: objectLayer.url,
					format: new OpenLayers.Format.GeoJSON()
				});

				var layer = new OpenLayers.Layer.Vector(objectLayer.layer_name, objectLayer.parameters);
				_this.layers.push(layer);
			}

		}
		XVM.EventBus.fireEvent('addLayers', _this.layers);
	},
	
	/**
	 * Method
	 * Parameters:
	 * {XVM.Loader.Reader}
	 */
	initialize : function(reader) {
		this.reader = (typeof reader === "undefined") ? XVM.Reader : reader;
		this._readLayers();
	}
});

XVM.Loader.Controls = XVM.Class.extend({
	
	/**
	 * Property
	 * {XVM.Loader.Reader}
	 */
	reader : null,
	
	/**
	 * Object where reader saves GET parameters
	 * Property
	 * {Object}
	 */
	fromGETParameters : null,
	
	/**
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	controls : new Array(),
	
	/**
	 * Property
	 * {Array(OpenLayer.Layers)}
	 */
	panelControls : new Array(),
	
	/**
	 * Method
	 */
	_readControls : function() {
		this.reader.readFromFile(
			XVM.CONTROLSFILE,
			this._readControlsCallback,
			this
		)
	},
	
	/**
	 * 
	 */
	_readControlsCallback : function(response, this_) {
		var controls = response.controls;
		var nControls = 0;
		if (controls.length == 0) {
			XVM.EventBus.fireEvent('addControls', []);
		}
		for(var n in controls) {
			var controlName = controls[n];
			var controlPath = XVM.CONTROLSFOLDER + '/' + controlName + '/';
			var controlLoader = new XVM.Control.ControlLoader(controlPath, controlName, this_.reader);
			controlLoader.loadControl(function(control) {
				this_.controls.push(control);
				nControls += 1;
				if(nControls == controls.length) {
					XVM.EventBus.fireEvent('addControls', this_.controls);
				}
			});	
		}
	},

	/**
	 * 
 	 * @param {Object} reader
	 */
	initialize : function(reader) {
		this.reader = (typeof reader === "undefined") ? XVM.Reader : reader;
		this._readControls();
	}
});

XVM.Control = XVM.Class.extend({

	OLMap : null,

	options : {},

	controlPath : null,

	OLControl : null,
	
	addToPanel : false,

	createControl : function() {
		throw 'XVM.Control.createControl dummy implementation';
	},

	initialize : function(params, controlPath) {
		this.options = params;
		this.controlPath = controlPath;
		this.createControl();
	},

	setOLMap : function(map) {
		this.OLMap = map;
		this.addControl();
	},
	
	beforeAddingControl : function() {
	},
	
	afterAddingControl : function() {
	},

	addControl : function() {
		this.beforeAddingControl();
		if (this.addToPanel) {
			this.OLMap.panel.addControls([this.OLControl]);
		} else {
			this.OLMap.addControl(this.OLControl);
		}
		this.afterAddingControl();
	}
});

XVM.Control.ControlLoader = XVM.Class.extend({
	
	reader : null,

	initParameters : {},
	
	controlPath : "",
	
	controlName : "",

	initialize : function(path, name, reader) {
		this.controlPath = path;
		this.controlName = name;
		this.reader = reader;
	},

	loadControl : function(callBack) {
		this.reader.loadCssFile(this.controlPath + this.controlName + '.css');
		var controlConfigFile = this.controlPath + this.controlName + '.yaml';
		this.reader.readFromFile(
			controlConfigFile, 
			function(response, this_) {
				if (response != null) {
					if (response.properties != null) {
						$.i18n().load(response.properties);
					}
					this_.initParameters = response.init;
				}
				// Load control code into app
				var controlCodeURL = this_.controlPath + this_.controlName + '.js';
				this_.reader.loadScript(
					controlCodeURL, 
					function(response, this_) {
						// In case we included a function as a trigger, we eval its reference
						evalObject(this_.initParameters);
						eval('callBack(new XVM.Control.' + this_.controlName + '(this_.initParameters, this_.controlPath))');
						}, 
					this_);
		}, this);
	}
});

XVM.Event.EventBus = function() {

	/**
	 * Property
	 * {Array(Object)}
	 */
	this.listeners = {};

	/**
	 * 
	 */
	this.addListener = function(listener, callFunction, event) {
		if (!this.listeners[event]) {
			this.listeners[event] = new Array();
		}
		this.listeners[event].push([listener, callFunction]);
	};

	/**
	 * Fires an event into listeners
	 */
	this.fireEvent = function(event, parameters) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(
				function callEventHandler(handler) {
					handler[0][handler[1]](parameters);
				}
			);
		}
	};

};