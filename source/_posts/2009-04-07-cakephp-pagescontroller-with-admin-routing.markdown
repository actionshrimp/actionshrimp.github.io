---
layout: post
title: "CakePHP: PagesController with Admin Routing"
date: 2009-04-07 08:44
comments: true
categories: CakePHP
---
*Note this page was first published in April 2009, so is likely to be quite out of date now.*

For small Cake websites with admin routing enabled, I like to use the Auth component to require a login for all admin routes, and allow access to everything else using the following beforeFilter in the AppController superclass:

    function beforeFilter(){
        $admin = Configure::read('Routing.admin'); 
        if (isset($this->params[$admin]) and $this->params[$admin]){
            $this->layout = 'admin';
        } else {
            $this->Auth->allow();
        }
    }

The problem with this however is static pages handled by the pages controller cannot be password protected. To resolve this problem, I had to overload the PagesController class that Cake comes with, and add in the required functionality. Part of the reason for doing this for me was to allow a setup where there was a password protected admin welcome page or control panel located at my\_app\_URL/admin, so I'll show you the necessary routing to achieve that too. 

<!--more-->

# Adding a route and overloading PagesController

First of all, copy your\_app\_dir/cake/libs/controller/pages\_controller.php into your\_app_dir/app/controllers with the rest of your application's controllers. Then fire up an editor and take a look at your newly copied version.  You'll see there is a function called display, this is what the pages controller uses to display pages. There is a route in app/config/routes.php that maps /pages/\* to /pages/display/\* to make the URL easier on the eyes, so if we're gonna have /admin/pages/\* working properly, we'll need a similar route.

Open up app/config/routes.php, and underneath the line

    Router::connect('/pages/*', array('controller' => 'pages', 'action' => 'display'));
    

add in the following route:

    Router::connect('/admin/pages/*', array('controller' => 'pages', 'action' => 'display', 'admin' => true));

Now, when admin routing is enabled, Cake looks for controller actions appened with "admin_", so we'd better add in the function to handle this in PagesController. Open it up, and underneath the display function, add the following:

    function admin_display() {
        $path = func_get_args(); 
        $temp = null;
        $count = count($path);
    
        if ($path[0] != 'admin') { 
            //This adds admin to the beginning of the path so the pages controller will look in the 'admin' folder in pages directory
            $path = array_merge((array)'admin', $path); 
        } else {
            //This removes admin from the beginning if it's there already, and sends the request round again so we end up with URLs 
            //that look like app/admin/pages/x when app/admin/pages/admin/x is requested somehow. 
            $path = array_slice($path, 1);
            $this->redirect(array_merge(array('controller' => 'pages', 'action' => 'display', 'admin' => true), $path));
        }
    
        if (!$count) { $this->redirect('/'); }
    
        $page = $subpage = $title = null;
    
        if (!empty($path[0])) {
            $page = $path[0];
        }
    
        if (!empty($path[1])) {
            $subpage = $path[1];
        }
    
        if (!empty($path[$count - 1])) {
            $title = Inflector::humanize($path[$count - 1]);
        }
    
        $this->set(compact('page', 'subpage', 'title'));
        $this->render(join('/', $path));
    }

As you can see it's fairly similar to the display function, with a few extra lines added in that handle admin pages. There are a few subtleties here which I will explain in a second. Before that however, we also require a slight change to the existing, non-admin display function. Look for the if statement below:

    if (!empty($path[0])) {
        $page = $path[0];
    }

and change it to:

    if (!empty($path[0])) {
        $page = $path[0];
        if ($page == 'admin') {
            //Sends admin page requests to their proper place to stop sneaky access attempts
            $this->redirect(array_merge(array('controller' => 'pages', 'action' => 'display', 'admin' => true), $path));
        }
    }

Ok so what have we done?

1.  The added nested if statement in the display() function redirects requests for /pages/admin/x to their proper place, /admin/pages/x.
2.  The 'else' clause of the if ($path[0] == 'admin') in admin_display redirects requests for /admin/pages/admin/x to /admin/pages/x, which just tidies up a URL aesthetics issue.
3.  Finally, the first part of the same if statement is what handles the /admin/pages/x requests proper - it adds the 'admin' part back to the beginning of the $path variable that point 2 removes. This is actually just exploiting a subtlety of the pages controller, 'subpages' (this seems to be quite hard to find in the documentation actually) - requests sent to /pages/a/b will display a page b stored in the folder your\_app\_dir/app/views/pages/a, rather than a page b stored in the pages root. Adding this additional logic helps organisation a bit by storing all admin pages in your\_app\_dir/app/views/pages/admin/.

So now this is all in place, everything should work correctly. Requests to /pages/admin/x and /admin/pages/admin/x both get sent to /admin/pages/x, and these require proper authentication. The final step is to add in a route that allows my original use for this whole setup to work properly - displaying an admin homepage or control panel that requires authentication when a user visits your\_app\_URL/admin, i.e. without referring to any controllers or actions. First, create a page in your\_app\_dir/app/views/pages/admin/, called home.ctp that contains the content you want. You can now access this from your\_app\_URL/admin/pages/home, but the shorter URL works after adding the route:

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'display', 'admin' => true, 'home'));

Hooray! We now have an admin homepage. Hope everything worked for you, hit me with a comment if you have an issues and I'll try and help out.
