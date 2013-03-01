#!/bin/bash

current_dir=$(pwd)
module_dir=$(dirname $0)/..

cd $module_dir
echo '========================================'
echo 'Installing missing node modules ...'
echo '========================================'
npm install amqp
echo '----------------------------------------'
npm install ntwitter

echo '========================================'
echo 'Configuring ...'
echo '========================================'
echo 'Please configure Twitter streaming API access (twitter.credentials.private.js)'
cp -i twitter.credentials.example.js twitter.credentials.private.js
while true; do
  read -p 'Edit twitter.credentials.private.js now (Y/[N])? ' yn
  case $yn in
    [Yy]* ) vi twitter.credentials.private.js; break;;
    [Nn]* ) break;;
    * ) echo 'Please answer Y or N.';;
  esac
done

echo '----------------------------------------'
echo 'Please configure RabbitMQ server settings (rabbitmq.config.private.js)'
cp -i rabbitmq.config.example.js rabbitmq.config.private.js
while true; do
  read -p 'Edit rabbitmq.config.private.js now (Y/[N])? ' yn
  case $yn in
    [Yy]* ) vi rabbitmq.config.private.js; break;;
    [Nn]* ) break;;
    * ) echo 'Please answer Y or N.';;
  esac
done

echo '========================================'
echo 'Installation finished!'
echo '========================================'

cd $current_dir
