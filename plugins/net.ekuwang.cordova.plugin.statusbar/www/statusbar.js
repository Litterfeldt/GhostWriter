function StatusbarTransparent () {
	this.transparentFlag = false;
};

/*
* Enable translucent statusbar
*/
StatusbarTransparent.prototype.enable = function (success, fail) {
	if (this.transparentFlag == false) {
		this.transparentFlag = true;
		cordova.exec(success ? success : null, fail ? fail : null, 'StatusbarTransparent', 'enable', []);
	}
};

/*
* Disable translucent statusbar
*/
StatusbarTransparent.prototype.disable = function (success, fail) {
	if (this.transparentFlag == true) {
		this.transparentFlag = false;
		cordova.exec(success ? success : null, fail ? fail : null, 'StatusbarTransparent', 'disable', []);
	}
}

/*
*	Toggle the translucent statusbar
*/
StatusbarTransparent.prototype.toggle = function (success, fail) {
	if (this.transparentFlag == true) {
		this.disable(success, fail);
	} else {
		this.enable(success, fail);
	}
};

module.exports = new StatusbarTransparent();