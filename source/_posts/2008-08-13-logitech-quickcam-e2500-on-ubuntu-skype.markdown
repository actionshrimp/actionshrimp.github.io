---
layout: post
title: "Logitech QuickCam E2500 on Ubuntu Skype"
date: 2008-08-13 00:12
comments: true
external-url:
categories:
---
I recently discovered the wonders of skype, and tried to get my new webcam working with it under linux, and of course this proved to be quite tricky. After much fiddling I eventually got it to work, hopefully these steps will work for you too. 
*Please note, this post was written in 2008, so is probably pretty out of date now.*
<!--more--> 
The gspca drivers are available from [here][1], I was using a specific version dated 20071224 to work with a patch file I found - many thanks to [redeye on the QuickCam team forums][2]. If you use a different version of the drivers, you can just examine the patch file and insert the changes manually. First, download the drivers and the patch: 

    wget http://mxhaard.free.fr/spca50x/Download/gspcav1-20071224.tar.gz
    wget http://forums.quickcamteam.net/attachment.php?aid=86 -O patch.tar.gz

Then extract and apply the patch: (UPDATE: For Ubuntu 8.10 users, this patch may no longer work. Try downloading the patch [here][3] instead, and then extract it using `gzip -d gspcapatch.gz`. Apply the extracted file in the same way as below, just neglect the `-p1` switch, (so do: `patch < gspcapatch`), you can just ignore the `tar -xvf patch.tar.gz` command). 

    tar -xvf gspcav1-20071224.tar.gz
    tar -xvf patch.tar.gz
    cd gspcav1-20071224
    patch -p1 < ../quickcamE2500.diff
    
There's a handy build script included with the drivers so just run that (requires root): 

    sudo ./gspca_build
    
This generates the file `gspca.ko` which we use to replace the old gspca module. Check to see if the old module has loaded. You should see something like: 

    dave@baracus:~$ lsmod | grep gspca
    gspca                 680656  0
    videodev               29440  1 gspca
    usbcore               146028  9 gspca,snd_usb_audio,snd_usb_lib,usb_storage,usbhid,libusual,ehci_hcd,ohci_hcd

We want to find out where it is, so do the following: 

    sudo rmmod gspca
    sudo modprobe -v gspca

You should see something like: 

    insmod /lib/modules/2.6.24-20-generic/ubuntu/media/gspcav1/gspca.ko

That is the location of the file we're looking for, so, replacing where appropriate with what was output for you above, type: 

    sudo rmmod gspca
    sudo rm /lib/modules/2.6.24-20-generic/ubuntu/media/gspcav1/gspca.ko
    sudo mv gspca.ko /lib/modules/2.6.24-20-generic/ubuntu/media/gspcav1/
    sudo modprobe gspca

This should have loaded the new module in place of the old one. See if you have a video device: 

    dave@baracus:~$ ls /dev/video*
    /dev/video0

You can try and run Skype now, and in fact, if you're not using the camera for Skype, this may well be enough. But for the Skype users: see if you get any picture by testing in the video devices option menu (be warned, it can take a little while to show up there after skype loads, and a little while for the picture to show when you press the test button, so be patient). If anything shows up at all that's a plus. (UPDATE: If you're using Ubuntu 8.10, and have used the alternative patch I posted in the other "UPDATE:" bracket above, the webcam may still not work in Skype at this point. There seems to be some issue with permissions in this version of the driver, so you may need to run skype as root if it doesn't appear to be working. In a terminal type "sudo skype" and hit enter. It'll ask for your root password, then launch Skype. See if the webcam works now). 

Originally I just got a black image, so I assumed the camera wasn't working. But I soon realised that the image was there, just very dark - shining a light on it showed this was the case. I tried fiddling around with gstfakevideo for a while to try and alter the output, but there was a simpler solution. The gspca driver itself can take options, and an autoexposure setting was ruining my lighting. To fix this, edit the file /etc/modprobe.d/options, and add a line at the bottom: 

    options gspca gamma=1 autoexpo=0

The `gamma=1` may not be necessary, but if it still appears too dark or too light for your taste you can change this parameter as you like. Finally, reload the module: 

    sudo rmmod gspca
    sudo modprobe gspca
    
and try out skype again. Hopefully it should work at this point! I ran into quite a lot of other problems while I was trying this out, so if you come across any errors, drop a comment below and I'll try and get back to you asap. 

*UPDATE*: I found a large problem when using the camera in Skype was that CPU usage would shoot up to 100%, causing things to freeze up and conversations to crash after a while. I had played around with [gstfakevideo][4] a bit when trying to get the camera to work originally, and it seems using this when the camera already 'works' means it uses up far less CPU. I haven't had a chance to test it for a long period yet but it seems like it should do the trick. Here's what I did: First, download gstfakevideo using subversion (you may need to install the subversion package, `sudo apt-get subversion` probably does the trick. Then the command below will make a directory called gstfakevideo in your current location, so make sure it's somewhere nice), then compile and install it: 

    svn checkout http://gstfakevideo.googlecode.com/svn/trunk/ gstfakevideo
    cd gstfakevideo
    make
    sudo make install

gstfakevideo creates a new video stream using your webcam, which is formatted differently and Skype seems to get along with it better. The only problem is, it outputs its stream to `/dev/video0` which is where our webcam currently lives. So we have to move the webcam, but this is easy enough: 

    sudo mv /dev/video0 /dev/video1
    
(Actually, gstfakevideo seems to work for me with lower CPU without moving this - but try it moved first anyway). Watch out though, every time you reboot, your webcam will probably go to /dev/video0 by default, assuming you have no other video devices, so you will have to move stuff about to make a space in video0 each time. Now we see if it works: 

    gstfakevideo v4lsrc device=/dev/video1 ! ffmpegcolorspace

What this does is runs gstfakevideo, telling it that the source we're using is a v4l source, and its from /dev/video1. The ffmpegcolorspace argument seems to be for making the stream YUV instead of RGB for some cameras so may not be necessary. It then launches skype, with hopefully the output below: 

    dave@baracus:~$ gstfakevideo v4lsrc device=/dev/video1 ! ffmpegcolorspace
    gst.c create_pipeline (155): pipeline created
    gst.c create_pipeline (159): pipeline linked

If you look in the skype video options now there will be no camera listed. You have to wait a while (it can take 30s or so), until you get some output, ending with something like: 

    gst.c shim_ioctl (201): request=803c7601 nr 1
    gst.c shim_ioctl (208): VIDIOCGCAP
    gst.c shim_ioctl (313): result=0 error=0 Successi

Now a camera should show up in the video menu in skype, with a name like GStreamer fake video (/dev/video0). Try it out, and compare your CPU performance to before. Also try exiting Skype, and moving your video source from /dev/video1 back to video0, and running gstfakevideo again, only with device=/dev/video0, and see if it works (and let me know your findings below!). Finally if gstfakevideo works, we can clean it up so the command isn't so long to type. The script should be stored in: 

    /usr/local/bin/gstfakevideo
    
(Can check this using): 

    dave@baracus:~$ whereis gstfakevideo
    gstfakevideo: /usr/local/bin/gstfakevideo
    
So we edit this file (requires root): 

    sudo gedit /usr/local/bin/gstfakevideo
    
Now, find the line that looks like this: 

    export GST_PIPE="videotestsrc is-live=true ! video/x-raw-yuv,width=640,height=480,framerate=10/1 ! videoscale ! ffmpegcolorspace ! vertigotv ! ffmpegcolorspace"

and change it to (remember where you put your webcam source - if you moved it back to /dev/video0, change the device parameter accordingly): 

    export GST_PIPE="v4lsrc device=/dev/video1 ! ffmpegcolorspace"

and finally look a bit further down, and delete the line: 

    export GST_PIPE="$*"
    
Now Skype will launch with your faked video stream, just from the command gstfakevideo. Good luck! Let me know how you get on.

 [1]: http://mxhaard.free.fr/download.html
 [2]: http://forums.quickcamteam.net/showthread.php?tid=310
 [3]: http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/01/gspcapatch.gz
 [4]: http://code.google.com/p/gstfakevideo
