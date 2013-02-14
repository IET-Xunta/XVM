========
Controis
========

Creando controis
****************

Introducción
============
Dentro dá arquitectura do XVM unha das necesidades que se detectaron foi a posibilidade de crear de manera axil e sen dependecias controis personalizados para os diferentes visores nos que se poda incluir no XVM.

Arquitectura dos controis
=========================
O XVM ten un arquivo de cofiguración de controis ``map.controls.yaml`` na carpeta ``config`` onde se incluirán os controis que se desexa cargar na instancia do XVM que se vaia crear. 

Exemplo de ``map.controls.yaml``::

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
	A orde de inclusión dos controis no arquivo será a orde na que aparecerán no panel.
	
.. note::
	Por defecto os controis están configurados para que non aparezan no panel.
	
A carga dos controis realízase de xeito dinámico. Para iso utilízase a clase ``XVM.Control.ControlLoader``. Para que un control se cargue de xeito dinámico hase de cumprir que::
	
	1. Exista unha carpeta dentro da carpeta ``src/Control`` do XVM co mesmo nome do control que indicásemos no arquivo ``map.options.yaml``
	2. Os arquivos do control han de chamarse do mesmo xeito que a carpeta e que o control configurado no arquivo e deben existir estes tipos:
		* Un arquivo CSS cos estilos que se utilizarán no control
		* Un arquivo JS co código que implemente a funcionalidade do control
		* Un arquivo YAML coa configuración do control

No caso de que se necesiten manexar imaxes para incluír no panel, débese crear unha carpeta ``images`` dentro da carpeta do control onde se incluirán as imaxes deste.

Implementación do control
--------------------------
Para desenvolver un control que se integre no XVM é necesario partir da clase ``XVM.Control``. Será necesario facer que a nosa clase estenda desta clase ``XVM.Control``::

	XVM.Control.<meu_novo_control> = XVM.Control.extend({});
	
Ademais será necesario implementar o método ``createControl`` que sobrescriba ao devandito método da clase pai. Se non se implementa este método, unha vez que insiramos o control apareceranos unha mensaxe::

	``XVM.Control.createControl dummy implementation``
	
.. Warning:: Recoméndase revisar o código da clase ``XVM.Control`` para coñecer as propiedades do obxecto que esta pon a disposición do noso control. 

Un exemplo de implementación do control sería::

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
	
Carga de parametros dende o archivo YAML
----------------------------------------
Ao igual que no resto do XVM, se nos permite modificar certos parametros dos controis mediante o uso de arquivos de configuración ``.yaml``. A clase ``XVM.Control.ControlLoader`` é a que se encarga de manexar o paso da información dende o arquivo ``yaml`` ata o control.
A estrutura que debe ter o arquivo de configuración será a seguinte::

	init:
		clave : valor
	properties:
		codigo_idioma:
			clave : valor

Isto crea un obxecto onde, os para metros que se pasan en ``init`` son gardados na propiedade ``this.options`` do control que esteamos a implementar, e os parámetros que se gardan en ``properties`` serán usados para a internacionalización.
É posible definir a execución de determinadas funcións do control mediante o uso da función ``eval()``::

	clave: eval(función_a_executar)
