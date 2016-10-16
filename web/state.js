// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

var downX = -1, downY = -1;
var origX = -1, origY = -1;
var selBut = -1;
var selTask = null;
var selLink = null;
var selLinkName = '';
var selLinkPath = [];

var activeTool = 'ptr';
var snapTo = true

var dscale = 1.0
var dwidth = 1000
var dheight = 1000
var dflow = null;

function unSelect() {
    var changed = (null != selTask);
    selTask = null;
    selBut = 0;
    selLink = null;
    selLinkName = '';
    selLinkPath = [];
    return changed;
}
