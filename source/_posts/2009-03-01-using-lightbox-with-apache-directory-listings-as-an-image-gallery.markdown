---
layout: post
title: "Using Lightbox with Apache directory listings as an image gallery"
date: 2009-03-01 22:10
comments: true
categories: apache
author: "Matt Bray"
---

_This is a guest post from my friend [Matt Bray][1]_

<img src="/images/lightbox-300x184.jpg" width="300" height="184" /> As you may know, if it can't find an `index.html` the apache web server will show a list of files in the current directory. I was browsing through lists of images on my file server the other day and I thought, wouldn't it be nice to have a next button? So I started digging around. 

In the end I used a wonderful little script called [Lightbox 2][2] and a bit of JavaScript [Prototype][3] magic to produce [this][4] (try clicking on the image files). The directory listings are provided by an apache module going by the name of `mod_autoindex`. This module allows you to insert a custom header and footer through the directives `HeaderName` and `ReadmeName`. The plan is to insert some HTML that includes the Lightbox code and tags all the links to images with the `rel=lightbox` attribute that Lightbox uses to function. 

<!--more-->

Create a directory called `lightbox` in your server's document root. Download [Lightbox 2][5] and extract it to that directory (go to `http://www.yourwebsite.com/lightbox` to try it out). To get the Lightbox 'loading' and 'next' images to show up, you need to edit a couple of lines in the configuration section of `js/lightbox.js` that comes with Lightbox. Change the following

    LightboxOptions = Object.extend({
    fileLoadingImage:        'images/loading.gif',
    fileBottomNavCloseImage: 'images/closelabel.gif',

to look like

    LightboxOptions = Object.extend({
    fileLoadingImage:        '/lightbox/images/loading.gif',
    fileBottomNavCloseImage: '/lightbox/images/closelabel.gif',

I also adjusted `resizeSpeed` to 9 to make it feel a little snappier, change this to your taste. Now create a new file called `lightbox.html` in your `/lightbox` directory and copy and paste the following:

    <script src="/lightbox/js/prototype.js" type="text/javascript"></script>
    <script src="/lightbox/js/scriptaculous.js?load=effects,builder" type="text/javascript"></script>
    <script src="/lightbox/js/lightbox.js" type="text/javascript"></script>
    <script type="text/javascript"><!--
        // Insert the lightbox stylesheet into <head>
        var stylesheet = new Element('link', {  'rel': 'stylesheet',
                                                'href': '/lightbox/css/lightbox.css',
                                                'type': 'text/css',
                                                'media': 'screen'
                                             });
        $$('head')[0].appendChild(stylesheet);

        // Check for links preceded by the image icon provided by mod_autoindex.
        // On my setup the src attribute in the img tag preceding a link to an image
        // is "/icons/image2.gif". This is used to identify links to images.
        $$("a").each( function(elmt) {
                // The default output is tabular, so check the previous cell for the img tag
                imgelmt = elmt.up().previous().down()
                // If the FancyIndexes option is set, the output is formatted differently
                if (imgelmt == undefined) { imgelmt = elmt.previous('img') }
                if (imgelmt.readAttribute('src') == "/icons/image2.gif")
                {
                    elmt.setAttribute('rel', 'lightbox[images]');

                    // As ps suggested, provide a link to the image in the lightbox description
                    link = "&lt;a href='" + elmt.readAttribute('href') + "'&gt;" + 
                            elmt.innerHTML.stripScripts().stripTags() + "&lt;/a&gt;";
                    elmt.setAttribute('title', link );
                }
            } );
    --></script>

Now all you have to do is tell apache to include this file in its directory listing page. Simply paste the following two lines into a file named `.htaccess` and copy it to any directory that you want Lightbox to appear in.

    Options Indexes
    ReadmeName /lightbox/lightbox.html

Et voila! No php, no databases to maintain. Image galleries don't get much simpler than that.

You can download the files mentioned above [here][6].

 [1]: http://mattjbray.com
 [2]: http://www.lokeshdhakar.com/projects/lightbox2/
 [3]: http://prototypejs.org
 [4]: http://bf.mattjbray.com/lightbox_images
 [5]: http://www.lokeshdhakar.com/projects/lightbox2/#download
 [6]: /files/lightbox1.zip
