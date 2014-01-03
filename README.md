AGhast
=========

This is the code for an admin app for your [Ghost blog](http://ghost.org).

![Screenshots](https://raw.github.com/Litterfeldt/Ghost-app/master/screenshots/android/collage.jpg)

What does it bring to the table?
-------------
At the moment it's not more than just an interface to the admin-website but brings some nice features. The most prominent one is the no-clutter-interface as it does not show any web-browser related graphics. Also it's fast, really fast.

App(?) for what platform?
-------------
The app(s) is(are) written in Javascript with the [PhoneGap](http://phonegap.com/) framework. This makes them portable in a write-once-deploy-to-all sort of manner. This app will run equally great on android as on iOS and Wp8 and even on Blackberry. 

That sounds great, lets go! 
-------------
That being said it has only been tested on Android, as that is the only device family I currently own. 
If you want to try it out for yourself there is a ready-built .apk in the build directory. 

As for iOS and other platforms I turn to the open source comunity to test and deploy it to appstores all over the world and keep those up to sync with this repo. Also, please link to this github page if you do distribute so that people can contribute if the want and have the know-how.

Right, so how do I build it again?
-------------
That's another thing. You will want to install [PhoneGap](http://phonegap.com/) to do so, then have the SDK of the platform you are targeting. Then it's just a matter of ```$phonegap build platform``` where ```platform``` could be android, ios, blackberry, etc.

This will generate a binary in the ```/platforms``` folder and you then follow any standard way your platform has to get the binary on to the device.

> Don't use build.phonegap.com to build your apps it has a huge discrepency between apps that you build there and apps in which you use the ```$phonegap``` binary to build. I think it has something to do with the cordova core they used to build PhoneGap and how it's not integrated properly on the website vs in the actual binary.  

Great! Any bugs so far?
------------
Just one, but is a total showstopper and it's not exclusive for the app as it persists in the standard browser of all android devices I've tested this app on. You can't edit or write posts. The field with the markdown is not editable. This is a bug in the standard webkit-lib of android as it works fine in the Chrome app. I have comunicated the issue to the [Ghost blog](http://ghost.org) team and hope that this will be fixed in future versions of android or by them. 
