---
layout: post
title: "Speech Bubble Popups containing a View for Android MapView"
date: 2011-05-12 11:40
comments: true
categories: android java MapView
---

*Update May 2012*: There have been lots of requests in the comments for the source. Sorry for the delay on this one - I finally put the whole app that I'd been working on up on github. [The part from this tutorial specifically is here if you want to take a look][1].

[<img class="alignleft size-medium wp-image-362" title="bubble-screen-cropped" src="/images/bubble-screen-cropped-293x300.png" alt="" width="293" height="300" />][2] I've recently been playing around with Android, and have been building a small app that uses MapView to display various locations on the map. I succeeded in drawing markers on the MapView using [ItemizedOverlay][3], but was having a fair bit of difficulty drawing little bubble popups that appeared when you tapped on the OverlayItems (which unfortunately isn't available in the API as a 'standard' feature).

My main problem was I wanted to be able to draw a full View on top of the map at the right location. I had a good old search on Google for a while, and couldn't seem to find any easy way to do this, so I thought I'd write up how I ended up with the bubble in the screenshot. (Now I know how it's done however, the Google results seem a lot more knowledgeable on the subject - I was probably searching for the wrong things :-( ).

My first approach was to build a subclass of Overlay and override its draw() method, where I converted the View to a Drawable to draw it directly onto the MapView canvas (passed to draw() ). This worked, but naturally events would no longer work properly in the View if it contained things like buttons, so it was back to the drawing board.

Next, I tried subclassing [Dialog][4], and used a custom Dialog theme with my bubble background. The View I wanted was just injected into the Dialog through its [setContentView][5] method. This worked again, but I found myself fighting with the Dialog class a fair bit, and positioning it turned out to be a bit fiddly - there had to be a better way.

Finally I noticed that MapView inherits from the Android [ViewGroup][6], which means it can contain other Views. After a bit more probing, and a peek at the implementation of [android-mapviewballoons][7] (which is excellent, but didn't quite fit my purposes due to lack of custom balloon layouts) found a way to do it which should probably have been obvious from the outset!

The general approach is to add a new child View to the MapView, and then use the [MapView.LayoutParams][8] to position it. Here's a quick outline example if you're unfamiliar (the View I'm displaying has a [NinePatch][9] as the background attribute of a top level LinearLayout, which makes the bubble wrap the content):

This is in the initial activity setup - my balloon is re-used for all OverlayItems drawn on my map:

``` java
    //Reference to our MapView 
    MapView mapView = (MapView) activity.findViewById(R.id.mapview); 

    //Get a LayoutInflater and load up the view we want to display. 
    //The false in inflater.inflate prevents the bubble View being added to the MapView straight away 
    LayoutInflater inflater = activity.getLayoutInflater(); 
    LinearLayout bubble = (LinearLayout) inflater.inflate(R.layout.bubble, mapView, false); 

    //Set up the bubble's close button 
    ImageButton bubbleClose = (ImageButton) bubble.findViewById(R.id.bubbleclose);

    bubbleClose.setOnClickListener(new View.OnClickListener() {
        public void onClick(View v) {
            Animation fadeOut = AnimationUtils.loadAnimation(ResultsMapResultsDisplayer.this.activity, R.anim.fadeout);
            bubble.startAnimation(fadeOut);
            bubble.setVisibility(View.GONE);
        }
    });
```

This next part is the important bit, and actually positions the bubble on the MapView using MapView.LayoutParams. It's called by the onTap method of the ItemizedOverlay that contains my map markers:

``` java
    private void displaySearchResultBubble(final SearchResult result) {
    
        map.removeView(bubble);
        bubble.setVisibility(View.GONE);
    
        TextView venueName = (TextView) bubble.findViewById(R.id.venuename);
        venueName.setText(result.getName());
    
        TextView venueTime = (TextView) bubble.findViewById(R.id.venueopenfor);
        venueTime.setText("Open for " + result.getOpenFor() + "h");
    
        TextView venueFee = (TextView) bubble.findViewById(R.id.venuefee);
        venueFee.setText("Entry fee " + result.getPrice());
    
        MapView.LayoutParams params = new MapView.LayoutParams(
                LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT, 
                result.getPoint(), MapView.LayoutParams.BOTTOM_CENTER);
    
        bubble.setLayoutParams(params);
    
        map.addView(bubble);        
        map.measure(MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED), MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
    
        Runnable r = new Runnable() {
            public void run() {
                Animation fadeIn = AnimationUtils.loadAnimation(activity, R.anim.fadein);
                bubble.setVisibility(View.VISIBLE);
                bubble.startAnimation(fadeIn);
            }
        };
    
        Projection projection = map.getProjection();
    
        Point p = new Point();
        projection.toPixels(result.getPoint(), p);
    
        p.offset(0, -(bubble.getMeasuredHeight() / 2));
        GeoPoint target = projection.fromPixels(p.x, p.y);
    
    
        mapController.animateTo(target, r);
    
    }
```

That's it! It's a fairly quick example but feel free to let me know in the comments if you want any more detail.

 [1]: https://github.com/actionshrimp/lastorders/blob/master/lastorders-android/src/com/actionshrimp/android/lastorders/SearchMapResultsDisplayer.java
 [2]: /images/bubble-screen-cropped.png
 [3]: http://code.google.com/android/add-ons/google-apis/reference/com/google/android/maps/ItemizedOverlay.html
 [4]: http://developer.android.com/reference/android/app/Dialog.html
 [5]: http://developer.android.com/reference/android/app/Dialog.html#setContentView(int)
 [6]: http://developer.android.com/reference/android/view/ViewGroup.html
 [7]: https://github.com/jgilfelt/android-mapviewballoons
 [8]: http://code.google.com/android/add-ons/google-apis/reference/com/google/android/maps/MapView.LayoutParams.html
 [9]: http://developer.android.com/reference/android/graphics/NinePatch.html
