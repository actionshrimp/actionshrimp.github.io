---
layout: post
title: "Streaming Spotify to a PS3 from Ubuntu"
date: 2010-08-15 08:59
comments: true
categories: Spotify PS3 Ubuntu
---
<img class="alignleft" src="/images/spotify-logo.png" width="76" height="76" /> A post came up a couple of days ago on the Spotify "What's new" feed: [how to stream spotify wirelessly to your stereo][1], which got me thinking about something I've been after for a while - the ability to stream spotify audio to PS3. This is mentioned in the link, but the main method they talk about is for Windows, and a solution for mac is touched upon. I figured I'd have a go at doing this on Ubuntu. Before you have a go at this, I should mention a slight drawback - there's a fair delay on the audio steam that reaches the PS3, around 20 or 30 seconds. This makes it good for playing a playlist as background music, but if you're wanting to be able to flick around loads of different songs then you might get a bit frustrated. Read on if you're still keen... 

<!--more-->

The general approach we're going for is to convert the computer that's playing spotify's audio feed into a web radio station, which can then be played through a UPnP server that can be read by the ps3. Sounds a bit long winded? Well it is really! I'm sure there are better ways - I tried to pipe the spotify feed to a file and then play the file through the UPnP server instead, but this didn't work with the way the PS3 buffers. Let me know if you find a better way though. Here's how I did it anyway:

# 1. Install ps3mediaserver 

You may have come across [ps3mediaserver][2] before if you're a PS3 owner - it's a great UPnP server that requires little setup. Head over to the [downloads page][3]. I grabbed `pms-generic-linux-unix-1.20.409-BETA.tgz`, although I'm pretty sure this will work fine with the stable version too. Extract the archive somewhere and fire up ps3mediaserver to try it out. With any luck it should locate your ps3. Add a share with some mp3s/videos in, restart it and give them a spin to check it all works. Try and make sure this is all working fine before carrying on, otherwise the later steps are unlikely to work. 

# 2. Grab pmsencoder 

The next thing we need is a plugin for ps3mediaserver called [pmsencoder][4]. This is pretty handy in itself - it allows you to stream podcasts from a feed URL, shoutcast radio stations and various web video streams. Head over to the pmsencoder page, and look in the installation instructions on how to install the plugin. You pretty much just need to download the plugin .jar file to your ps3mediaserver /plugins folder, and then add the pmsencoder engine to the engines line in the PMS.conf configuration file (if the PMS.conf configuration doesn't exist, open up ps3media server, fiddle with some settings (like adding a share or changing transcoding options, then hit 'save'. This will create the file). When that's all done, restart ps3mediaserver and have a look on your PS3 again. With any luck, there should be a folder called 'Web', with some default web sources available to have a look at (Endgadget Podcast, various Youtube feeds). Again, try these out and see if they work, as if they don't then you'll probably want to get this working before proceeding. In particular, make sure the 'Radio' sources are working, as we're gonna be pushing our Spotify feed through as a radio station.

# 3. Grab icecast2

Once ps3mediaserver and pmsencoder are working, we need to set up an icecast server to broadcast our soon-to-be-made stream to pmsencoder. If you're on ubuntu, you can just do `sudo apt-get install icecast2` to grab the icecast2 server. Once this is done, edit `/etc/icecast2/icecast.xml` and change the source and admin password to prevent random hijacking of your radio station. When the passwords have been changed, you'll want to edit `/etc/default/icecast2` and change the line at the bottom `ENABLE=false` to `ENABLE=true`. Now you can launch the icecast server: `sudo /etc/init.d/icecast2 start` Try and visit http://localhost:8000/ and see if anything displays. If all has gone well, you should get the icecast2 status page. 

# 4. Add a spotify radio source to pmsencoder

Now our icecast server is running, we need to let pmsencoder and ps3mediaserver know about it. Open up the file WEB.conf in the directory where you've been running ps3mediaserver from. Under the #shoutcasts section, add a new source: 

    audiostream.Web,Radios=Spotify,http://localhost:8000/spotify.ogg
    
then restart ps3mediaserver. 

# 5. Send the computer's audio to icecast2

Next, we grab the computer's audio and use gstreamer to send it to icecast2. Type the following `pacmd list-sources | less` to get a list of pulseaudio sources. You should get a bunch of output back, but it should hopefully only list one device. You're looking for the part beginning like this: 

    ...
    <div id="_mcePaste">index: 0</div>
    <div id="_mcePaste">name: <alsa_output.pci-0000_00_08.0.analog-stereo.monitor></div>
    <div id="_mcePaste">driver: <module-alsa-card.c></div>
    <div id="_mcePaste">flags: DECIBEL_VOLUME LATENCY DYNAMIC_LATENCY</div>
    <div id="_mcePaste">state: IDLE</div>
    ... 

in particular the name, which in my case is alsa\_output.pci-0000\_00\_08.0.analog-stereo.monitor. Make a note of yours. Next we just run a command to convert this pulse source into an ogg file, which is then sent to the icecast2 server. Run the following, replacing the device with your own, and the password at the end with the icecast2 source password you set earlier:

    gst-launch-0.10 pulsesrc device=alsa_output.pci-0000_00_08.0.analog-stereo.monitor ! audioconvert ! vorbisenc ! oggmux ! shout2send ip=localhost port=8000 password=hackme mount=spotify.ogg
    
Now all sound that comes through your computer's speakers is being sent to your icecast2 server. All that remains is to fire up Spotify. Start playing a track, and then on your ps3 navigate to the Web folder > Radio > Spotify. With any luck, after 20 or 30 seconds you should hear the track starting on your ps3 as well! Let me know if you have any problems with the last few steps, although any problems with ps3mediaserver or pmsencoder are probably best tackled through the ps3mediaserver forums as I'm no expert on these two. Hopefully someone out there will have found this useful - again, let me know if you do :-)

 [1]: http://www.simpleeditions.com/8001/how-to-stream-spotify-wirelessly-to-your-stereo
 [2]: http://http://ps3mediaserver.blogspot.com/
 [3]: http://code.google.com/p/ps3mediaserver/downloads/list
 [4]: http://github.com/chocolateboy/pmsencoder
