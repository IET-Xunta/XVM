#!/bin/bash

# This script creates a new XVM control (in GNU/Linux OS)

# TODO Document on the wiki/manual
# TODO Improve CSS example file
# TODO Improve YAML example file
# TODO Add header template

usage(){
    echo 'Wrong parameters'
    echo 'USAGE: createNewControl.sh "controlName"'
}

if [ $# -ne 1 ]; then
    usage
fi

NAME=$1

if [ -d ../$NAME ]; then
    echo 'ERROR: '$NAME' already exists'
    exit
fi

cp ../FooControl -R ../$NAME

cd ../$NAME
rm createNewControl.sh

rename s/FooControl/$NAME/g *
sed -i s/FooControl/$NAME/g *

echo '***********************************'
echo $NAME 'was created successfully.'
echo '***********************************'
echo '1.- Start programming right now'
echo '2.- Remenber add the control '$NAME' on config/map.controls.yaml'
echo ''


