# TwitBitPipe.js - Twitter to RabbitMQ Pipe

Quick prototype for piping Twitter from the streaming API to a RabbitMQ server written in Node.js.


## Uses
This prototype is suitable for co-ordinating different software modules accessing the same Twitter Streaming API data by acting as a gateway.
To distribute the incoming data it utilizes the RabbitMQ  messaging infrastructure.

The data is piped as follows:

Twitter Stream -> Filter -> RabbitMQ -> &lt;consumer&gt;

By using the fanout exchange on RabbitMQ it allows to have multiple consumers at once and receive real-time tweets.


## Requirements
* Node.js - http://nodejs.org/
    * ntwitter - https://github.com/AvianFlu/ntwitter
    * node-amqp - https://github.com/postwait/node-amqp
* RabbitMQ server - http://www.rabbitmq.com/
* Twitter Streaming API access - https://dev.twitter.com/
* Optional:
    * **incompatible to Windows**: Node.js pluging forever-monitor to run the runForever.js script  - https://github.com/nodejitsu/forever-monitor (run: npm forever-monitor -g)

## How to
1. install dependencies (ntwitter/node-amqp/...)
    * npm install ntwitter
    * npm install node-amqp
2. configure twitter account in twitter.credentials.private.js (see also twitter.credentials.example.js)
3. rabbitmq-server
4. configure rabbitmq server access in rabbitmq.config.private.js  (see also rabbitmq.config.example.js)
5. blow the pipe: node run.js (node runForever.js in case of forever-monitor compatible environmets)


## License
This software is licensed under the Apache 2 license, quoted below.

Copyright 2013 Hasso Plattner Institute for Software Systems Engineering - http://www.hpi-web.de/

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.