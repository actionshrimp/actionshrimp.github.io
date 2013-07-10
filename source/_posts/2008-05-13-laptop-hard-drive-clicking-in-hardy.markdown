---
layout: post
title: "Laptop hard drive clicking in Hardy"
date: 2008-05-13 19:00
comments: true
categories: hardware ubuntu
---
Since I installed Hardy a week or so ago, I noticed the hard drive in my laptop was making a strange clicking noise every 5 seconds or so. At first I thought it must be slowly dying, and I was starting to get a bit worried, but then realised it seemed a bit suspicious that it coincided with Hardy so closely, so I searched around. 

<!--more-->

Turns out I wasn't the only one with the problem, and I found a solution [here][1]. (Thanks to wieman01 on the Ubuntu forums for this.) What was happening was Ubuntu's power management was a bit over zealous and was making the hard drive spin up and down far too often. By changing the power settings this can be fixed, using the command: 

    $ hdparm -B 254 /dev/xxx 
    
replacing xxx with your drive name, in my case for my SATA drive it was /dev/sda. `254` here is the lowest level of power management, and `255` is off completely. You can try playing with higher values if you like some kind of power management. To make this run every time the computer starts, add it to a startup script. For example, save a plain text file containing the above line to: 

    /etc/init.d/local_settings
    
Then: 

    $ cd /etc/init.d
    $ sudo chmod +x local_settings
    $ sudo ln -s local_settings /etc/rc2.d/S99local_settings

This makes the file executable, and creates a symbolic link to it in the folder which contains the start-up scripts, giving it priority 99. Hopefully your clicking noise will now be gone!

 [1]: http://ubuntuforums.org/showthread.php?t=531866
