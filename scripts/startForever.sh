#!/bin/bash

current_dir=$(pwd)
module_dir=$(dirname $0)/..

cd $module_dir

# trim old log files
mv ./forever.log ./forever.log.backup
tail -n 100 ./forever.log.backup > ./forever.log
mv ./forever.error ./forever.error.backup
tail -n 100 ./forever.error.backup > ./forever.error

node ./runForever.js >> ./forever.log 2>> ./forever.error &
echo $!
echo $! > ./forever.pid

cd $current_dir
