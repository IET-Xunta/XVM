===========================
XVM - Parametros GET
===========================

Introducción
==============

Además de las configuraciones mediante ficheros YAML de configuraci´ n, el XVM está  preparado para aceptar configuraciones a través  de parátros GET dentro de la URL de llamada.
Esto permite aprovechar una única instalación  del XVM para poder tener diferentes visores con capas y funcionalidades diferentes.

Configuración de capas WMS por parámetros GET directos
=======================================================

Los parámetros para la carga de una capa WMS en el XVM son los siguientes:

* urlwms
* layerid
* layertitle


Ejemplo de URL de pruebas básicas con capas pasadas por GET:

* `http://localhost/XVM/xvm.html?urlwms=http://ideg.xunta.es/wms_orto_1956-57/request.aspx&layerid=Ortofoto_56_57&layertitle=Ortofoto_56_57`
* `http://localhost/WMS/xvm.html?urlwms=http://visorgis.cmati.xunta.es/geoserver/dhgc/wms?&layerid=estadomasasaugacosteiras&layertitle=Estado%20Masas%20Auga%20Costeiras`


Configuración de capas WMS por fichero map.layers.conf externo
==============================================================

Si se desea cargar una serie de capas personalizadas en el visor diferente a las incluidas en la configuración por defecto, un método cómodo puede ser usar el parámetro:

* **urllayersfile**: indicando la url y nombre donde se encuentra el fichero YAML indicando las capas a cargar (con sus opciones correspondientes).

Se puede usar el fichero ``map.layers.conf`` como base para crear este fichero externo.

Ejemplo de URL de capas cargadas con fichero de capas externo:

* http://localhost/XVM/xvm.html?urllayersfile=http://localhost/XVM/MYLAYERS.yaml
