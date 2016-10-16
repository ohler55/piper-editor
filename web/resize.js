// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

function resizeWork() {
    var work = document.getElementById("work");

    work.style.height = window.innerHeight-work.offsetTop;

    var d = document.getElementById("diagram");

    d.width = dwidth * dscale;
    d.height = dheight * dscale;
    
    var ds = document.getElementById("dshell");
    var vr = document.getElementById("vrule");
    var hr = document.getElementById("hrule");
    var f = document.getElementById("foot");
    var fl = document.getElementById("flist");
    var fs = document.getElementById("fshell");
    var p = document.getElementById("props");

    ds.style.left = fl.clientWidth + fl.clientLeft + 18;
    p.style.left = work.clientWidth - p.clientWidth - 2;

    var h = work.clientHeight - ds.offsetTop+work.clientTop;
    var w = work.clientWidth - ds.offsetLeft+work.clientLeft - p.clientWidth - 2;

    fs.style.height = h - 2;
    f.style.top = h - 11;
    f.style.left = fs.clientLeft + fs.clientWidth;
    f.style.width = ds.clientWidth - fs.clientWidth - 55;
    f.style.width = w + 18;
    vr.height = h - 28;
    vr.style.left = fl.clientWidth + fl.clientLeft + 1;
    hr.width = w;
    hr.style.left = fl.clientWidth + fl.clientLeft + 17;
    ds.style.left = fl.clientWidth + fl.clientLeft + 18;
    ds.style.top = 17;
    ds.style.height = h - 28;
    ds.style.width = w;

    drawRulers();
    drawDiagram();
}

function showhide() {
    if (0 < loadedFlows.length) {
        var fl = document.getElementById("flist");

        if (0 < fl.clientWidth) {
	    fl.style.width = 0;
        } else {
	    fl.style.width = 200;
        }
        resizeWork();
    }
}

function showhideprops() {
    var p = document.getElementById("props");

    if (0 < p.clientWidth) {
	p.style.width = 0;
    } else {
	p.style.width = 200;
    }
    resizeWork();
}

document.getElementById('showhide_flist').onclick = showhide;
document.getElementById('showhide_props').onclick = showhideprops;

resizeWork();
