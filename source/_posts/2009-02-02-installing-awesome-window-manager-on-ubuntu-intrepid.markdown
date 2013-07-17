---
layout: post
title: "Installing awesome Window Manager on Ubuntu Intrepid"
date: 2009-02-02 16:59
comments: true
categories: ubuntu
---
*Quick Note: This post was originally published on 02/02/2009, so is probably a bit outdated now.*

<img src="http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/02/awesomescreenmini.png" width="200" height="98" /> Today I had a go at installing [awesome window manager][1]. awesome is a great tiling window manager, useful if you have a large monitor and are fed up with having one window taking up all the space when it doesn't really need it all. For example, having firefox maximised on a 1920x1200 resolution monitor can mean you end up with very large sentences that spread across the screen, decreasing readability. Unfortunately the version of awesome in the Interpid repos is 2.3.2-1, which is now deprecated, and the current stable release is version 3.1-1.  The website suggests building from source - I attempted this but there are currently a couple of issues with compilation mentioned in the wiki, and even with the fix suggested I couldn't quite get it to work - although I didn't try too hard it must be said; instead I found another method which I will walk you through now.

<!--more-->

## Installing and Trying It Out 

The method I ended up using revolves using binaries from the Debian experimental repository, which seem to work perfectly. First, you can download the awesome 3.1-1 package (N.B. The binaries I'm linking to here from Debian's website are for i386, for others just search for them on the site), and try and install it with: 

    $ wget http://ftp.uk.debian.org/debian/pool/main/a/awesome/awesome_3.1-1_i386.deb
    $ sudo dpkg -i awesome_3.1-1_i386.deb
    
However, it will spit out a list of dependencies it couldn't manage - these are packages that are also outdated in the current Ubuntu repos. So next, fetch the ones you need which are listed below: 

    $ wget http://ftp.uk.debian.org/debian/pool/main/x/xcb-util/libxcb-atom1_0.3.2-1_i386.deb
    $ wget http://ftp.uk.debian.org/debian/pool/main/x/xcb-util/libxcb-aux0_0.3.2-1_i386.deb
    $ wget http://ftp.uk.debian.org/debian/pool/main/x/xcb-util/libxcb-event1_0.3.2-1_i386.deb
    $ wget http://ftp.uk.debian.org/debian/pool/main/x/xcb-util/libxcb-icccm1_0.3.2-1_i386.deb
    $ wget http://ftp.uk.debian.org/debian/pool/main/x/xcb-util/libxcb-keysyms0_0.3.2-1_i386.deb
    $ wget http://ftp.uk.debian.org/debian/pool/main/x/xcb-util/libxcb-property1_0.3.2-1_i386.deb
    $ wget http://ftp.uk.debian.org/debian/pool/main/x/xcb-util/libxcb-render-util0_0.3.2-1_i386.deb
    
Then try and install them all with dpkg: 

    $ sudo dpkg -i awesome_3.1-1_i386.deb libxcb-atom1_0.3.2-1_i386.deb libxcb-aux0_0.3.2-1_i386.deb \
    libxcb-event1_0.3.2-1_i386.deb libxcb-icccm1_0.3.2-1_i386.deb libxcb-property1_0.3.2-1_i386.deb \
    libxcb-render-util0_0.3.2-1_i386.deb libxcb-keysyms0_0.3.2-1_i386.deb
    
At this point, it might spit out that it needs some extra packages - these are packages that you should just be able to install normally with synaptic or apt: I had to install `menu` for example, and you may have to install some others as I had a few other dependencies installed from trying to build from source earlier on. Once you have all the packages, run the above command again to install awesome. Once awesome is installed, you'll need a configuration file. A default config file is provided, so go ahead and copy it to your home dir: 

    $ mkdir ~/.config/awesome
    $ cp /etc/xdg/awesome/rc.lua ~/.config/awesome/rc.lua
    
Now we can see if awesome works - kill your current window manager (in my case compiz), then fire up awesome: 

    $ killall compiz.real && awesome&
    
Hopefully everything has gone to plan, and awesome should now be running! Hooray! Have a little play around with it, mess with the config file a bit and see if you like it. Some useful key-bindings are: 

- Win + Enter - launch a terminal
- Win + F1 - run a command
- Win + J/K - switch windows (à la vim)
- Win + H/L - resize major/minor divide
- Win + Shift + J/K - move windows
- Win + Space - change layout
- Win + Ctrl + r - restart awesome, for example to update if you change the config file 

There are loads more keybindings that you can find/change in the config file if you wanna know what they all do exactly.

If after using awesome for a while you decide you want to keep it, there are a few loose ends to tie up. 

## Setting awesome as the Default Window Manager 

First, fire up gconf-editor: 

    $ gconf-editor
    
On the list on the left, goto `desktop &gt; gnome &gt; session`. First of all, we'll get rid of the gnome-panels - awesome already has its own. On the right, there is a name/value pair with name `required\_components\_list`, containing `[windowmanager, panel, filemanager]`. Remove panel, so it becomes `[windowmanager, filemanager]`. 

Next we actually tell gnome to load in awesome instead of compiz. On the list on the left, choose the folder `required_components`. Change the windowmanager field from `compiz` to `awesome`. Finally, you'll probably wan't to disable nautilus's desktop (where the desktop icons live etc.) as it can do funny things, and with your magical new tiling windows you will probably never see the desktop. To do this, from the list on the left choose `apps &gt; nautilus &gt; preferences` and when here, uncheck `show_desktop`. Now you can kiss sweet goodbye to all the remnants of your old desktop - log out of your system and log back in again to see it take effect. WARNING: If something has gone wrong and awesome doesn't load (maybe you mispelt it in gconf-editor or something), you should still be able to find a way to edit the gconf preferences, but it took me a while to figure out how to logout when the normal gnome logout button had disappeared. To logout in this situation, use `gnome-session-save --kill`. 

## Customising and Configuring 

Due to the highly keyboard oriented nature of awesome, you may now want to install a launcher. A couple of good ones are Gnome-Do (if you opt for this, you will have to change the binding from Win+Space in the awesome preferences, or reconfigure awesome's binding for this combination), an all singing all dancing affair which I used for a while, or dmenu which is quite a lot simpler and I've opted for in this case. To install dmenu: 

    $ sudo apt-get install dmenu
    
Next we setup a keybinding for it to launch in the awesome config file. Underneath the line: 

    -- \{\{\{ Keybindings 

add (here it is mapped to Win+P - change this if you like): 

    -- dmenu
    keybinding({ modkey }, "p", function () awful.util.spawn("`dmenu_path | dmenu -b`") end):add()
    
Also, as awesome is aimed at uber geeks the time is displayed by default with.... unix `time_t`. Unless you're some kind of time_t reading magician, hunt down the section in the config file that looks like this, and comment/uncomment accordingly: 

    -- For unix time_t lovers
    --mytextbox.text = " " .. os.time() .. " time_t "
    -- Otherwise use:
    mytextbox.text = " " .. os.date() .. " "
    
Finally, I missed my CPU monitor. There is however a set of widgets you can get that adds functionality like this called wicked. Install wicked: 

    $ git clone git://git.glacicle.com/awesome/wicked.git
    $ sudo cp wicked/wicked.lua /usr/share/awesome/lib/
    $ sudo cp wicked/wicked.7.gz /usr/share/man/man7/
    
in config file, underneath: 

    -- \{\{\{ Wicked Widgets
    
Add in: 

    -- \{\{\{ Wicked Widgets
    -- CPU Usage Graph
    cpugraphwidget = widget({
        type = 'graph',
        name = 'cpugraphwidget',
        align = 'left'
    })
    cpugraphwidget.height = 0.85
    cpugraphwidget.width = 45
    cpugraphwidget.bg = '#333333'
    cpugraphwidget.border_color = '#0a0a0a'
    cpugraphwidget.grow = 'right'

    cpugraphwidget:plot_properties_set('cpu', {
        fg = '#AEC6D8',
        fg_center = '#285577',
        fg_end = '#285577',
        vertical_gradient = false
    })
    wicked.register(cpugraphwidget, wicked.widgets.cpu, '$1', 1, 'cpu')
    
Then add in the cpugraphwidget into the mywibox[s].widgets line: 

    mywibox[s].widgets = { mylauncher,
        mytaglist[s],
        mytasklist[s],
        mypromptbox[s],
        cpugraphwidget,
        mytextbox,
        mylayoutbox[s],
        ...
        
For full instructions on [how to use wicked][2], and configure awesome, check out the [awesome wiki][3]. Have fun!

 [1]: http://awesome.naquadah.org/
 [2]: http://awesome.naquadah.org/wiki/index.php?title=Wicked
 [3]: http://awesome.naquadah.org/wiki/index.php?title=Main_Page
