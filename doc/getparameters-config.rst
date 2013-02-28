===========================
XVM - Parametros GET
===========================

Introducción
==============

Además de las configuraciones mediante ficheros YAML de configuraci´ n, el XVM está  preparado para aceptar configuraciones a través  de parátros GET dentro de la URL de llamada.
Esto permite aprovechar una única instalación  del XVM para poder tener diferentes visores con capas y funcionalidades diferentes.

Configuración de capas WMS por parámetros GET
=============================================

Los parámetros para la carga de una capa WMS en el XVM son los siguientes:

* urlwms
* layerid
* layertitle


Exemplo de URL de pruebas básicas
=====================================
* http://localhost/XVM/xvm.html?urlwms=http://ideg.xunta.es/wms_orto_1956-57/request.aspx&layerid=Ortofoto_56_57&layertitle=Ortofoto_56_57
* http://localhost/WMS/xvm.html?urlwms=http://visorgis.cmati.xunta.es/geoserver/dhgc/wms?&layerid=estadomasasaugacosteiras&layertitle=Estado%20Masas%20Auga%20Costeiras

