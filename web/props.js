// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

var options = ['subject_prop','count_prop','box_prop','srules_prop','path_prop','args_prop','timeout_prop','addr_prop','method_prop','initial_prop','xrules_prop'];
var option_attrs = ['subject','count','box_resolve','rules','path','args','timeout','addr','method','initial'];

function actorChanged() {
    document.getElementById('task_props').style.display = 'none';
    for (var i=options.length-1; 0<=i; i--) {
	document.getElementById(options[i]).style.display = 'none';
    }
    if (null == selTask) {
	document.getElementById('link_props').style.display = 'none';
	return;
    }
    if (null != selLink){
	document.getElementById('link_props').style.display = 'block';
	return;
    }
    var t = selTask;
    document.getElementById('task_props').style.display = 'block';
    var a = document.getElementById('actor');
    if (undefined == a) {
	return;
    } else if ('nats_publish' === a.value) {
	document.getElementById('subject_prop').style.display = 'block';
	document.getElementById('subject').value = t.subject;
    } else if ('join' === a.value) {
	document.getElementById('count_prop').style.display = 'block';
	document.getElementById('count').value = t.count;
	document.getElementById('box_prop').style.display = 'block';
	document.getElementById('box_resolve').value = t.box_resolve;
    } else if ('switch' === a.value) {
	document.getElementById('srules_prop').style.display = 'block';
	document.getElementById('srules').value = JSON.stringify(t.rules);
    } else if ('spawn' === a.value) {
	document.getElementById('path_prop').style.display = 'block';
	document.getElementById('path').value = t.path;
	document.getElementById('args_prop').style.display = 'block';
	document.getElementById('args').value = JSON.stringify(t.args);
	document.getElementById('timeout_prop').style.display = 'block';
	document.getElementById('timeout').value = t.timeout;
    } else if ('remote' === a.value) {
	document.getElementById('addr_prop').style.display = 'block';
	document.getElementById('addr').value = t.addr;
    } else if ('http' === a.value) {
	document.getElementById('addr_prop').style.display = 'block';
	document.getElementById('addr').value = t.addr;
	document.getElementById('method_prop').style.display = 'block';
	document.getElementById('method').value = t.method;
    } else if ('transform' === a.value) {
	document.getElementById('initial_prop').style.display = 'block';
	document.getElementById('initial').value = JSON.stringify(t.initial);
	document.getElementById('xrules_prop').style.display = 'block';
	document.getElementById('xrules').value = JSON.stringify(t.rules);
    }
}

function pathToJson(path){
    var j = '';
    if (undefined != path){
	j += '[';
	var p,plen = path.length;
	for (var i = 0; i < plen; i++) {
	    p = path[i]
	    if (0 < i){
		j += ',';
	    }
	    j += '\n  [' + p[0] + ',' + p[1] + ']';
	}
	if (0 < plen){
	    j += '\n';
	}
	j += ']';
    }
    return j;
}

function updateProps(){
    if (null == selTask){
	document.getElementById('propname').value = '';
	document.getElementById('actor').value = '';
	document.getElementById('top').value = '';
	document.getElementById('left').value = '';
	document.getElementById('height').value = '';
	document.getElementById('width').value = '';
	document.getElementById('color').value = '';
	document.getElementById('trace').checked = false;
	document.getElementById('entry').checked = false;
	document.getElementById('linkname').value = '';
	document.getElementById('task_props').style.display = 'none';
	document.getElementById('link_props').style.display = 'none';
    } else if (null == selLink){
	var t=selTask;
	document.getElementById('task_props').style.display = 'block';
	document.getElementById('link_props').style.display = 'none';
	document.getElementById('propname').value = t.name;
	document.getElementById('actor').value = t.actor;
	var g = t.graphic;
	var c = '#ffffff';
	
	if ('string' === typeof g.color) {
	    c = g.color;
	} else if ('number' === typeof g.color) {
	    c ='#'+(0x1000000 + g.color).toString(16).substr(1);
	}
	document.getElementById('top').value = g.top;
	document.getElementById('left').value = g.left;
	document.getElementById('height').value = g.height;
	document.getElementById('width').value = g.width;
	document.getElementById('color').value = c;
	document.getElementById('trace').checked = t.trace;
	document.getElementById('entry').checked = (selTask.name == dflow.entry);
	document.getElementById('linkname').value = '';
    } else {
	document.getElementById('task_props').style.display = 'none';
	document.getElementById('link_props').style.display = 'block';
	var targ, t2 = dflow.tasks[selLink.target];
	document.getElementById('linkpath').value = pathToJson(selLink.path);
	if (undefined != t2 && null != t2) {
	    targ = t2.name;
	}
	document.getElementById('linkname').value = selLinkName;
	document.getElementById('target').value = targ;
    }
    actorChanged();
}

function flowChanged() {
    if (null != dflow) {
	if (true != dflow.changed) {
	    dflow.changed = true;
	    document.getElementById('titlelabel').innerHTML = '*Title:';
	}
	drawDiagram();
    }
}

function nameMod(){
    if (null != selTask) {
	var name = document.getElementById('propname').value;
	delete dflow.tasks[selTask.name];
	selTask.name = name;
	dflow.tasks[name] = selTask;
	flowChanged();
    }
}

function actorReset(t){
    for (var i=option_attrs.length-1; 0<=i; i--) {
	delete t[option_attrs[i]];
    }
}

function actorMod(){
    var a = document.getElementById('actor');
    
    if (null == selTask) {
	a.value = '';
	return;
    }
    var t = selTask;
    if ('nats_publish' === a.value) {
	actorReset(t)
	t.subject = '';
	t.actor = a.value;
    } else if ('join' === a.value) {
	actorReset(t)
	t.count = 1;
	t.box_resolve = 'merge';
	t.actor = a.value;
    } else if ('switch' === a.value) {
	actorReset(t)
	t.rules= [];
	t.actor = a.value;
    } else if ('spawn' === a.value) {
	actorReset(t)
	t.path = '.';
	t.args = [];
	t.timeout = 1.0;
	t.actor = a.value;
    } else if ('remote' === a.value) {
	actorReset(t)
	t.addr = 'localhost';
	t.actor = a.value;
    } else if ('http' === a.value) {
	actorReset(t)
	t.addr = 'localhost';
	t.method = 'post';
	t.actor = a.value;
    } else if ('transform' === a.value) {
	actorReset(t)
	t.initial = null;
	t.rules = [];
	t.actor = a.value;
    } else if ('async' === a.value ||
	       'cache' === a.value ||
	       'chglog' === a.value ||
	       'split' === a.value) {
	actorReset(t)
	t.actor = a.value;
    } else {
	a.value = t.actor;
	return;
    }
    actorChanged()
    flowChanged();
}

function getFloat(id, old){
    var num = parseFloat(document.getElementById(id).value);
    if (isNaN(num) || 0 > num) {
	document.getElementById(id).value = old.toString();
	num = old;
    } else {
	document.getElementById(id).value = num.toString();
    }
    return num;
}

function topMod(){
    if (null != selTask) {
	var num = getFloat('top', selTask.graphic.top);
	if (num != selTask.graphic.top) {
	    selTask.graphic.top = num;
	    updateDims();
	    flowChanged();
	}
    }
}

function leftMod(){
    if (null != selTask) {
	var num = getFloat('left', selTask.graphic.left);
	if (num != selTask.graphic.left) {
	    selTask.graphic.left = num;
	    updateDims();
	    flowChanged();
	}
    }
}

function widthMod(){
    if (null != selTask) {
	var num = getFloat('width', selTask.graphic.width);
	if (num != selTask.graphic.width) {
	    selTask.graphic.width = num;
	    updateDims();
	    flowChanged();
	}
    }
}

function heightMod(){
    if (null != selTask) {
	var num = getFloat('height', selTask.graphic.height);
	if (num != selTask.graphic.height) {
	    selTask.graphic.height = num;
	    updateDims();
	    flowChanged();
	}
    }
}

function colorMod(){
    if (null != selTask) {
	var cs = document.getElementById('color').value;
	selTask.graphic.color = cs;
	flowChanged();
    }
}

function traceMod(){
    if (null != selTask) {
	selTask.trace = document.getElementById('trace').checked;
	flowChanged();
    }
}

function entryMod(){
    if (null != selTask) {
        if (document.getElementById('entry').checked) {
	    dflow.entry = selTask.name;
        } else {
            // Allow for since flows with trigger tasks have no entry.
            dflow.entry = '';
        }
	flowChanged();
    }
}

function subjectMod(){
    if (null != selTask) {
	selTask.subject = document.getElementById('subject').value;
	flowChanged();
    }
}

function countMod(){
    if (null != selTask) {
	var e = document.getElementById('count');
	var num = parseInt(e.value);
	if (isNaN(num) || 1 > num) {
	    e.value = old.toString();
	    num = selTask.count;
	} else {
	    e.value = num.toString();
	    selTask.count = num;
	    flowChanged();
	}
    }
}

function boxMod(){
    if (null != selTask) {
	selTask.box = document.getElementById('box_resolve').value;
	flowChanged();
    }
}

function srulesMod(){
    if (null != selTask) {
	var e = document.getElementById('srules');
	try {
	    var r = JSON.parse(e.value);
	    // TBD validate the rules
	    selTask.rules = r;
	    e.value = JSON.stringify(selTask.rules)
	    flowChanged();
	} catch (x) {
	    e.value = JSON.stringify(selTask.rules)
	}
    }
}

function pathMod(){
    if (null != selTask) {
	var p = document.getElementById('path').value;
	// TBD validate path
	selTask.path = p;
	flowChanged();
    }
}

function argsMod(){
    if (null != selTask) {
	var a = document.getElementById('args').value;
	// TBD validate args
	selTask.args = a;
	flowChanged();
    }
}

function timeoutMod(){
    if (null != selTask) {
	var num = getFloat('timeout', selTask.timeout);
	if (num != selTask.timeout) {
	    selTask.timeout = num;
	    flowChanged();
	}
    }
}

function addrMod(){
    if (null != selTask) {
	var a = document.getElementById('addr').value;
	// TBD validate address
	selTask.addr = a;
	flowChanged();
    }
}

function methodMod(){
    if (null != selTask) {
	selTask.method = document.getElementById('method').value;
	flowChanged();
    }
}

function initialMod(){
    if (null != selTask) {
	var e = document.getElementById('initial');
	try {
	    selTask.initial = JSON.parse(e.value);
	    e.value = JSON.stringify(selTask.initial)
	    flowChanged();
	} catch (x) {
	    e.value = JSON.stringify(selTask.initial)
	}
    }
}

function xrulesMod(){
    if (null != selTask) {
	var e = document.getElementById('xrules');
	try {
	    var r = JSON.parse(e.value);
	    // TBD validate rules
	    selTask.rules = r;
	    e.value = JSON.stringify(selTask.rules)
	    flowChanged();
	} catch (x) {
	    e.value = JSON.stringify(selTask.rules)
	}
    }
}

function removeTaskDown(){
    document.getElementById('removetask').className = 'removebutton-down';
}
function removeTaskLeave(){
    document.getElementById('removetask').className = 'removebutton';
}

function removeTaskUp(){
    document.getElementById('removetask').className = 'removebutton';
    if (null == selTask || null == dflow || undefined == dflow.tasks) {
	return;
    }
    delete dflow.tasks[selTask.name];
    Object.keys(dflow.tasks).forEach(function(k,i) {
	var t2 = dflow.tasks[k];
	if (undefined == t2.links || null == t2.links) {
	    return;
	}
	Object.keys(t2.links).forEach(function(lk, j) {
	    var link = t2.links[lk];
	    if (selTask.name == link.target) {
		delete t2.links[lk];
	    }
	});
    });
    updateProps(null);
    flowChanged();
}

function linknameMod(){
    if (null != selTask && null != selLink) {
	var name = document.getElementById('linkname').value;

	if (null != selTask.links[name]) {
	    document.getElementById('linkname').value = selLinkName;
	    return;
	}
	delete selTask.links[selLinkName];
	selTask.links[name] = selLink;
	selLinkName = name;
	flowChanged();
    }
}

function linkpathMod(){
    if (null != selTask && null != selLink) {
	var s = document.getElementById('linkpath').value;
	if ('' == s){
	    selLink.path = [];
	    updateDims();
	    flowChanged();
	    return;
	}
	try {
	    var pts = JSON.parse(s);
	    if (!(pts instanceof Array)){
		throw 'bad';
	    }
	    pts.forEach(function(p,z,a) {
		if (!(p instanceof Array) || 2 != p.length || p[0] < 0 || p[1] < 0){
		    throw 'bad';
		}
	    });
	    selLink.path = pts;
	    updateDims();
	    flowChanged();
	} catch (x) {
	    document.getElementById('linkpath').value = pathToJson(selLink.path);
	}
    }
}

function targetMod(){
    if (null != selTask && null != selLink) {
	var target = document.getElementById('target').value;
	var tt = selTask.links[target];
	if (null == tt) {
	    document.getElementById('target').value = selLink.target;
	    return;
	}
	selLink.target = target;
	flowChanged();
    }
}

function removeLinkDown(){
    document.getElementById('removelink').className = 'removebutton-down';
}

function removeLinkLeave(){
    document.getElementById('removelink').className = 'removebutton';
}

function removeLinkUp(){
    document.getElementById('removelink').className = 'removebutton';
    if (null == selLink || null == selTask || null == dflow || undefined == dflow.tasks) {
	return;
    }
    delete selTask.links[selLinkName];
    selTask = null;
    selLink = null;
    selLinkName = '';
    updateProps(null);
    flowChanged();
}

document.getElementById('propname').onchange=nameMod;
document.getElementById('actor').onchange=actorMod;
document.getElementById('top').onchange=topMod;
document.getElementById('left').onchange=leftMod;
document.getElementById('width').onchange=widthMod;
document.getElementById('height').onchange=heightMod;
document.getElementById('color').onchange=colorMod;
document.getElementById('trace').onchange=traceMod;
document.getElementById('entry').onchange=entryMod;

document.getElementById('subject').onchange=subjectMod;
document.getElementById('count').onchange=countMod;
document.getElementById('box_resolve').onchange=boxMod;
document.getElementById('srules').onchange=srulesMod;
document.getElementById('path').onchange=pathMod;
document.getElementById('args').onchange=argsMod;
document.getElementById('timeout').onchange=timeoutMod;
document.getElementById('addr').onchange=addrMod;
document.getElementById('method').onchange=methodMod;
document.getElementById('initial').onchange=initialMod;
document.getElementById('xrules').onchange=xrulesMod;

document.getElementById('removetask').onmousedown=removeTaskDown;
document.getElementById('removetask').onmouseup=removeTaskUp;
document.getElementById('removetask').onmouseleave=removeTaskLeave;

document.getElementById('linkname').onchange=linknameMod;
document.getElementById('linkpath').onchange=linkpathMod;
document.getElementById('target').onchange=targetMod;
document.getElementById('removelink').onmousedown=removeLinkDown;
document.getElementById('removelink').onmouseup=removeLinkUp;
document.getElementById('removelink').onmouseleave=removeLinkLeave;

updateProps(null);
