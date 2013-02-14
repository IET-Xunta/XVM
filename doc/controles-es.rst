=========
Controles
=========

Creando controles
*****************

Introducción
============
Dentro de la arquitectura del XVM una de las necesidades que se detectaron era la posibilidad de crear de manera agil y sin dependecias controles personalizados para los diferentes visores en los que se pueda incluir el XVM.

Arquitectura de los controles
=============================
El XVM tiene un archivo de cofiguración de controles ``map.controls.yaml`` en la carpeta ``config`` donde se incluirán los controles que se desea cargar en la instancia del XVM que se vaya a crear. 

Ejemplo de ``map.controls.yaml``::

	## File with controls to add dinamically to app
	controls:
	 - FeatureInfo
	 - FeatureInfoCatastro
	 - ZoomIn
	 - CustomLayerSwitcher
	 - Scale
	 - ScaleLine
	 - MousePosition
	 - Navigation
	 - DrawFeature
	 - DeleteFeature
	 - ModifyFeature
	 - HelpButton
	 - MeasureLine
	 - MeasureArea
	 - NavigationHistory
	 - PermalinkButton
	 - ZoomToMaxExtent
	 - ZoomBox
	 - ZoomOut
	 - WFSLayer
	  ## Needs this to include TOC
	TOC : !!bool false
	
.. note::
	El orden de inclusión de los controles en el archivo será el orden en el que aparecerán en el panel.
	
.. note::
	Por defecto los controles están configurados para que no aparezcan en el panel.
	
La carga de los controles se realiza de manera dinámica. Para ello se utiliza la clase ``XVM.Control.ControlLoader``. Para que un control se cargue de manera dinámica se ha de cumplir que:
	
	1. Exista una carpeta dentro de la carpeta ``src/Control`` del XVM con el mismo nombre del control que hayamos indicado en el archivo ``map.options.yaml``
	2. Los archivos del control han de llamarse de la misma manera que la carpeta y que el control configurado en el archivo y deben existir estos tipos:
		* Un archivo CSS con ls estilos que se utilizarán en el control
		* Un archivo JS con el código que implemente la funcionalidad del control
		* Un archivo YAML con la configuración del control

En caso de que se necesiten manejar imágenes para incluir en el panel, se debe crear una carpeta ``images`` dentro de la carpeta del control donde se incluirán las imágenes del mismo.

Implementación del control
--------------------------
Para desarrollar un control que se integre en el XVM es necesario partir de la clase ``XVM.Control``. Será necesario hacer que nuestra clase extienda de esta clase ``XVM.Control``::

	XVM.Control.<mi_nuevo_control> = XVM.Control.extend({});
	
Además será necesario implementar el método ``createControl`` que sobreescriba a dicho método de la clase padre. Si no implementamos este método, una vez que insertemos el control nos aparecerá un mensaje::

	'XVM.Control.createControl dummy implementation'
	
.. Warning:: Se recomienda revisar el código de la clase ``XVM.Control`` para conocer las propiedades del objeto que esta pone a disposición de nuestro control. 

Un ejemplo de implementación de control sería::

	XVM.Control.<nombre_de_mi_control> = XVM.Control.extend({	
		/**
		 * Overwrites createControl parent method
		 */
		createControl : function() {
		
		},	
	
		beforeAddingControl : function() {
		},
	
		afterAddingControl : function() {
		}
	});
	
Carga de parametros desde archivo YAML
--------------------------------------
Al igual que en el resto del XVM, se nos permite modificar ciertos parametros de los controles mediante el uso de archivos de configuración ``.yaml``. La clase ``XVM.Control.ControlLoader`` es la que se encarga de manejar el paso de la información desde el archivo ``yaml`` hasta el control. 
La estructura que debe tener el archivo de configuración será la siguiente::

	init:
		clave : valor
	properties:
		codigo_idioma:
			clave : valor

Esto crea un objeto donde, los parametros que se pasan en ``init`` son guardados en la propiedad ``this.options`` del control que estemos implementando, y los parámetros que se guardan en ``properties`` serán usados para la internacionalización.
Es posible definir la ejecución de determinadas funciones del control mediante el uso de la función ``eval()``::

	clave: eval(función_a_ejecutar)
