---
layout: post
title: "Setting up a client side JS dev environment with node.js - Part 1"
date: 2012-06-03 16:14
comments: true
categories: puzzli node.js coffeescript express jade
---

**Edit 2015/03/14**: *This post was written a couple of years ago so is a bit outdated now. Express in particular has changed quite a bit since this was written*

This is another post in my [puzzli series][1]. This post documents getting node set up to create a simple environment to work on the client side JS code in. I could potentially just use a static web page to begin with and start the basics of the client side in there, but I may as well set up a simple server side so I can stub in any server side endpoints as they arise. I'll also get good ease of install and use of coffeescript and other JS ecosystem stuff. If you want to see the final code, this post runs from the start of my puzz.li repo up until [this commit][2].

I already had node installed through the download from the node website - the installer is a cinch on OSX. I'm going to use the [express][3] web framework for node:

`npm install express`

I'll also use the rails-style asset pipeline middleware for the node connect layer (which express uses), connect-assets:

`npm install connect-assets`

This should take care of auto-compiling my CoffeeScript when it gets sent down to the client side. Finally I'll be starting off with the jade template engine which seems to have good support by default with express, although I may well swap this out for something else down the line:

`npm install jade`

Next, getting underway with a bit of boilerplate (always happy to know if any of my code looks a bit off or there is a better way of doing anything, please let me know :-)):

## boot.js

``` javascript
    #!/usr/bin/env node 
    
    var server = require('./'); 
    server.listen(3000); 
    console.log("Express server listening on port %d in %s mode", server.address().port, server.settings.env);
```
    

## index.js

``` javascript
    var express = require('express');
    var assets= require('connect-assets');
    
    var app = module.exports = express.createServer();
    
    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(assets());
        app.use(express.static(__dirname + '/public'));
    });
    
    app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    });
    
    app.configure('production', function(){
        app.use(express.errorHandler()); 
    });
    
    //Set up basic routing
    require('./routes.js')(app);
```

## routes.js

```
    module.exports = function(app) {
    
        app.get('/', function(req, res) {
            res.render('index', {title: 'Puzzli'});
        });
    
    }
```

This should be enough to get a server up and running, and serve up the first couple of pages:

## layout.jade

``` jade
    !!!
    html
      head
        title= title
        != css('master')
      body!= body
```

## index.jade

``` jade
    h1= title
    p Welcome to #{title}
```

Looks like it's working so far. Up next I'll be setting up jasmine for TDD on the client side, and then getting underway with building something.

 [1]: http://www.actionshrimp.com/bloc/categories/puzzli/
 [2]: https://github.com/actionshrimp/puzz.li/commit/2d44c2c6d8d1a52f724fa5099e2e3741149681bc
 [3]: http://expressjs.com
