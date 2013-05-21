#!/bin/bash

#current_dir=$(pwd)
#module_dir=$(dirname $0)/..

#cd $module_dir

pid=$(cat ./forever.pid)

killScript=$(ps -Al | grep $pid | awk '{ print "kill "$4";" }')

eval $killScript

. scripts/startForever.sh

#cd $current_dir
