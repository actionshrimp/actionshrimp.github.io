---
layout: post
title: "CakePHP Tutorial Part 1: Bake Utility"
date: 2009-03-28 17:04
comments: true
categories: CakePHP
---

<img class="alignleft size-full wp-image-130" src="http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/03/cake-logo.png" width="180" height="180" />A friend of mine recently asked me to help him build an online portfolio for his illustration pieces, and I decided to use <a href="http://cakephp.org/" target="_blank">CakePHP 1.2</a> to get the back end up and running quickly. I thought someone might find a tutorial taking a simple website through from start to finish useful, so this tutorial series will do just that. This part of the series takes you through the first few steps I took to get the basic code together.  You'll need a web server and database server such as MySQL, and some basic PHP and webserver management knowledge. We'll be using Cake's "bake" utility to create the basic code as well, so you'll need console access to your webserver, and PHP's command line utility (in Ubuntu/PHP5 you can just install the package php5-cli). 

<!--more-->

# Downloading and setting up CakePHP 

Create a new directory on your webserver where your cake website will reside (or just use the web root if this is going to be the main webpage).  Next, we'll need to actually download CakePHP.  If you have shell access to your webserver, you can use SVN to get the latest stable release automatically: navigate to the directory and use the command (note the "." at the end of the command) 

<pre>$ svn checkout https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/ .</pre> to do so.  If you don't know what any of this means, just download the latest stable release from the CakePHP website and extract the files into the directory you created - make sure the various .htaccess files don't go astray in the process. Some standard setup is also required: we need to tell cake how to connect to our database server, to do this follow the steps on [this page][1]. There's also a couple of optional (but recommended) configuration steps [here][2]. After this, you should be able to browse to the directory in a web browser and see the default page - there shouldn't be any errors or warnings if all configuration has been completed correctly (N.B. if the default page looks a bit plain - no colours, CSS styles etc., then you probably have a mod_rewrite issue, check out [this page][3]). Now we can begin work on the site. 

# Bake a cake 

Cake's bake utility is a handy way of generating the basic code structure for a web application, saving a lot of the tedious grunt work that often comes with setting up a new project. The general idea is often seen in frameworks that take advantage of the MVC (model-view-controller) design pattern (such as Ruby on Rails, and others). It involves creating a database structure that describes the various data entites - or "models" - of our application, then running a script that reads this structure and generates the framework code for the models. It can then generate standard interfaces (or "views") for displaying the data, and "controllers" which tie our interfaces and models together, allowing data to be input and manipulated. Of course, these standard pieces of generated code probably won't be exactly what we want, but they can provide a great starting point to work from and then tweak. First of all, we'll create our database structure. I'm using an empty database for this project, although if you're using a database with tables from other projects in, you can set Cake to work with a table prefix fairly easily. Let's get to work building the tables. The first model will be "News", containing data for a news section where the owner can post updates and information onto the site.  To represent this, I created a table "news", with four fields: 

*  **id** - type: int - extra: auto_increment - primary key *(A unique identifier for each record)*
*  **date** - type: date
*  **title** - type: text
*  **body** - type: text The next model is for representing finished works placed onto the site - the main part of the portfolio. Create a table called "works" with the four fields: 

*  **id** - type: int - extra: auto_increment - primary key
*  **date** - type: date
*  **title** - type: text
*  **desc** - type: text 

Next up, a sketches model. This is pretty much the same as "works" but will contain sketches as opposed to finished pieces. Create a table called "sketches" with the same four fields as above. 

[<img class="alignright size-medium wp-image-153" src="http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/03/screenshot-1-300x187.png" width="300" height="187" />][4] 

A friends model for a page that will contain links to websites belonging to friends of the owner, along with a thumbnail and description. Create the table "friends", with the fields: 

*   **id** - type: int - extra: auto_increment - primary key
*   **name** - type: text
*   **url** - type:  text
*   **desc** - type:  text 

There is one last model we'll need: "users". By creating a table with a username/password, we can let the owner login to manage the site, add new works, sketches and friends. Multiple users will mean we can also have a login to test out the site. So create the "users" table, with fields: 

*   **id** - type: int - extra: auto_increment - primary key
*   **username** - type: varchar(20)
*   **password** - type:  varchar(50)
*   **displayname** - type:  varchar(20) (Name shown when making posts etc - can be different from login name) Now all our tables are created, we can get to baking. In a console, navigate to yourdir/cake/console, and then run the command 

    $ ./cake bake

and you'll be presented with: 

<a href="http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/03/screenshot-2.png"><img class="alignright size-medium wp-image-154" src="http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/03/screenshot-2-300x187.png" width="300" height="187" /></a>

    Welcome to CakePHP v1.2.2.8120 Console
    ---------------------------------------------------------------
    App : app
    Path: /home/dave/public_html/kingjon/app
    ---------------------------------------------------------------
    Interactive Bake Shell
    ---------------------------------------------------------------
    [D]atabase Configuration
    [M]odel
    [V]iew
    [C]ontroller
    [P]roject
    [Q]uit
    What would you like to Bake? (D/M/V/C/P/Q)
    > 

at this point, if you haven't setup your database configuration yet, you can create it with the "[D]atabase Configuration" option. We'll be choosing the "[M]odel" option however: 

    > m
    ---------------------------------------------------------------
    Bake Model
    Path: /home/dave/public_html/kingjon/app/models/
    ---------------------------------------------------------------
    Possible Models based on your current database:
    1. Friend
    2. News
    3. Sketch
    4. User
    5. Work

    Enter a number from the list above, type in the name of another model, or 'q' to exit
    [q] >

notice our database tables have been read, and cake has automatically figured out that an entry in "works" will be a "Work", "sketches" give a "Sketch" and so on, but "news" is still "News".  We may as well start with the first entry, so enter 1, and hit enter. You'll be asked the following: 

    [q] > 1
    Would you like to supply validation criteria for the fields in your model? (y/n)
    [y] >

Cake has a set of predefined validation criteria to make sure that data entered for a model is correct. We may as well take advantage of these, so hit "y" and press return. Next Cake goes through each of the fields in our table, and asks what validation criteria we want for each. 

**id** is first, and I chose "blank" (number 3 in my case, athough I guess this number may change depending on which version of cake you're using). This ensures that no data is entered for the id, which is what we want as the field is auto generated by mySQL's auto_increment. For **name** I chose "Do not do any validation on this field" as the name can contain any text. For **url** I chose the rather fitting "url" (number 27) validation type. Finally, for **desc** I chose "Do not do any validation on this field" as well. A final couple of questions now pop up: model associations - for this I just hit "n" as our model is simple and has no relational properties - and a confirmation to check your settings are ok: 

    ---------------------------------------------------------------
    The following Model will be created:
    ---------------------------------------------------------------
    Name:       Friend
    Validation: Array
    (
        [id] => blank
        [url] => url
    )
    
    Associations:
    ---------------------------------------------------------------
    Look okay? (y/n)
    [y] >

Confirm this and there's a final question about SimpleTest and unit test files. This is to do with Cake's testing framework which I personally haven't tried, so just hit "n" here unless you feel like giving it a spin.  Congratulations, you've successfully baked your first model! Continue the process now, and bake the other models with appropriate validation criteria (I used "blank" for all the IDs, "date" for the date fields, and no validation for all the title/description fields - although for the users table, I chose "notEmpty" for the username, password and displayname fields as blank entries here would cause problems). Next up, time to bake some controllers. I'll show you the output from my run through first including the options I chose, and explain to you afterwards what some of them mean and why I chose them: 

    What would you like to Bake? (D/M/V/C/P/Q)
    > c
    ---------------------------------------------------------------
    Bake Controller
    Path: /home/dave/public_html/kingjon/app/controllers/
    ---------------------------------------------------------------
    Possible Controllers based on your current database:
    1. Friends
    2. News
    3. Sketches
    4. Users
    5. Works
    Enter a number from the list above, type in the name of another controller, or 'q' to exit
    [q] > 1
    ---------------------------------------------------------------
    Baking FriendsController
    ---------------------------------------------------------------
    Would you like to build your controller interactively? (y/n)
    [y] > y
    Would you like to use scaffolding? (y/n)
    [n] > n
    Would you like to include some basic class methods (index(), add(), view(), edit())? (y/n)
    [n] > y
    Would you like to create the methods for admin routing? (y/n)
    [n] > y
    Would you like this controller to use other helpers besides HtmlHelper and FormHelper? (y/n)
    [n] > n
    Would you like this controller to use any components? (y/n)
    [n] > n
    Would you like to use Sessions? (y/n)
    [y] > y
    You need to enable Configure::write('Routing.admin','admin') in /app/config/core.php to use admin routing.
    What would you like the admin route to be?
    Example: www.example.com/admin/controller
    What would you like the admin route to be?
    [admin] > 
    
    ---------------------------------------------------------------
    The following controller will be created:
    ---------------------------------------------------------------
    Controller Name:  Friends
    ---------------------------------------------------------------
    Look okay? (y/n)
    [y] >
    
    Creating file /home/dave/public_html/kingjon/app/controllers/friends_controller.php
    Wrote /home/dave/public_html/kingjon/app/controllers/friends_controller.php
    SimpleTest is not installed.  Do you want to bake unit test files anyway? (y/n)
    [y] > n

Ok, I started by building the controller for the friends section again. Building interactively gives you access to more options in the setup, so I went for that.

[Scaffolding][5] is basically a flag you set in your controller telling cake that you want basic skeleton app behaviour to be created at runtime. By baking we are given the advantage of pre-generating code that does more or less the same thing, but that we can also edit later, so choosing "n" for scaffolding is a wise plan in our case. The next question about basic methods is where our pre-generated skeleton code comes from, so choose "y" here. Admin routing creates an admin section for adding/deleting/modifying records. As we don't want visitors to the website to be able to do this, but the portfolio owner will be wanting to do this, an admin section is a good idea, so "y" to this question as well. We are now asked about [helpers][6]. Helpers are libraries built into cake that add functionality and generally make your life easier. At the minute we'll just use the default two, so choose "n", although more can be added later easily if we need them. Next up are [components][7] which are similar to helpers, although these are more at a behind-the-scenes level, and helpers are used more for displaying and formatting data on the interface side of things. Again we may use some of these later, but at the minute just hit "n" for components. Finally hit "y" for sessions, and I agreed to the default name for the admin section, "admin", although you may wish to change this.  Hit "y" for the confirmation, and then "n" for the testing question again. Repeat this for the other controllers. Finally we have to make some views, so here we go again, although this step is a lot quicker. Choose "[V]iew" from the main menu, and I'm starting off with Friends again. The first question it asks is seemly about the scaffolding again: 

    Would you like to create some scaffolded views (index, add, view, edit) for this controller?
    NOTE: Before doing so, you'll need to create your controller and model classes (including associated models). (y/n)
    [n] > y

Before we wanted nothing to do with scaffolding, but here we hit "y": this generates the views for the basic class methods we agreed to in the controller generation. We're then asked about admin routing views, and we press "y" again, and the script tells us it's generated the files we need. Repeat this process for the other views, and then we're done with baking. 

# Let's see what we've done so far...

[<img class="alignleft size-medium wp-image-143" src="http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/03/screenshot-300x187.png" width="300" height="187" />][8] Now what exactly has all that baking achieved? If you go to the index page of your app directory in the web browser, you'll just be greeted with the same welcome page. But try navigating to your\_app\_folder/news or your\_app\_folder/works and a new page comes up. You can give adding a piece of a news a go with the "New News" link on the news page. A form pops up letting you fill in the date, title and post body, and you'll notice the entry form lets you fill in the date correctly and so on.  We aren't prompted to enter an ID because our validation criteria said we wanted this to be blank as it would be generated automatically. Once the post has been added, an entry comes up on the main page, letting us view the individual post, edit it or delete it. In fact, if you've been keeping an eye on the URLs, you'll have noticed that they take the form your\_app\_folder/controller/action. The actions were generated automatically by our baking process, and we'll take a look at them in a bit more detail later on. You'll notice you can also go to your\_app\_folder/admin/news to get the same page - this is our admin routing. At the minute there is no difference between the two sections, but we'll edit it so that you wont be able to add/edit/delete thing unless you're in the admin section, and logged in correctly. As you can see, baking has set up all the basic logic for our various sections, we just need to tweak it and glue it together a bit, and I'll deal with that in the [next part of the tutorial][9].

 [1]: http://book.cakephp.org/view/331/Cake-Database-Configuration
 [2]: http://book.cakephp.org/view/332/Optional-Configuration
 [3]: http://book.cakephp.org/view/333/A-Note-on-mod_rewrite
 [4]: http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/03/screenshot-1.png
 [5]: http://book.cakephp.org/view/105/Scaffolding
 [6]: http://book.cakephp.org/view/181/Core-Helpers
 [7]: http://book.cakephp.org/view/170/Core-Components
 [8]: http://www.actionshrimp.com/wordpress/wp-content/uploads/2009/03/screenshot.png
 [9]: http://www.actionshrimp.com/2009/03/cakephp-tutorial-part-2-authentication/
