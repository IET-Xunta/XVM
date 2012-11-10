====================
XVM - Documentación
====================

Introducción
============

Este documento pretende explicar aspectos técnicos del proyecto XVM XeoVisorMinimo.

El XVM es un componente web facilitar la visualización de servicios OGC de forma sencilla dentro de páginas web y servir de base para la construcción de visores geomáticos más complejos. 

El XVM se encuadra como un elemento dentro de la estrategia de SIG Corporativo de la Xunta de Galicia para poder satisfacer el mayor necesidades geomáticas de usuarios y desarrolladores dentro de la Administración gallega. 


Principios generales
========================

* Compensar la simplicidad y máximo de funcionalidad
* Facilitar al máximo los despliegues (mínima dependencia de la tecnología en el servidor, ni JAVA, ni PHP)
* Explotar los estándares de interoperabilidad geográfica: inicialmente sólo WMS, pero la intención es seguir incorporando otros
* Soporte multi-idioma
* Muy personalizable


Estructura del XVM
========================

OpenLayers
Controles propios
JQuery

Parametrización
========================
https://docs.google.com/spreadsheet/ccc?key=0AigNT44602PzdGJoTHBDTEdsbk1MN1h5U1NZdF92dlE#gid=0

Tipo de párametros
-------------------------

Por tipo:
Generales: idioma, dimensiones
Configuración del Mapa: proyección, extensión, resoluciones, ...
Capas: relación de servicios, agrupaciones, capa base, ...

Sistema de carga de párametros
--------------------------------------------------

Diagrama de clases de Readers

Fichero de configuración por defecto
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
En lenguaje YAML

Fichero de configuración personalizado
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Lo mismo que el anterior, pero es un parámetro indicado en la URL

Parámetros en la URL
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Controles
====================================
https://docs.google.com/spreadsheet/ccc?key=0Ap7XLlXgRGXBdGs0eG81Yy1GWW1FblFNYTZoRm9oNGc#gid=0


Instrucciones de despliegue
====================================

Copiar y listo!! :D

Uso básico como iframe


URL de pruebas básicas
=====================================
* http://localhost/XVM/xvm.html?urlwms=http://ideg.xunta.es/wms_orto_1956-57/request.aspx&layerid=Ortofoto_56_57&layertitle=Ortofoto_56_57