/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 *
 * Based on OpenLayers.Control.LayerSwitcher...
 * [Xeovisor minimo - XVM]: some small changes on icon, ordering layers, etc.
 */

/** 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Lang.js
 * @requires Rico/Corner.js
 */

/**
 * Class: OpenLayers.Control.LayerSwitcher
 * The LayerSwitcher control displays a table of contents for the map. This 
 * allows the user interface to switch between BaseLayers and to show or hide
 * Overlays. By default the switcher is shown minimized on the right edge of 
 * the map, the user may expand it by clicking on the handle.
 *
 * To create the LayerSwitcher outside of the map, pass the Id of a html div 
 * as the first argument to the constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Control>
 */

XVM.Control.OLCustomLayerSwitcher = 
  OpenLayers.Class(OpenLayers.Control, {
  
    /**
     * APIProperty: roundedCorner
     * {Boolean} If true the Rico library is used for rounding the corners
     *     of the layer switcher div, defaults to false. *Deprecated*. Use
     *     CSS3's border-radius instead. If this option is set to true the
     *     Rico/Corner.js script must be loaded in the page, and therefore
     *     listed in the build profile.
     *
     */
    roundedCorner: false,

    /**  
     * APIProperty: roundedCornerColor
     * {String} The color of the rounded corners, only applies if roundedCorner
     *     is true, defaults to "darkblue".
     */
    roundedCornerColor: "darkblue",
    
    /**  
     * Property: layerStates 
     * {Array(Object)} Basically a copy of the "state" of the map's layers 
     *     the last time the control was drawn. We have this in order to avoid
     *     unnecessarily redrawing the control.
     */
    layerStates: null,
    

  // DOM Elements
  
    /**
     * Property: layersDiv
     * {DOMElement} 
     */
    layersDiv: null,
    
    /** 
     * Property: baseLayersDiv
     * {DOMElement}
     */
    baseLayersDiv: null,
    
    /** 
     * Property: firstBaseLayers
     * {boolean} Set to true it will display the base layers tree above the overlayers
     * one. False is obviously the opposite.
     */
    firstBaseLayers: true,

    /** 
     * Property: showBaseLayers
     * {int} Defines how we display the base layers section, and accepts three different
     * values: -1 hides the section, 0 displays the layers only with the specified groups,
     * 1 displays it with an additional root node
     */
    showBaseLayers: 1,

    /** 
     * Property: showOverlays
     * {int} Defines how we display the overlayers section, and accepts three different
     * values: -1 hides the section, 0 displays the layers only with the specified groups,
     * 1 displays it with an additional root node
     */
    showOverlays: 1,

    /**
     * Property: baseLayersTree
     * {DynaTree}
     */
    baseLayersTree: null,

    /**
     * Property: overlaysTree
     * {DynaTree}
     */
    overlaysTree: null,
    
    
    /** 
     * Property: dataLbl
     * {DOMElement} 
     */
    dataLbl: null,
    
    /** 
     * Property: dataLayersDiv
     * {DOMElement} 
     */
    dataLayersDiv: null,


    /** 
     * Property: minimizeDiv
     * {DOMElement} 
     */
    minimizeDiv: null,

    /** 
     * Property: maximizeDiv
     * {DOMElement} 
     */
    maximizeDiv: null,

    /**
     * APIProperty: ascending
     * {Boolean} If we want the layers to appear in the tree in the same order
     * 		as they are in the map, or in reverse.
     */
    reverse: false,
 
    /**
     * Constructor: OpenLayers.Control.LayerSwitcher
     * 
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.layerStates = [];
        if ((options != null) && (typeof options.firstBaseLayers == 'boolean')) {
        	this.firstBaseLayers = options.firstBaseLayers;
        }
        
        if(this.roundedCorner) {
            OpenLayers.Console.warn('roundedCorner option is deprecated');
        }
    },

    /**
     * APIMethod: destroy 
     */    
    destroy: function() {
        
        this.map.events.un({
            buttonclick: this.onButtonClick,
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
        });
        this.events.unregister("buttonclick", this, this.onButtonClick);
        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /** 
     * Method: setMap
     *
     * Properties:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            addlayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            changelayer: this.redraw,
            scope: this
        });
        if (this.outsideViewport) {
            this.events.attachToElement(this.div);
            this.events.register("buttonclick", this, this.onButtonClick);
        } else {
            this.map.events.register("buttonclick", this, this.onButtonClick);
        }
    },

    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the 
     *     switcher tabs.
     */  
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this);

        // create layout divs
        this.loadContents();

        // set mode to minimize
        if(!this.outsideViewport) {
            this.minimizeControl();
        }

        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        var len = this.map.layers.length;
        this.layerStates = new Array(len);
        for (var i=0; i <len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name,
                'visibility': layer.isBaseLayer ? layer == this.map.baseLayer : layer.getVisibility(),
                'inRange': layer.inRange,
                'id': layer.id
            };
        }

        return this.div;
    },

    /**
     * Method: onButtonClick
     *
     * Parameters:
     * evt - {Event}
     */
    onButtonClick: function(evt) {
        var button = evt.buttonElement;
        if (button === this.minimizeDiv) {
            this.minimizeControl();
        } else if (button === this.maximizeDiv) {
            this.maximizeControl();
        }
        if ($(button).parents().is('#tree1') || $(button).parents().is('#tree2')) {
            OpenLayers.Event.stop(evt);
        }
    },


    /**
     * Method: checkRedraw
     * Checks if the layer state has changed since the last redraw() call.
     * 
     * Returns:
     * {Boolean} The layer state changed since the last redraw() call. 
     */
    checkRedraw: function() {
        var redraw = false;
        if ( !this.layerStates.length ||
             (this.map.layers.length != this.layerStates.length) ) {
            redraw = true;
        } else {
            for (var i=0, len=this.layerStates.length; i<len; i++) {
                var layerState = this.layerStates[i];
                var layer = this.map.layers[i];
                if ( (layerState.name != layer.name) || 
                     (layerState.inRange != layer.inRange) || 
                     (layerState.id != layer.id) || 
                     ((layerState.visibility != layer.getVisibility()) &&
                             (layer.isBaseLayer ? layer.getVisibility() : true)) ) {
                    redraw = true;
                    break;
                }    
            }
        }    
        return redraw;
    },
    
    /** 
     * Method: redraw
     * Goes through and takes the current state of the Map and rebuilds the
     *     control to display that state. Groups base layers into a 
     *     radio-button group and lists each data layer with a checkbox.
     *
     * Returns: 
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */  
    redraw: function() {
        //if the state hasn't changed since last redraw, no need
        // to do anything. Just return the existing div.
        if (!this.checkRedraw()) { 
            return this.div; 
        }
        
        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        var len = this.map.layers.length;
        this.layerStates = new Array(len);
        for (var i=0; i <len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name, 
                'visibility': layer.isBaseLayer ? layer == this.map.baseLayer : layer.getVisibility(),
                'inRange': layer.inRange,
                'id': layer.id
            };
        }

        var layers = this.map.layers.slice();
        if (!this.reverse) { layers.reverse(); }

        var baselayers = [], overlays = [];
        for (var i=0, len=layers.length; i<len; i++) {
            var layer = layers[i];
            if (layer.isBaseLayer) {
                baselayers.push(layer);
            } else {
                overlays.push(layer);
            }
        }

        if (this.showBaseLayers > -1) {
	        $(this.baseLayersTree).dynatree('destroy');
	        this.baseLayersTree = $(this.baseLayersTree).dynatree({
	          checkbox: true,
	          // Override class name for checkbox icon:
	          classNames: {
	              container: "olButton dynatree-container",
	              node: "olButton dynatree-node",
	              folder: "olButton dynatree-folder",
	              empty: "olButton dynatree-empty",
	              vline: "olButton dynatree-vline",
	              expander: "olButton dynatree-expander",
	              connector: "olButton dynatree-connector",
	              checkbox: "olButton dynatree-radio",
	              nodeIcon: "olButton dynatree-icon",
	              title: "olButton dynatree-title",
	              noConnector: "olButton dynatree-no-connector",
	              nodeError: "olButton dynatree-statusnode-error",
	              nodeWait: "olButton dynatree-statusnode-wait",
	              hidden: "olButton dynatree-hidden",
	              combinedExpanderPrefix: "olButton dynatree-exp-",
	              combinedIconPrefix: "olButton dynatree-ico-",
	              hasChildren: "olButton dynatree-has-children",
	              active: "olButton dynatree-active",
	              selected: "olButton dynatree-selected",
	              expanded: "olButton dynatree-expanded",
	              lazy: "olButton dynatree-lazy",
	              focused: "olButton dynatree-focused",
	              partsel: "olButton dynatree-partsel",
	              lastsib: "olButton dynatree-lastsib"
	          },
	          selectMode: 1,
	          clickFolderMode: 2,
	          parent: this,
	          children: this.generateBaseLayersTree(baselayers),
	          onSelect: function(select, node) {
	              node.tree.options.parent.updateBaseLayer(node.data._layer);
	          },
	          cookieId: "dynatree-Cb1",
	          idPrefix: "dynatree-Cb1-",
	          debugLevel: 0
	        });
        }

        if (this.showOverlays > -1) {
	        $(this.overlaysTree).dynatree('destroy');
	        this.overlaysTree = $(this.overlaysTree).dynatree({
	          checkbox: true,
	          classNames: {
	              container: "olButton dynatree-container",
	              node: "olButton dynatree-node",
	              folder: "olButton dynatree-folder",
	              empty: "olButton dynatree-empty",
	              vline: "olButton dynatree-vline",
	              expander: "olButton dynatree-expander",
	              connector: "olButton dynatree-connector",
	              checkbox: "olButton dynatree-checkbox",
	              nodeIcon: "olButton dynatree-icon",
	              title: "olButton dynatree-title",
	              noConnector: "olButton dynatree-no-connector",
	              nodeError: "olButton dynatree-statusnode-error",
	              nodeWait: "olButton dynatree-statusnode-wait",
	              hidden: "olButton dynatree-hidden",
	              combinedExpanderPrefix: "olButton dynatree-exp-",
	              combinedIconPrefix: "olButton dynatree-ico-",
	              hasChildren: "olButton dynatree-has-children",
	              active: "olButton dynatree-active",
	              selected: "olButton dynatree-selected",
	              expanded: "olButton dynatree-expanded",
	              lazy: "olButton dynatree-lazy",
	              focused: "olButton dynatree-focused",
	              partsel: "olButton dynatree-partsel",
	              lastsib: "olButton dynatree-lastsib"
	          },
	          selectMode: 3,
	          clickFolderMode: 2,
	          parent: this,
	          children: this.generateOverlaysTree(overlays),
	          onSelect: function(select, node) {
	              updateNodeLayer = function(node) {
	                  if(node.hasChildren() === false) {
	                      node.tree.options.parent.updateLayerVisibility(node.data._layer, node.isSelected());
	                  }
	              };
	              node.visit(updateNodeLayer, true);
	          },
	          cookieId: "dynatree-Cb2",
	          idPrefix: "dynatree-Cb2-",
	          debugLevel: 0
	        });
        }

        return this.div;
    },

    /** 
     * Method: maximizeControl
     * Set up the labels and divs for the control
     * 
     * Parameters:
     * e - {Event} 
     */
    maximizeControl: function(e) {

        // set the div's width and height to empty values, so
        // the div dimensions can be controlled by CSS
        this.div.style.width = "";
        this.div.style.height = "";

        this.showControls(false);

        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },
    
    /** 
     * Method: minimizeControl
     * Hide all the contents of the control, shrink the size, 
     *     add the maximize icon
     *
     * Parameters:
     * e - {Event} 
     */
    minimizeControl: function(e) {

        // to minimize the control we set its div's width
        // and height to 0px, we cannot just set "display"
        // to "none" because it would hide the maximize
        // div
        this.div.style.width = "0px";
        this.div.style.height = "0px";

        this.showControls(true);

        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: showControls
     * Hide/Show all LayerSwitcher controls depending on whether we are
     *     minimized or not
     * 
     * Parameters:
     * minimize - {Boolean}
     */
    showControls: function(minimize) {

        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";
    },
    
    generateTreeFromLayers : function(layers, root, base_id, selectableFolders) {

        for(var i=0, len=layers.length; i<len; i++) {
            var layer = layers[i];
	    if (!layer.displayInLayerSwitcher){
		continue;
	    }
            var baseId = base_id + '_';
            var groups;
            if (typeof layer.group_name === 'string') {
                groups = layer.group_name.split('/');
            } else {
                groups = [];
            }
            var colorBox = null;
            if (layer instanceof OpenLayers.Layer.Vector) {
            	if ((layer.style != null) && (layer.style.fillColor != null)) {
            		colorBox = layer.style.fillColor;
            	} else {
                    colorBox = OpenLayers.Feature.Vector.style['default'].fillColor;
            	}
            }
            var currentNode = root;
            for (var n=0, leng=groups.length; n<leng; n++) {
                var group = groups[n];
                if (group == '') {
                    continue;
                }
                baseId += group + '_';
                var children = currentNode.children;
                var found = false;
                for (var m=0, lengt=children.length; m<lengt; m++) {
                    if (children[m].title == group) {
                        found = true;
                        currentNode = children[m];
                        break;
                    }
                }
                if (!found) {
                    var newNode = {title: group, key: baseId, hideCheckbox: !selectableFolders, expand: true, isFolder: true, icon: false, children: []};
                    currentNode.children.push(newNode);
                    currentNode = newNode;
                }
            }
            currentNode.children.push({title: layer.name, key: baseId + layer.name, _layer: layer.id, icon: false, colorBox: colorBox, select: layer.isBaseLayer ? layer == this.map.baseLayer : layer.getVisibility()});
        }

    },

    generateOverlaysTree : function(layers) {

        var baseId = this.id + '_overlays';
        var title = $.i18n('Overlays');

        treeChildren = [
                      {title: title, key: baseId,  expand: true, isFolder: true, icon: false,
                        children: []
                      }
                    ];

        this.generateTreeFromLayers(layers, treeChildren[0], baseId, true);

        // We ignore the root node if configured to do so
        if (this.showOverlays < 1) {
        	return treeChildren[0].children;
        }
        return treeChildren;
    },
    
    generateBaseLayersTree : function(layers) {

        var baseId = this.id + '_baselayers';
        var title = $.i18n('Base Layer');

        var treeChildren =[
                       {title: title, key: baseId, hideCheckbox: true, unselectable: true, expand: true, isFolder: true, icon: false,
                         children: []
                       }
                     ];

        this.generateTreeFromLayers(layers, treeChildren[0], baseId, false);

        // We ignore the root node if configured to do so
        if (this.showBaseLayers < 1) {
        	return treeChildren[0].children;
        }
        return treeChildren;
    },
    
    updateBaseLayer : function(layerid) {
          var layers = this.map.layers;
        for (var i=0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            if (layer.isBaseLayer) {
                this.layerStates[i].visibility = (layer.id == layerid);
            }
        }
          this.map.setBaseLayer(this.map.getLayer(layerid));
    },
    
    updateLayerVisibility : function(layerid, select) {
          var layers = this.map.layers;
        for (var i=0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            if (layer.id == layerid) {
                this.layerStates[i].visibility = select;
                break;
            }
        }
          this.map.getLayer(layerid).setVisibility(select);
    },
    
    /** 
     * Method: loadContents
     * Set up the labels and divs for the control
     */
    loadContents: function() {
 
        //this.div.appendChild(this.layersDiv);

        if(this.roundedCorner) {
            OpenLayers.Rico.Corner.round(this.div, {
                corners: "tl bl",
                bgColor: "transparent",
                color: this.roundedCornerColor,
                blend: false
            });
            OpenLayers.Rico.Corner.changeOpacity(this.layersDiv, 0.75);
        }

        // maximize button div
        var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MaximizeDiv", 
                                    null, 
                                    null, 
                                    img, 
                                    "absolute");
        OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv olButton");
        this.maximizeDiv.style.display = "none";
        
        this.div.appendChild(this.maximizeDiv);

        // minimize button div
        var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MinimizeDiv", 
                                    null, 
                                    null, 
                                    img, 
                                    "absolute");
        OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv olButton");
        this.minimizeDiv.style.display = "none";

        this.div.appendChild(this.minimizeDiv);

        var layers = this.map.layers.slice();
        if (!this.reverse) { layers.reverse(); }

        var baselayers = [], overlays = [];
        for (var i=0, len=layers.length; i<len; i++) {
            var layer = layers[i];
            if (layer.isBaseLayer) {
                baselayers.push(layer);
            } else {
                overlays.push(layer);
            }
        }

        treeDiv = document.createElement('div');
        treeDiv.id = "tree1";
        OpenLayers.Element.addClass(treeDiv, "olButton");

        treeDiv2 = document.createElement('div');
        treeDiv2.id = "tree2";
        OpenLayers.Element.addClass(treeDiv2, "olButton");

        if (this.firstBaseLayers) {
            this.div.appendChild(treeDiv);
            this.div.appendChild(treeDiv2);
        } else {
            this.div.appendChild(treeDiv2);
            this.div.appendChild(treeDiv);
        }

        if (this.showBaseLayers > -1) {
	        this.baseLayersTree = $(treeDiv).dynatree({
	          checkbox: true,
	          // Override class name for checkbox icon:
	          classNames: {
	              container: "olButton dynatree-container",
	              node: "olButton dynatree-node",
	              folder: "olButton dynatree-folder",
	              empty: "olButton dynatree-empty",
	              vline: "olButton dynatree-vline",
	              expander: "olButton dynatree-expander",
	              connector: "olButton dynatree-connector",
	              checkbox: "olButton dynatree-radio",
	              nodeIcon: "olButton dynatree-icon",
	              title: "olButton dynatree-title",
	              noConnector: "olButton dynatree-no-connector",
	              nodeError: "olButton dynatree-statusnode-error",
	              nodeWait: "olButton dynatree-statusnode-wait",
	              hidden: "olButton dynatree-hidden",
	              combinedExpanderPrefix: "olButton dynatree-exp-",
	              combinedIconPrefix: "olButton dynatree-ico-",
	              hasChildren: "olButton dynatree-has-children",
	              active: "olButton dynatree-active",
	              selected: "olButton dynatree-selected",
	              expanded: "olButton dynatree-expanded",
	              lazy: "olButton dynatree-lazy",
	              focused: "olButton dynatree-focused",
	              partsel: "olButton dynatree-partsel",
	              lastsib: "olButton dynatree-lastsib"
	          },
	          selectMode: 1,
	          clickFolderMode: 2,
	          parent: this,
	          children: this.generateBaseLayersTree(baselayers),
	          onSelect: function(select, node) {
	              node.tree.options.parent.updateBaseLayer(node.data._layer);
	          },
	          cookieId: "dynatree-Cb1",
	          idPrefix: "dynatree-Cb1-",
	          debugLevel: 0
	        });
        }

        if (this.showOverlays > -1) {
	        this.overlaysTree = $(treeDiv2).dynatree({
	          checkbox: true,
	          classNames: {
	              container: "olButton dynatree-container",
	              node: "olButton dynatree-node",
	              folder: "olButton dynatree-folder",
	              empty: "olButton dynatree-empty",
	              vline: "olButton dynatree-vline",
	              expander: "olButton dynatree-expander",
	              connector: "olButton dynatree-connector",
	              checkbox: "olButton dynatree-checkbox",
	              nodeIcon: "olButton dynatree-icon",
	              title: "olButton dynatree-title",
	              noConnector: "olButton dynatree-no-connector",
	              nodeError: "olButton dynatree-statusnode-error",
	              nodeWait: "olButton dynatree-statusnode-wait",
	              hidden: "olButton dynatree-hidden",
	              combinedExpanderPrefix: "olButton dynatree-exp-",
	              combinedIconPrefix: "olButton dynatree-ico-",
	              hasChildren: "olButton dynatree-has-children",
	              active: "olButton dynatree-active",
	              selected: "olButton dynatree-selected",
	              expanded: "olButton dynatree-expanded",
	              lazy: "olButton dynatree-lazy",
	              focused: "olButton dynatree-focused",
	              partsel: "olButton dynatree-partsel",
	              lastsib: "olButton dynatree-lastsib"
	          },
	          selectMode: 3,
	          clickFolderMode: 2,
	          parent: this,
	          children: this.generateOverlaysTree(overlays),
	          onSelect: function(select, node) {
	              updateNodeLayer = function(node) {
	                  if(node.hasChildren() === false) {
	                      node.tree.options.parent.updateLayerVisibility(node.data._layer, node.isSelected());
	                  }
	              };
	              node.visit(updateNodeLayer, true);
	          },
	          cookieId: "dynatree-Cb2",
	          idPrefix: "dynatree-Cb2-",
	          debugLevel: 0
	        });
        }
        
    },
    
    CLASS_NAME: "XVM.Control.OLCustomLayerSwitcher"
});

//@ sourceURL=OLCustomLayerSwitcher.js
