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

* Balancear simplicidad y funcionalidad
* Facilitar al máximo los despliegues (mínima dependencia de la tecnología en el servidor)
* Explotar los estándares de interoperabilidad geográfica: inicialmente sólo WMS, pero la intención es seguir incorporando otros
* Soporte multi-idioma
* Arquitectura que favorece la modularidad y la creación de personalizaciones de forma sencilla


Estructura del XVM
========================

OpenLayers
Controles propios
JQuery
Proxy

Parametrización
========================
https://docs.google.com/spreadsheet/ccc?key=0AigNT44602PzdGJoTHBDTEdsbk1MN1h5U1NZdF92dlE#gid=0

Tipo de párametros
-------------------------

Por tipo:

* **Generales:** idioma, dimensiones del mapa
* **Configuración del Mapa:** proyección, extensión, resoluciones, ...
* **Capas:** relación de servicios, agrupaciones, capa base, ...
* **Controles:** herramientas, botones y otras funcionalidades
* **Estilos: ** se pueden usar temas de jquery-ui para personalizar el aspecto general del visor.

Sistema de carga de párametros
--------------------------------------------------

Una de las ventajas del XVM es que una única instalación permite muchas configuraciones distintas
tanto de capas cargadas, de controles u otras configuraciones como extensión geográfica, proyección,
tamaño del visor, etc. Esta flexibilidad se consigue a través de los ficheros de configuración YAML y de parámetros GET 
usados en la llamada al visor. 

Existen tres tipos de carga de ficheros:

* **Parámetros en ficheros por defecto:** Son ficheros YAML incluidos en la carpeta ``config`` de XVM 
* **Parámetros en ficheros por URL:** Son como los anteriores, pero se cargan dinámicamente a través de un parámetro GET que indica la ubicación el fichero. Estos sobreescriben los anteriores si procede.
* **Parámetros simples por URL:** Son configuraciones adicionales que se realizan a través de parámetros GET directos, sin existir referencia a un fichero adicional. Estos sobreescriben los anteriores si procede. Ver `Configuración por GET en la a URL <getparameters-config.rst>`_.

Ver Diagrama de clases de Readers


Controles
====================================
https://docs.google.com/spreadsheet/ccc?key=0Ap7XLlXgRGXBdGs0eG81Yy1GWW1FblFNYTZoRm9oNGc#gid=0


Instrucciones para su descarga
====================================

Se recomienda hacer un "clonado recursivo" dado que XVM tiene otro proyecto incluídos como _submodules_.

  git clone --recursive https://github.com/IET-Xunta/XVM.git

Si el clonado ha sido sin recursividad, o se produce algún problema, se debe revisar la configuración 
de la url en git y ejecutar manualmente el update:

  git submodule update

Instrucciones de despliegue
====================================

Copiar y listo!! :D

Para consultar servicios WMS externos al dominio (p.e usando llamadas getFeatureInfo), se debe incluir dicho dominio
en el listado de URLs (``proxy/urls.proxy``) permitidas en el proxy.

Uso básico como iframe

