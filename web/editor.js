// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

function setFlow(s,fn) {
    try {
	j = JSON.parse(s);
    } catch (e) {
	alert(e);
	return;
    }
    if (!j.id) {
	var i = fn.lastIndexOf('.flow');

	if (0 < i) {
	    fn = fn.substr(0, i);
	} else {
	    i = fn.lastIndexOf('.json');
	    if (0 < i) {
		fn = fn.substr(0, i);
	    }
	}
	j.id = fn;
    }
    setJsonFlow(j);
}

function setJsonFlow(flow) {
    if (null != flow) {
	if (undefined == flow.tasks || null == flow.tasks) {
            flow.tasks = {};
	}
        Object.keys(flow.tasks).forEach(function(k) {
	    var t = flow.tasks[k];
	    if (undefined == t.links || null == t.links) {
                t.links = {};
	        return;
	    }
	    Object.keys(t.links).forEach(function(lk) {
                var link = t.links[lk];
                if ('string' == typeof link) {
                    t.links[lk] = {'target': link, 'path': []};
                }
            });
        });
    }
    dflow = flow;
    dflow.changed = false;
    document.getElementById('flowname').value = dflow.id;
    unSelect();
    updateProps();
    updateDims();
    document.getElementById('flowname').disabled = false;
    document.getElementById('savebut').className = 'tool';
    document.getElementById('snapbut').className = (snapTo ? 'tool-down' : 'tool');
    document.getElementById('ptrbut').className = 'tool-down';
    document.getElementById('rectbut').className = 'tool';
    document.getElementById('linkbut').className = 'tool';
    document.getElementById("titlelabel").innerHTML = "Title:";
}

function fixEvent(e) {
    if (!e) {
	e = window.event;
    }
    if (!e.which && e.button) {
	if (e.button & 1) {
	    e.which = 1;
	} else if (e.button & 2) {
	    e.which = 3;
	}
    }
    return e;
}

function flowMouseDown(e) {
    if (null == dflow || undefined == dflow.tasks) {
	return;
    }
    e = fixEvent(e);
    downX = e.layerX;
    downY = e.layerY;
    switch (activeTool) {
    case 'ptr':
	ptrMouseDown(e);
	break;
    case 'rect':
	rectMouseDown(e);
	break;
    case 'link':
	linkMouseDown(e);
	break;
    default:
	break;
    }
}
function flowMouseMove(e) {
    if (0 > downX || null == dflow || undefined == dflow.tasks) {
	return;
    }
    e = fixEvent(e);
    if ('ptr' == activeTool) {
	ptrMouseMove(e);
    }
}
function flowMouseUp(e) {
    e = fixEvent(e);
    downX = -1;
    downY = -1;
    origX = -1;
    origY = -1;
    selBut = -1;
    if ('ptr' == activeTool) {
        ptrMouseUp(e);
    }
}

function flowDblClick(e) {
    if ('ptr' != activeTool || null == dflow || undefined == dflow.tasks) {
	return;
    }
    e = fixEvent(e);
    ptrDblClick(e);
}

function flowOut(e) {
    if (0 <= selBut) {
	downX = -1;
	downY = -1;
	downTime = 0;
	origX = -1;
	origY = -1;
	selBut = -1;
    }
}

function openFlow() {
    document.getElementById('opentool').value = '';
    document.getElementById('opentool').click();
}

function openInput() {
    var f = document.getElementById('opentool').files[0];

    if (f) {
	var r = new FileReader();
	r.onload = function(e) {
	    setFlow(e.target.result, f.name);
	};
	r.onerror = function(e) {
	    alert("error reading " + f.name);
	};
	r.readAsText(f, 'UTF-8');
    }
}

function saveFlow() {
    if (null != dflow) {
        document.getElementById('savebut').className = 'tool-down';
        var a = document.getElementById("save_a");
        var b = new Blob([JSON.stringify(dflow, null, '  ')], {type: 'application/json'});
        a.href = URL.createObjectURL(b);
        if (dflow.id.endsWith('.json') || dflow.id.endsWith('.flow')) {
            a.download = dflow.id;
        } else {
            a.download = dflow.id + '.flow';
        }
        a.click();
        document.getElementById('savebut').className = 'tool';
    }
}

document.getElementById('diagram').ondblclick = flowDblClick;
document.getElementById('diagram').onmousedown = flowMouseDown;
document.getElementById('diagram').onmousemove = flowMouseMove;
document.getElementById('diagram').onmouseup = flowMouseUp;
document.getElementById('diagram').onmouseout = flowOut;
//document.getElementById('diagram').onkeydown = flowKeyDown;

document.getElementById('openbut').onclick = openFlow;
document.getElementById('savebut').onclick = saveFlow;
