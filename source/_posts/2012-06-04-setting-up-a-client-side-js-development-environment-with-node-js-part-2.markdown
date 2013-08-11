---
layout: post
title: "Setting up a client side JS dev environment with node.js - Part 2"
date: 2012-06-04 16:14
comments: true
categories: puzzli node.js coffeescript express jade TDD
---
This is another post in my [puzzli series][1].

I've already set up node in [part 1][2], to serve up a simple page to use as a JS development environment. Next I'll be setting up [jasmine][3] so I can do TDD on the client side code for puzz.li. This commits for this post are from where we left off on the previous post, up to [this commit][4].

First a quick diversion about dependency management. Up until now I'd just been doing:

`npm install <modulename>`

However unless I check all the node_modules I've added into git, as more and more dependencies are added deploying the app elsewhere will become a bit tricky. The solution to this problem is to create a package.json file, where you can define dependencies. This is what mine looks like so far:

``` json
## package.json
{
    "name":         "puzz.li",
    "version":      "0.0.1",
    "description":  "A puzzle website",
    "homepage":     "http://puzz.li",
    "repository":   {
                        "type": "git",
                        "url":  "https://github.com/actionshrimp/puzz.li"
                    },
    "author":       "Dave Aitken <dave.aitken@gmail.com>",
    "licences":     ["MIT"],
    "dependencies": {
                        "express": "2.5.9",
                        "connect-assets": "2.2.0",
                        "jade": "0.26.0"
                     }
}
```

As you can see it gives a bit of info about the package itself, as well as defining the dependencies to get it up and running. Now when checking the app out from the github repo, it just requires a single command:

`npm install`

and all the dependencies of the right version will be grabbed automatically as you'd expect.

Back to setting up jasmine now. We kick off by install jasmine-node, a module that sets up jasmine nicely in a node environment, and supports specs written in coffeescript as well. As we (hopefully) won't need jasmine-node to actually deploy the app to production, we can add it into package.json as a devDependency like so:

``` json
{ 
    ... 
    "devDependencies": { 
        "jasmine-node": ">= 1.0.26"
    }
    ...
} 
```

and again

`npm install`

Finally, we just need to set up a simple link to jasmine's script runner so it's nice and accessible:

    $ ln -s node_modules/jasmine-node/bin/jasmine-node run_specs
    $ chmod u+x run_specs
    

Let's see if everything's working by trying to get a simple always-true spec running.

``` coffeescript
## spec/jasmine_spec.coffee

describe 'Jasmine', -> 
    it 'should be set up correctly', -> 
        expect(true).toBeTruthy()
```

and now we run it with our new command:

    $ ./run_specs --coffee spec
    
    .
    
    Finished in 0.008 seconds
    1 test, 1 assertion, 0 failures
    

We're finally in a position to get underway with actually building something, and that will be the subject of the next post.

 [1]: http://www.actionshrimp.com/category/puzzli/
 [2]: http://www.actionshrimp.com/2012/06/setting-up-a-simple-client-side-development-environment-with-node-js-part-1/
 [3]: http://pivotal.github.com/jasmine/
 [4]: https://github.com/actionshrimp/puzz.li/commit/5f1783328516cec99febb01b4d0ce41d112019c7
