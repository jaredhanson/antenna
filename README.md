# antenna

[![Build](https://travis-ci.org/jaredhanson/antenna.png)](https://travis-ci.org/jaredhanson/antenna)
[![Coverage](https://coveralls.io/repos/jaredhanson/antenna/badge.png)](https://coveralls.io/r/jaredhanson/antenna)
[![Quality](https://codeclimate.com/github/jaredhanson/antenna.png)](https://codeclimate.com/github/jaredhanson/antenna)
[![Dependencies](https://david-dm.org/jaredhanson/antenna.png)](https://david-dm.org/jaredhanson/antenna)
[![Tips](http://img.shields.io/gittip/jaredhanson.png)](https://www.gittip.com/jaredhanson/)


Antenna is a [publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe)
middleware layer for [Node](http://nodejs.org).  Applications can be constructed
by using _middleware_ and defining _routes_.

This architecture has been proven effective by [Express](http://expressjs.com/),
which provides HTTP middleware.  Antenna adopts this approach, repurposing it
for use with a message bus, allowing listeners to be built quickly and easily,
using patterns familiar to Node.js developers.

## Install

    $ npm install antenna
    
## Usage

    var antenna = require('antenna');
    var app = antenna();
    
    app.listen('events/:event', function(msg, next) {
      console.log('got event: ' + msg.params.event);
    });

## Adapters

Adapters are used to connect to message buses, receiving messages and
dispatching those messages to the application for processing.

The following table lists commonly used adapters:

|Adapter                                             |Developer                                       |
|----------------------------------------------------|------------------------------------------------|
|[AMQP](https://github.com/jaredhanson/antenna-amqp) |[Jared Hanson](https://github.com/jaredhanson)  |

## Tests

    $ npm install
    $ make test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2014 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
