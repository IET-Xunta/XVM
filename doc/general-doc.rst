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
`Configuración por GET en la a URL <getparameters-config.rst>`_.

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

Uso básico como iframe

