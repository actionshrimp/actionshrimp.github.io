---
layout: post
title: "CakePHP Tutorial Part 2: Authentication and Tweaking"
date: 2009-03-31 08:02
comments: true
categories: CakePHP
---
<img class="alignleft size-full wp-image-252" src="/images/cake-logo1.png" width="180" height="180" /> In the [first part of my CakePHP tutorial][2], I showed you how to use Cake's Bake utility to set up the basic back end of an online illustration portfolio. In this part, I'll tweak the automatically generated code into useable website and admin section and show you how to use some of Cake's features along the way, including the Authentication component. 

If you followed the first part of the tutorial, we currently have a few sections that we've generated models, controllers and views for. By navigating to your\_app/controllername/action in your browser, you can access the different functions of the application. But unless your users know this in advance, they have no way of accessing them. 

<!--more-->

# Joining the sections together 

The easiest way of implementing navigation common to all pages is to use Cake's built in templating system, the page "layout". Cake uses its built-in layout if it finds no user defined layout default available. To add one, create the file your\_app_dir/app/views/layouts/default.ctp, and put in your basic page layout. Mine looked like this: 

``` html
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title><?php echo $title_for_layout ?></title>
            <link href="favicon.ico" type="image/x-icon" rel="shortcut icon" />
            <?php echo $html->css('default') ?>
            <?php echo $scripts_for_layout ?>
        </head>
        <body>
            <div id="container">
                <div id="header">
                     <h1>King-Jon Illustration</h1>
                </div>
                <div id="navigation">
                    <ul>
                        <li><?php echo $html->link('News', array('controller'=>'News'))?></li>
                        <li><?php echo $html->link('Works', array('controller'=>'Works'))?></li>
                        <li><?php echo $html->link('Sketches', array('controller'=>'Sketches'))?></li>
                        <li><?php echo $html->link('Friends', array('controller'=>'Friends'))?></li>
                    </ul>
                </div>
                <div id="content">
                    <?php echo $content_for_layout ?>
                </div>
                <div id="footer">
                </div>
            </div>
        </body>
    </html>
```

You'll notice this looks like a pretty normal basic page skeleton, with a few extra bits of PHP inserted. The $title\_for\_layout, $scripts\_for\_layout and $content\_for\_layout variables are filled in by Cake automatically depending on what the current page request is and the title and content are fairly self-explanitory.  The scripts variable lets you specify scripts on a per-page basis but still include them in the `<head>` section. The `$html->xxx` code snippets are part of the [Cake HtmlHelper][3]. This allows you to insert well formatted elements easily - the `$html->css('default')` includes the stylesheet "css/default.css" (this is stored in the your\_app\_dir/app/webroot/css directory), and the `$html->link` lines let you point to different parts of your app easily. You could just add normal links, such as `<a href="/news/">`, but pointing to the controller allows a bit of flexibility if you want to change anything further down the line. 

# Adding a splash page 

As it was an art portfolio website, the owner decided a splash page would be useful, to give a good first impact when entering the site and the ability to show off a bit of artwork right away. Cake uses its built-in pages controller to handle static pages, and the different pages are stored in the folder your\_app\_dir/app/views/pages. To view a page, you navigate to the URL your\_app/pages/pagename. Here, the pages controller doesn't take an action, so the additional directory level on the URL is an argument passed to the controller, in this case the name of the page to display. Cake also automatically serves up a default page, called "home", when a user requests the root of your\_app. The name of this page is set by Cake's router, and if we look in your\_app\_dir/app/config/routes.php, we see at the bottom, the lines: 

``` php
    <?
    /**
    * Here, we are connecting '/' (base path) to controller called 'Pages',
    * its action called 'display', and we pass a param to select the view file
    * to use (in this case, /app/views/pages/home.ctp)...
    */
    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));
    /**
    * ...and connect the rest of 'Pages' controller's urls.
    */
    Router::connect('/pages/*', array('controller' => 'pages', 'action' => 'display'));
    ?>
```

The comments tell us what's going on - this is what maps the pages to the locations I have talked about. You can add your own mappings here too if you like.  For our splash screen however, we can just make use of the already defined "home" page, so edit this to make it look how you want, you'll find it in your\_app\_dir/app/views/pages/home.ctp. Mine looked like this: 

``` php
    <?php $this->layout = "splash" ?>
    <div id="splash">
        <?php echo $html->image("splash.png",
            array("alt" => "King Jon Illustration",
            "url" => array("controller" => "news")));
        ?>
    </div>
```

A couple of things to note here. The first line `$this->layout = "splash"`, tells Cake not to use the "default" layout we created earlier, but to instead use one called "splash". I sneakily created a splash layout without telling you here, but it is in fact just an exact copy of the default layout with the navigation div removed, to give the page a more "splashy" feel. Next, I used the image HtmlHelper to include an image called "splash.png" - this is located in my\_app\_dir/app/webroot/img, the location the image helper looks in. The second argument is an array of additional attributes, "alt" being the alt text, and "url" puts an <a> element around the image, creating a link to the specified address. 

# Admin section authentication

[<img class="alignleft size-medium wp-image-251" src="/images/authentic-screen-300x187.png" width="300" height="187" />][4] At the minute, all our sections are wide open for anyone to just stroll in and start adding news, posting works, and generally delete or edit existing pieces of data. This clearly isn't ideal, so next on the agenda is sorting this out. We'll use the [authentication component][5] for this. First of all, we want all add/edit capabilities to be kept within the admin section, so the first step is to remove the non-admin versions of these. Go through all five of the your\_app\_dir/app/controllers/\*\_controller.php, and delete the functions "add" and "edit" that were automatically generated. 

Next, clean up the views associated with these functions - delete the two files your\_app\_dir/app/views/\*/add.ctp and edit.ctp in all five of the view directories. This means now we can only add and edit our data by navigating to your\_app/**admin**/controller/add etc. We're going to want to use authentication for all our controllers, as all of them have an admin section that we need to login for. Instead of telling each controller to use this component individually, we can tell the whole controller superclass that we want to use it, to save repetition. Open the file your\_app\_dir/app/app_controller.php and add the line in the class definition like so: 

``` php
    <?
    class AppController extends Controller {
        var $components = array('Auth');
    }
    ?>
```

Now if you try and visit an admin page in your\_app, you'll be greeted with an error messages telling you there's no login action in the Users controller, which is where the Auth component looks by default, so we'd better add this in. Edit the file your\_app\_dir/app/controllers/users\_controller.php, and right at the bottom of the class definition, add these two functions: 

``` php
    <?
    function admin_login() {
    }
    function admin_logout() {
        $this->Redirect($this->Auth->logout());
    }
    ?>
```

Now try and navigate to an admin section again. You're told that there's a missing view this time! Better do what Cake says and add one in. Create the new file your\_app\_dir/app/views/users/admin_login.ctp, and fill it with the following skeleton login form: 

``` php
    <?php
        if  ($session->check('Message.auth')) $session->flash('auth');
        echo $form->create('User', array('action' => 'admin_login'));
        echo $form->input('username');
        echo $form->input('password');
        echo $form->end('Login');
    ?>
```

Now there are two problems: we're greeted with a login for all the admin sections - a slight problem as we don't have credentials... we've locked ourselves out of the whole website! There are also some error messages when we try and view the non-admin sections of the site, which seem to want us to login but can't find a login() action (remember we only created admin\_login, and didnt bother with login). Fortunately, we can get around these problems by adding exceptions to the authentication. Open up the users controller, your\_app\_dir/app/controllers/users\_controller.php, and then add in the following [controller callback function][6] (I added it in near the top): 


``` php
    <?
    function beforeFilter() {
        $this->Auth->allow('admin_add', 'admin_index');
    }
    ?>
```

This gives access to the admin add and index (which lists all users) actions of the users controller. So now, navigate to your\_app/admin/users/add, and create a login for yourself! You'll probably want to remove the allow line once you've added yourself to prevent anyone else creating a login for themselves when you're not looking. We're still however stuck with the problem that none of the non-admin sections work, so we need to add an Auth exception to all non-admin sections. The best way to do this is by adding the following into the your\_app\_dir/app/app\_controller.php AppController class definition, underneath where we told it to load the Auth component earlier: 

``` php
    <?
    function beforeFilter() {
        $admin = Configure::read('Routing.admin');
        if (isset($this->params[$admin]) and $this->params[$admin]){
            //$this->layout = 'admin';
        } else {
            $this->Auth->allow();
        }
    }
    ?>
```

Now we should be able to navigate the site without any problems. The commented out line above allows the future addition of an admin.ctp layout file that will automatically be loaded when viewing admin sections - I haven't done this yet though. The next phase of the project is to go through and edit all the views, layouts & CSS and get them looking how you want, and this is largely an exercise in usual web development - you can take a look at the default views to see how to include data provided by Cake fairly easily. If I come across anything else I think might be of help while I'm building the rest of the site, I'll make small posts for those too. Hopefully you've been able to follow this introduction to Cake so far, but if not drop me a line in the comments below and I'll try and give you a hand where I can. Good luck!

 [2]: http://www.actionshrimp.com/2009/03/cakephp-tutorial-part-1-bake-utility/
 [3]: http://book.cakephp.org/view/206/Inserting-Well-Formatted-elements
 [4]: /images/authentic-screen.png
 [5]: http://book.cakephp.org/view/172/Authentication
 [6]: http://book.cakephp.org/view/60/Callbacks
