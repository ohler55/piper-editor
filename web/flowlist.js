// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

var loadedFlows = [];

function getFlows() {
    var h = new XMLHttpRequest();
    h.onload = function() {
	if (200 == h.status) {
	    loadedFlows = JSON.parse(h.responseText);
	} else {
	    loadedFlows = [];
	}
	drawFlowList();
    };
    h.open("GET", "/flow", true);
    h.send();
}

function displayLoadedFlow(id) {
    var i, f;

    for (i = loadedFlows.length - 1; 0 <= i; i--) {
	f = loadedFlows[i];
	if (id == f.id) {
	    setJsonFlow(JSON.parse(JSON.stringify(f)))
	    break;
	}
    }
}

function drawFlowList() {
    var fs = document.getElementById('fshell');
    while (fs.firstChild) {
	fs.removeChild(fs.firstChild);
    }
    if (!loadedFlows) {
	return;
    }

    var i, f, d;

    loadedFlows.sort(function(f0, f1) { return (f0.id > f1.id ? -1 : (f0.id < f1.id ? 1 : 0)) });
    for (i = loadedFlows.length - 1; 0 <= i; i--) {
	f = loadedFlows[i];
	d = document.createElement('div');
	d.innerHTML=f.id;
	d.className = "flowitem";
	d.onclick = function() {
	    displayLoadedFlow(this.innerHTML);
	}
	fs.appendChild(d);
    }
}

getFlows();
