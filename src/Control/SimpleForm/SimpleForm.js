/**
 * XVM: Xeovisor Minimo
 * ----------------------------------------------
 * Copyright (c) 2012, Xunta de Galicia. All rights reserved.
 * Code licensed under the BSD License:
 *   LICENSE.txt file available at the root application directory
 *
 * @author Instituto Estudos do Territorio, IET
 */
XVM.Control.SimpleForm = XVM.Control.extend({

	addToPanel : true,
	
	/**
	 * Save all WFS Layers from OLMap
	 */
	WFSLayers : [],
	
	/**
	 * 
	 */
	controlForm : null,

	createControl : function() {
		this.OLControl = new OpenLayers.Control(this.options);
		this.OLControl.trigger = this.trigger;
		XVM.EventBus.addListener(this, 'addLayers', 'addLayers');
	},
	
	/**
	 * 
	 */
	getWFSLayersFromMap : function(layers) {
		for (var i=0; i<layers.length; i++) {
			if (layers[i].searchFields != undefined) {
				this.WFSLayers.push(layers[i]);
			}
		}
	},
	
	/**
	 * Response to addLayers EventBus 
	 */
	addLayers : function(layers) {
		this.getWFSLayersFromMap(layers);
		this.createControlForm();
	},
	
	/**
	 * 
	 */
	trigger : function() {
		$('#simple_form').dialog({title: "Buscar"});
	},
	
	/**
	 * Method: beforeAddingControl
	 * Launch before add control.
	 */
	beforeAddingControl : function() {
	},
	
	/**
	 * Method: afterAddingControl
	 * Launch after add control. Searchs in OLMap.layers if there is
	 * some WFS Layer loaded
	 */
	afterAddingControl : function() {
		this.getWFSLayersFromMap(this.OLMap.layers);
		this.createControlForm();
	},
	
	createControlForm : function() {
		if(this.controlForm != null)
			this.controlForm.remove();
		
		this.controlForm = $('<form id="simple_form"></form>').appendTo('body').hide();
        //Disable default form submit
		this.controlForm.submit(function() {
            return false;
        });
				
		$('<div id="layer_option_div">').appendTo(this.controlForm);
		$('<div id="table_div">')
			.appendTo(this.controlForm)
			.hide();
		$('<table id="table_form"></table>').appendTo('#table_div');
		
		$('<select id="layers_option" name="layers_option">').appendTo($('#layer_option_div'));
		$('<option value=9999>Seleccione una capa...</option>').appendTo($('#layers_option', null));

		var layers = this.WFSLayers;
		for (var i=0; i<layers.length; i++) {
			$('<option value=' + i +'>' + layers[i].name + '</option>').appendTo($('#layers_option', null));
		}
				
        $('#layers_option').on('change', null, this, function (evt) {
        	var this_ = evt.data;
        	if($('#layers_option').val() == 9999) {
	        	$('#table_div').fadeOut();
	            $('#table_form').remove();
	            return;
            }
            $('<table id="table_form"></table>').appendTo('#table_div');
                	
            var indiceLayer = $('#layers_option').val();
            var layer = this_.WFSLayers[indiceLayer];
            for (var i=0; i<layer.searchFields.length; i++) {
    		    var row = $('<tr><td><span class="field_name">' + layer.searchFields[i].name + ':</span></td></tr>').appendTo($('#table_form'));
    		    $('<td><input type="text" name="' + layer.searchFields[i].field + '"></td>').appendTo(row);
            }
            $('<input type="submit" name="query_rvg" value="Buscar">')
            .appendTo($('#table_form'))
            .on('click', null, evt.data, function(evt) {
            	var this_ = evt.data;
            	var inputs = $('input[type=text]');
            	var queryParams = {};
            	for (var n=0; n<inputs.length; n++){
            		var input = inputs[n];
            		queryParams[$(input).attr('name')] = $(input).val();
            	}            	
            	var toSearch = {
	            			'layer' : layer,
	            			'queryParams' : queryParams
            			};
            	
            	XVM.EventBus.fireEvent('searchAndZoom', toSearch);
            });	
            $('#table_div').fadeIn();
        });		        	
	}
});

// Added for debugging tasks
//@ sourceURL=SimpleForms.js
