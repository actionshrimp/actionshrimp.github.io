---
layout: post
title: "jasmine-node --autotest with vim on OSX"
date: 2012-06-17 16:39
comments: true
categories: autotest jasmine TDD vim node.js
---
My [last post][1] was about setting up `jasmine-node`. I had this all in place, and was getting ready to dive into some development, hoping to use the `--autotest` feature to help with TDD. I fired up jasmine-node with

    jasmine-node --autotest --coffee spec

At first glance it looked like everything was working correctly. All specs ran the first time, and when I made a change to a file the specs in just that single file were run. However, any subsequent changes to the file then no longer caused the test runner to trigger automatically.

At first I assumed this was an issue with node.js' implementation of `fs.watch`, which at the time of writing appears to have [quite a few issues open against it][2]. After looking at the changelog for some recent node releases, it looked like there were some `fs.watch` fixes, so I updated to the latest version at the time (v0.6.19). Still no joy - I was having the same problem.

Next I decided to have a poke around in the jasmine-node code itself and see if I could find any problems. The area of code in question is the file jasmine-node/lib/jasmine-node/autotest.js. There is the call to `fs.watch`, which takes a callback that takes the event as its first parameter:

    var watcher = fs.watch(file, function(ev) {
        ...
    

According to the [node documentation for fs.watch][3]:

> The listener callback gets two arguments (event, filename). event is either 'rename' or 'change', and filename is the name of the file which triggered the event.

I found that when saving a file in vim, the 'rename' event was being triggered, rather than the 'change' event, which gave me a clue to what was happening. I then tracked down [this post on stackoverflow][4] which seems to describe a similar problem, only with the python library watchdog. Watchdog uses kqueue to implement FS monitoring on OSX - the same implementation as node.

What's happening is vim's use of .swp files is triggering rename. I assume after swapping, kqueue continues to monitor the swapped file rather than the actual filename we're interested in. The workaround that watchdog suggests is to set `noswapfile` in your .vimrc, which is a solution that some people might be happy with. However as much as I love vim it does occasionally crash on me, and losing changes that would be stored in a swp file during a crash isn't too appealing.

I fiddled around with the autotest.js file to try and get kqueue to set up a new watch on the swapped file briefly, without much success (often the file being swapped in hadn't been moved yet, so node would throw errors saying the file wasn't found). My solution was to instead change the call to fs.watch to use fs.watchFile instead, which slots in exactly in place with the same arguments:

    var watcher = fs.watchFile(file, function(ev) {
        ...
    

The [documentation][5] recommends using `fs.watch` instead of `fs.watchFile` where possible, but in this case it doesn't look like it cuts the mustard. `fs.watchFile` is a little less snappy that `fs.watch` (it polls the file's last modified date to see if there are changes, rather than using an event driven system like kqueue), but it definitely does the trick for now and allows a nice TDD workflow. As it's for testing and won't be in live code I can't see it causing too much harm.

If anyone knows of a better way of getting this working then please let me know below in the comments! I'll update if I find a nicer workaround too.

 [1]: http://www.actionshrimp.com/2012/06/setting-up-a-client-side-js-development-environment-with-node-js-part-2/
 [2]: https://github.com/joyent/node/issues/search?q=fs.watch
 [3]: http://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener
 [4]: http://stackoverflow.com/questions/7591527/writing-a-file-with-vim-doesnt-fire-a-file-change-event-on-os-x
 [5]: http://nodejs.org/docs/latest/api/fs.html#fs_fs_watchfile_filename_options_listener
