cordova-plugin-statusbar
============================
 
Enable or disable Android 4.4's translucent statusbar.

Plugin for Cordova >= 3.0

#### Installation

For Cordova:

	cordova plugin add git@github.com:ekuwang/cordova-plugin-statusbar.git

#### Using the plugin

To enable translucent statusbar:

	statusbarTransparent.enable();
	
To disable translucent statusbar:

	statusbarTransparent.disable();
	
To toggle current state:

	statusbarTransparent.toggle(); 