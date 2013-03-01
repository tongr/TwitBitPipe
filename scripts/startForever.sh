#!/bin/bash

current_dir=$(pwd)
module_dir=$(dirname $0)/..

cd $module_dir

node ./runForever.js >> ./forever.log 2>> ./forever.error &
echo $!
echo $! > ./forever.pid

cd $current_dir
