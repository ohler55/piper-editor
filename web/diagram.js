// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

function drawRulers() {
    var ds = document.getElementById("dshell");
    var d = document.getElementById("diagram");
    var x0 = ds.scrollLeft / dscale;
    var y0 = ds.scrollTop / dscale;

    var r = document.getElementById("hrule");
    var inc = (0.5 <= dscale) ? 10 : 100;
    var inc10 = inc * 10

    var w = r.clientWidth;
    var h = r.clientHeight;

    var ctx = r.getContext('2d')
    var mx = dwidth;
    ctx.clearRect(0, 0, w, h);
    ctx.font='7pt Arial';
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    for (var x = Math.floor(x0 / 10) * 10 + inc; x <= mx; x += inc) {
	if (0 == x % inc10) {
	    ctx.moveTo((x-x0) * dscale, 3);
	    ctx.fillText(x.toString(), (x-x0) * dscale + 2, 8);
	} else {
	    ctx.moveTo((x-x0) * dscale, 12);
	}
	ctx.lineTo((x-x0) * dscale, h + 1);
    }
    ctx.stroke();

    var r = document.getElementById("vrule");
    w = r.clientWidth;
    h = r.clientHeight;

    ctx = r.getContext('2d')
    var mx = dheight;
    ctx.clearRect(0, 0, w, h);
    ctx.font='7pt Arial';
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    for (var y = Math.floor(y0 / 10) * 10 + inc; y <= mx; y += inc) {
	if (0 == y % inc10) {
	    ctx.moveTo(3, (y-y0) * dscale);
	} else {
	    ctx.moveTo(12, (y-y0) * dscale);
	}
	ctx.lineTo(w + 1, (y-y0) * dscale);
    }
    ctx.stroke();

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    for (var y = Math.floor(y0 / 100) * 100 + inc10; y <= mx; y += inc10) {
	ctx.fillText(y.toString(), 3-(y-y0) * dscale, 8);
    }
    ctx.restore();
}

function drawTask(t, ctx, entry) {
    var g = t.graphic;
    if ('string' === typeof g.color) {
	ctx.fillStyle = g.color;
    } else if ('number' === typeof g.color) {
	ctx.fillStyle ='#' + (0x1000000 + g.color).toString(16).substr(1);
    } else {
	ctx.fillStyle='#ffffff';
    }
    ctx.strokeStyle = '#000000';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillRect(g.left, g.top, g.width, g.height);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    if (entry) {
	ctx.lineWidth = 3.0;
    } else {
	ctx.lineWidth = 1.0;
    }
    ctx.strokeRect(g.left, g.top, g.width, g.height);
    ctx.fillStyle='#000000';
    ctx.font='20px Arial';
    ctx.fillText(t.name, g.left + (g.width-ctx.measureText(t.name).width) / 2, g.top + 18);
    ctx.fillStyle='#808080';
    var y = g.top + 35;
    ctx.font='100 14px Arial';
    Object.keys(t).forEach(function(ak,j){
	if ('links' == ak || 'graphic' == ak || 'name' == ak) {
	    return;
	}
	ctx.fillText(ak + ": " + t[ak].toString(), g.left + 3, y);
	y += 16;
    })
    if (selTask == t) {
	var cx = g.left + g.width / 2.0;
	var cy = g.top + g.height / 2.0;
	var bid = 1;
	var bs = 3.0 / dscale, bs2 = 6.0 / dscale;

	ctx.fillStyle='#00aaff';
	if (null == selLink) { // indicates it is the link that is selected, not the task
	    ctx.fillRect(cx - bs, g.top - bs, bs2, bs2);
	    ctx.fillRect(g.left + g.width - bs, g.top - bs, bs2, bs2);
	    ctx.fillRect(g.left + g.width - bs, cy - bs, bs2, bs2);
	    ctx.fillRect(g.left + g.width - bs, g.top + g.height - bs, bs2, bs2);
	    ctx.fillRect(cx - bs, g.top + g.height - bs, bs2, bs2);
	    ctx.fillRect(g.left - bs, g.top + g.height - bs, bs2, bs2);
	    ctx.fillRect(g.left - bs, cy - bs, bs2, bs2);
	    ctx.fillRect(g.left - bs, g.top - bs, bs2, bs2);
	}
    }
}

function drawDiagram() {
    var ds = document.getElementById("dshell");
    var d = document.getElementById("diagram");
    var w = d.clientWidth;
    var h = d.clientHeight;
    var ctx = d.getContext('2d')

    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin='round';
    ctx.scale(dscale,dscale);
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#f0f0f0';
    ctx.beginPath();
    for (var i = 10; i < w; i +=10) {
	ctx.moveTo(i,0);
	ctx.lineTo(i,h);
    }
    ctx.stroke();
    ctx.beginPath();
    for (var i = 10; i < h; i +=10) {
	ctx.moveTo(0,i);
	ctx.lineTo(w,i);
    }
    ctx.stroke();
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    for (var i = 100; i < w; i +=100) {
	ctx.moveTo(i,0);
	ctx.lineTo(i,h);
    }
    ctx.stroke();
    ctx.beginPath();
    for (var i = 100; i < h; i +=100) {
	ctx.moveTo(0,i);
	ctx.lineTo(w,i);
    }
    ctx.stroke();

    if (null == dflow || undefined == dflow.tasks) {
	ctx.translate(-0.5, -0.5);
	ctx.scale(1.0 / dscale,1.0 / dscale);
	return;
    }
    // links
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.0;
    var t, g, g2, links, t2, p2,pl, path, tasks = dflow.tasks;
    ctx.fillStyle='#000000';
    ctx.font='14px Arial';
    Object.keys(tasks).forEach(function(k,i) {
	t = tasks[k];
	links = t.links
	if (undefined == links || null == links) {
	    return;
	}
	g = t.graphic;
	Object.keys(links).forEach(function(lk,j) {
	    link = links[lk];
	    if ('string' == typeof link) {
		t2 = tasks[link];
	    } else {
		t2 = tasks[link.target];
	    }
	    if (undefined == t2) {
		return;
	    }
	    g2 = t2.graphic;
            if (lk == selLinkName && 1 < selLinkPath.length) {
		p2 = selLinkPath[selLinkPath.length-1];
                if (selBut != selLinkPath.length - 1) {
	            drawArrow(selLinkPath[selLinkPath.length-2],g2,ctx)
                }
	        ctx.beginPath();
                ctx.moveTo(p2[0], p2[1]);
                for (var i = selLinkPath.length - 2; 0 <= i; i--) {
                    p2 = selLinkPath[i];
                    ctx.lineTo(p2[0], p2[1]);
                }
	        ctx.stroke();
                p2 = selLinkPath[1];
                

            } else {
	        ctx.beginPath();
	        ctx.moveTo(g.left + g.width / 2, g.top + g.height / 2);
	        p2 = [g2.left + g2.width / 2, g2.top + g2.height / 2];
	        pl = [g.left + g.width / 2, g.top + g.height / 2];
	        if (undefined != link.path && 0 < link.path.length) {
		    p2 = link.path[0];
		    pl = link.path[link.path.length-1];
		    link.path.forEach(function(p,z,a) {
		        ctx.lineTo(p[0], p[1]);
		    });
	        }
	        ctx.lineTo(g2.left + g2.width / 2, g2.top + g2.height / 2);
	        ctx.stroke();
	        drawArrow(pl,g2,ctx)
            }
	    if (1 < lk.length) {
		var pt = labelPt(p2, g, ctx.measureText(lk).width);
		ctx.fillText(lk, pt[0], pt[1]);
	    }
            
	});
    })

    // tasks
    ctx.lineWidth = 1.0;
    ctx.shadowColor = '#a0a0a0';
    Object.keys(tasks).forEach(function(k,i) {
	drawTask(tasks[k], ctx, dflow.entry == k);
    })
    if (null != selLink && null != selTask) {
	var g = selTask.graphic;
	var cx = g.left + g.width / 2.0;
	var cy = g.top + g.height / 2.0;
	var bid = 1;
	var bs = 3.0 / dscale, bs2 = 6.0 / dscale;
        
	ctx.beginPath();
	ctx.fillStyle='#00aaff';
	ctx.strokeStyle = '#00aaff';
        var i, p = selLinkPath[selLinkPath.length-1];
	ctx.moveTo(p[0], p[1]);
	ctx.fillRect(p[0] - bs, p[1] - bs, bs2, bs2);
	for (i = selLinkPath.length-2; 0 <= i; i--) {
	    p = selLinkPath[i];
	    ctx.lineTo(p[0], p[1]);
            if (0 == i) {
	        ctx.strokeRect(p[0] - bs, p[1] - bs, bs2, bs2);
            } else {
	        ctx.fillRect(p[0] - bs, p[1] - bs, bs2, bs2);
            }
        }
	ctx.stroke();
    }
    ctx.translate(-0.5, -0.5);
    ctx.scale(1.0 / dscale,1.0 / dscale);
}
function labelPt(p,g,nw) {
    var cx = g.left + g.width / 2, cy= g.top + g.height / 2;
    var dx = p[0]-cx, dy = p[1]-cy;
    var a = Math.atan2(dy,dx), pi4=Math.PI / 4, po=[0,0];

    if (-pi4 <= a && a < pi4) { // right side
	po[0] = g.left + g.width;
	po[1] = Math.round(cy + dy / dx * (po[0]-cx));
	po[0] += 3;
	po[1] += (0 <= a ? -5 : 14);
    } else if (pi4 <= a && a < (3 * pi4)) { // bottom
	po[1] = g.top + g.height;
	po[0] = Math.round(cx + dx / dy * (po[1]-cy));
	po[1] += 14;
	po[0] += (Math.PI / 2 > a ? -nw-3 : 3);
    } else if (-pi4 >= a && a > (-3 * pi4)) { // top
	po[1] = g.top;
	po[0] = Math.round(cx + dx / dy * (po[1]-cy));
	po[1] -= 3;
	po[0] += (-Math.PI / 2 < a ? -nw-3 : 3);
    } else if (3 * pi4 <= a || a < (-3 * pi4)) { // left
	po[0] = g.left;
	po[1] = Math.round(cy + dy / dx * (po[0]-cx));
	po[0] -= 3 + nw;
	po[1] += (0 <= a ? -5 : 14);
    }
    return po;
}

function drawArrow(p,g,ctx) {
    var cx = g.left + g.width / 2.0, cy = g.top + g.height / 2.0;
    var dx = p[0]-cx, dy = p[1]-cy;
    var ura = Math.atan2(cy - g.top, cx - g.left);
    var px = 0, py = 0;
    var a = Math.atan2(dy,dx);

    if (-ura <= a && a < ura) { // right side
	px = g.left + g.width;
	py = Math.round(cy + dy / dx * (px-cx));
    } else if (ura <= a && a < Math.PI - ura) { // bottom
	py = g.top + g.height;
	px = Math.round(cx + dx / dy * (py-cy));
    } else if (-ura >= a && a > -Math.PI + ura) { // top
	py = g.top;
	px = Math.round(cx + dx / dy * (py-cy));
    } else if (Math.PI - ura <= a || a < Math.PI + ura) { // left
	px = g.left;
	py = Math.round(cy + dy / dx * (px-cx));
    }
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, 16, a-0.4, a + 0.4);
    ctx.lineTo(px, py);
    ctx.closePath();
    ctx.fill();
}

function showScale() {
    document.getElementById('scales').classList.toggle('show');
}

function pickScale(s) {
    if (dscale != s / 100) {
	dscale = s / 100;
	document.getElementById('scalevalue').innerHTML = s;
	resizeWork();
    }
    var menu = document.getElementById('scales');
    if (menu.classList.contains('show')) {
	menu.classList.remove('show');
    }
}
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
function updateDims(){
    if (null == dflow) {
	dwidth = 1000
	dheight = 1000
	return;
    }
    dwidth = 100; // minimum
    dheight = 100; // minimum
    var link, tasks = dflow.tasks;
    var ny = 10;
    if (undefined != tasks) {
	Object.keys(tasks).forEach(function(k,i) {
	    var t = tasks[k];
	    if (null == t.graphic) {
		t.graphic = {
		    'left': 10,
		    'top' : ny,
		    'width': 160,
		    'height': 80,
		    'color': 0x66ccff,
		}
		ny += 100;
	    } else {
		if (undefined == t.graphic.left || t.graphic.left < 0) {
		    t.graphic.left = 10;
		}
		if (undefined == t.graphic.top || t.graphic.top < 0) {
		    t.graphic.top = ny;
		    ny += 100;
		}
		if (undefined == t.graphic.width || t.graphic.width < 20) {
		    t.graphic.width = 160;
		}
		if (undefined == t.graphic.height || t.graphic.height < 20) {
		    t.graphic.height = 80;
		}
		if (undefined == t.graphic.color) {
		    t.graphic.color = 'white';
		}
		ny = t.graphic.top + t.graphic.height + 40;
	    }
	    if (dwidth < t.graphic.left + t.graphic.width) {
		dwidth = t.graphic.left + t.graphic.width;
	    }
	    if (dheight < t.graphic.top + t.graphic.height) {
		dheight = t.graphic.top + t.graphic.height;
	    }
	    if (undefined != t.links) {
		Object.keys(t.links).forEach(function(lk,j) {
		    link = t.links[lk];
		    if (undefined == link.path) {
			return;
		    }
		    link.path.forEach(function(p,z,a) {
			if (dwidth < p[0]) {
			    dwidth = p[0];
			}
			if (dheight < p[1]) {
			    dheight = p[1];
			}
		    });
		});
	    }
	    t.name = k;
	});
    }
    dwidth = Math.floor((dwidth + 120) / 100) * 100;
    dheight = Math.floor((dheight + 120) / 100) * 100;
    resizeWork();
}
function setJsonFlow(flow){
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
function flownameMod(){
    var e = document.getElementById('flowname');
    if (null == dflow || e.value === dflow.id) {
	return;
    }
    if (0 == e.value.length) {
	e.value = dflow.id;
    } else {
	dflow.id = e.value;
	if (true != dflow.changed) {
	    dflow.changed = true;
	    document.getElementById("titlelabel").innerHTML = " * Title:";
	}
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
    document.getElementById('savebut').className = 'tool-down';
    document.getElementById('savebut').className = 'tool';
}
function snapTog(){
    var e = document.getElementById('snapbut');

    if ('tool' === e.className) {
	snapTo = true;
    } else {
	snapTo = false;
    }
    e.className = (snapTo ? 'tool-down' : 'tool');
}
var tools = ['ptr','rect','link'];
function toolPick(tool){
    if ('tool-off' === document.getElementById(tool + 'but').className) {
	return;
    }
    activeTool = tool;
    for (var i=tools.length-1; 0<=i; i--) {
	if (tool == tools[i]) {
	    document.getElementById(tools[i] + 'but').className = 'tool-down';
	} else {
	    document.getElementById(tools[i] + 'but').className = 'tool';
	}
    }
    if ('rect' === tool) {
	document.getElementById('diagram').style.cursor = 'crosshair';
    } else if ('link' === tool) {
	document.getElementById('diagram').style.cursor = 'cell';
    } else {
	document.getElementById('diagram').style.cursor = 'default';
    }
}
// clear the flow title
document.getElementById('flowname').value = '';
document.getElementById('flowname').onchange = flownameMod;
document.getElementById('snapbut').onclick = snapTog;
document.getElementById('ptrbut').onclick = function(){toolPick('ptr');}
document.getElementById('rectbut').onclick = function(){toolPick('rect');}
document.getElementById('linkbut').onclick = function(){toolPick('link');}
