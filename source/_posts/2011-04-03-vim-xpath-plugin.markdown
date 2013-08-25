---
layout: post
title: "Vim XPath Plugin"
date: 2011-04-03 22:21
comments: true
categories: vim own-projects
---

I've built a plugin that adds XPath search functionality to Vim. Check out the demo video below. 

This video and blurb is actually about the old version of the plugin. It has since been rewritten, although it is functionally very similar to the video below. There is no XPath auto-completion anymore though, and results instead appear in the vim location list.

<iframe src="http://player.vimeo.com/video/21857707" width="500" height="431" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
<p style="font-style: italic"><a href="http://vimeo.com/21857707">Vim XPath Plugin Demo</a> from <a href="http://vimeo.com/actionshrimp">Dave Aitken</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

Features:
  *   Results shown in a pop-up results window. Jump to the line of a matching result easily

Requirements:
  *   Python support enabled in Vim
  *   lxml library installed for Python. For more info, and to grab the plugin visit [my github][1]. Let me know what you think / any improvement suggestions in the comments below.

 [1]: https://github.com/actionshrimp/vim-xpath
