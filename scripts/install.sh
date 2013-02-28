#!/bin/sh

echo '========================================'
echo 'Insalling missing node modules ...'
echo '========================================'
CALL npm install amqp
echo '----------------------------------------'
CALL npm install ntwitter

echo '========================================'
echo 'Configuring ...'
echo '========================================'
cp twitter.credentials.example.js twitter.credentials.private.js
echo 'Please configure Twitter streaming API access (twitter.credentials.private.js)'
while true; do
  read -p 'Edit twitter.credentials.private.js now (Y/[N])?' yn
  case $yn in
    [Yy]* ) vi twitter.credentials.private.js; break;;
    [Nn]* ) break;;
    * ) echo 'Please answer Y or N.';;
  esac
done

echo '----------------------------------------'
cp rabbitmq.config.example.js rabbitmq.config.private.js
echo 'Please configure RabbitMQ server settings (rabbitmq.config.private.js)'
while true; do
  read -p 'Edit rabbitmq.config.private.js now (Y/[N])?' yn
  case $yn in
    [Yy]* ) vi rabbitmq.config.private.js; break;;
    [Nn]* ) break;;
    * ) echo 'Please answer Y or N.';;
  esac
done

echo '========================================'
echo 'Installation finished!'
echo '========================================'
