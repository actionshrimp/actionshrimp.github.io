---
layout: post
title: "Vim XPath Plugin"
date: 2011-04-03 22:21
comments: true
categories: vim own-projects
---

I've built a plugin that adds XPath search functionality to Vim. Check out the demo video below. 

<iframe src="http://player.vimeo.com/video/21857707" width="500" height="431" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
<p style="font-style: italic"><a href="http://vimeo.com/21857707">Vim XPath Plugin Demo</a> from <a href="http://vimeo.com/actionshrimp">Dave Aitken</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

Features:
  *   Quick XPath search input with smart, context-sensitive tab completion
  *   Results shown in a pop-up results window. Jump to the line of a matching result easily
  *   Debug invalid XML - jump to the the line number of an XML error from the results window

Requirements:
  *   Python support enabled in Vim
  *   lxml library installed for Python (ideally 2.7 or higher). For more info, and to grab the plugin by downloading the vimball, visit [my github][1]. Let me know what you think / any improvement suggestions in the comments below.

 [1]: https://github.com/actionshrimp/vim-xpath
