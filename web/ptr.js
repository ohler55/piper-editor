// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

// Return index of first point in the segement that has the point or -1 if not
// on a segment.
function onPath(x, y, path) {
    var x0 = path[0][0];
    var y0 = path[0][1];
    var x1, y1, dx, dy, plen = path.length;
    for (var i = 1;i < plen; i++) {
	x1 = path[i][0];
	y1 = path[i][1];
	dx = x - x0;
	dy = y - y0;
	if (x0 == x1) {
	    if (-2 <= dx && dx <= 2) {
		if ((y0 <= y1 && y0 <= y && y <= y1) ||
		    (y1 < y0 && y1 <= y && y <= y0)) {
		    return i - 1;
		}
	    }
	} else if (y0 == y1) {
	    if (-2 <= dy && dy <= 2) {
		if ((x0 <= x1 && x0 <= x && x <= x1) ||
		    (x1 < x0 && x1 <= x && x <= x0)) {
		    return i - 1;
		}
	    }
	} else {
	    var dx01 = x0 - x1;
	    var dy01 = y0 - y1;
	    var ax = dx01, ay = dy01;
	    if (ax < 0) { ax =- ax; }
	    if (ay < 0) { ay =- ay; }
	    if (ax > ay) {
		var yt = y0 + dy01 / dx01 * dx;
		if (yt - 2 <= y && y <= yt + 2) {
		    return i - 1;
		}
	    } else {
		var xt = x0 + dx01 / dy01 * dy;
		if (xt - 2 <= x && x <= xt + 2) {
		    return i - 1;
		}
	    }
	}
	x0 = x1;
	y0 = y1;
    }
    return -1;
}

function linkTarget(t, lk) {
    var targ;
    link = t.links[lk]; 
    targ = dflow.tasks[link.target];
    if (undefined == targ) {
	targ = null;
    }
    return targ;
}

function linkPath(t, lk) {
    var g = t.graphic;
    var path = [[g.left + g.width / 2.0, g.top + g.height / 2.0]];
    var t2;
    if (null == (t2 = linkTarget(t, lk))) {
	return [];
    }
    var link = t.links[lk];
    var plen = link.path.length;
    for (var i = 0; i < plen; i++) {
	path.push(link.path[i]);
    }
    g = t2.graphic;
    path.push([g.left + g.width / 2.0, g.top + g.height / 2.0])

    return path;
}

function pointTask(x, y) {
    if (undefined != dflow && null != dflow) {
	var k, t, tasks = dflow.tasks;
	for (k in tasks) {
	    if (tasks.hasOwnProperty(k)) {
		t = tasks[k];
		g = t.graphic;
		if (g.left <= x && x <= g.left + g.width && g.top <= y && y <= g.top + g.height) {
		    return t;
		}
	    }
	}
    }
    return null;	
}

function flowClick(e) {
    var t,g,path;
    var x = e.layerX / dscale, y = e.layerY / dscale;
    var tasks = dflow.tasks;
    var redraw = false;
    var found = false;

    if (null != (t = pointTask(x, y))) {
	redraw = (selTask != t);
	selTask = t;
	selLink = null;
	selLinkName = '';
	selLinkPath = [];
	found = true;
    } else if (null != selTask) {
	unSelect();
	redraw = true;
    }
    if (!found) {
	for (var k in tasks) {
	    if (found) {
		break;
	    }
	    if (tasks.hasOwnProperty(k)) {
		t = tasks[k];
		if (undefined == t.links || null == t.links) {
		    continue;
		}
		for (var lk in t.links) {
		    path = linkPath(t, lk);
		    if (0 <= onPath(x, y, path)) {
			var link = t.links[lk];
			redraw = (selTask != t || selLink != link);
			selTask = t;
			selLink = link;
			selLinkName = lk;
			selLinkPath = path;
			found = true;
			break;
		    }
		}
	    }
	}
    }
    if (!found && null != selTask) {
	unSelect();
	redraw = true;
    }
    if (redraw) {
	drawDiagram();
	updateProps();
    }
}
    
function linkButtonClick(e) {
    if (0 < selLinkPath.length) {
	var x = e.layerX / dscale, y = e.layerY / dscale;
	var path = linkPath(selTask, selLinkName);
	var i, bs=3, px, py, plen = path.length;

	// Don't allow first to be selected as origin can not be moved or
	// changed.
	for (i = 1; i < plen; i++) {
	    px = path[i][0];
	    py = path[i][1];
	    if (px - bs <= x && x <= px + bs && py - bs <= y && y <= py + bs) {
		if (e.shiftKey && i < path.length - 1) {
		    selLinkPath.splice(i, 1); // path and selLinkPath are the same
		    selLink.path = selLinkPath.slice(1, selLinkPath.length - 1);
		    selBut = 0;
		    origX = 0;
		    origY = 0;
		    drawDiagram();
		    updateProps();
		} else {
		    selBut = i;
		    origX = px;
		    origY = py;
		}
		return true;
	    }
	}
    }
    unSelect();
    return false;
}

function taskButtonClick(e, t) {
    var g;
    var x = e.layerX / dscale, y = e.layerY / dscale;
    var found = null;

    g = t.graphic;
    var gxc = g.left + g.width / 2.0, gyc = g.top + g.height / 2.0;
    var gr = g.left + g.width, gb = g.top + g.height;
    var bs = 3.0 / dscale, but = 0;
    if (g.left - bs <= x && x <= g.left + bs) {
	but = 1;
    } else if (gxc - bs <= x && x <= gxc + bs) {
	but = 2;
    } else if (gr - bs <= x && x <= gr + bs) {
	but = 3;
    } else {
	return 0;
    }
    if (g.top - bs <= y && y <= g.top + bs) {
	but |= 0x10;
    } else if (gyc - bs <= y && y <= gyc + bs) {
	but |= 0x20;
    } else if (gb - bs <= y && y <= gb + bs) {
	but |= 0x30;
    } else {
	return 0;
    }
    if (0x22 == but) {
	but = 0;
    }
    return but;
}

function ptrMouseDown(e) {
    if (null != selTask) {
	if (null != selLink) {
	    if (!linkButtonClick(e)) {
		drawDiagram();
		updateProps();
		flowClick(e);
		if (null != selTask) {
		    origX = selTask.graphic.left;
		    origY = selTask.graphic.top;
		}
	    }
	    return;
	}
	var t = selTask;
	selBut = taskButtonClick(e, t);
	switch (selBut) {
	case 0x11:
	    origX = t.graphic.left;
	    origY = t.graphic.top;
	    break;
	case 0x12:
	    origX = t.graphic.left + t.graphic.width / 2.0;
	    origY = t.graphic.top;
	    break;
	case 0x13:
	    origX = t.graphic.left + t.graphic.width;
	    origY = t.graphic.top;
	    break;
	case 0x21:
	    origX = t.graphic.left;
	    origY = t.graphic.top + t.graphic.height / 2.0;
	    break;
	case 0x23:
	    origX = t.graphic.left + t.graphic.width;
	    origY = t.graphic.top + t.graphic.height / 2.0;
	    break;
	case 0x31:
	    origX = t.graphic.left;
	    origY = t.graphic.top + t.graphic.height;
	    break;
	case 0x32:
	    origX = t.graphic.left + t.graphic.width / 2.0;
	    origY = t.graphic.top + t.graphic.height;
	    break;
	case 0x33:
	    origX = t.graphic.left + t.graphic.width;
	    origY = t.graphic.top + t.graphic.height;
	    break;
	default:
	    break;
	}
	if (0 != selBut) {
	    return;
	}
    }
    flowClick(e);
    if (null != selTask) {
	origX = selTask.graphic.left;
	origY = selTask.graphic.top;
    }
}

function ptrMouseMove(e) {
    dx = e.layerX - downX;
    dy = e.layerY - downY;
    if (null == selTask) {
	return;
    }
    var min = 20, edge;
    var t = selTask;
    if (null != selLink) {
	if (0 < selBut) {
	    if (origX + dx < 0) {
		dx = -origX;
	    }
	    if (origY + dy < 0) {
		dy = -origY;
	    }
	    if (selLinkPath.length <= selBut) {
		selBut = selLinkPath.length - 1;
	    }
	    var pt = selLinkPath[selBut];
	    pt[0] = origX + dx;
	    pt[1] = origY + dy;
	    if (snapTo) {
		pt[0] = Math.floor((pt[0] + 5) / 10) * 10;
		pt[1] = Math.floor((pt[1] + 5) / 10) * 10;
	    }
	    if (selLinkPath.length - 1 == selBut) {
		var nt = pointTask(pt[0], pt[1]);
		if (null != nt) {
		    var targ = linkTarget(t, selLinkName);
		    if (nt != targ && (selTask != nt || 2 < selLinkPath.length)) {
			selLink.target = nt.name;
		    }
		}
	    }
	    updateProps();
	    updateDims();
	    flowChanged();
	}
	return;
    }
    switch (0x0f & selBut) {
    case 0x01:
	edge = t.graphic.left + t.graphic.width;
	if (edge - min < origX + dx) {
	    dx = edge - min - origX;
	} else if (origX + dx < 0) {
	    dx = -origX;
	}
	t.graphic.left = origX + dx;
	if (snapTo) {
	    t.graphic.left = Math.floor((t.graphic.left + 5) / 10) * 10;
	}
	t.graphic.width = edge - t.graphic.left;
	break;
    case 0x03:
	t.graphic.width = origX + dx - t.graphic.left;
	if (t.graphic.width < min) {
	    t.graphic.width = min;
	}
	if (snapTo) {
	    t.graphic.width = Math.floor((t.graphic.width + 5) / 10) * 10;
	}
	break;
    default:
	break;
    }
    switch (0xf0 & selBut) {
    case 0x10:
	edge = t.graphic.top + t.graphic.height;
	if (edge - min < origY + dy) {
	    dy = edge - min - origY;
	} else if (origY + dy < 0) {
	    dy = -origY;
	}
	t.graphic.top = origY + dy;
	if (snapTo) {
	    t.graphic.top = Math.floor((t.graphic.top + 5) / 10) * 10;
	}
	t.graphic.height = edge - t.graphic.top;
	break;
    case 0x30:
	t.graphic.height = origY + dy - t.graphic.top;
	if (t.graphic.height < min) {
	    t.graphic.height = min;
	}
	if (snapTo) {
	    t.graphic.height = Math.floor((t.graphic.height + 5) / 10) * 10;
	}
	break;
    default:
	break;
    }
    if (0 == selBut) {
	t.graphic.top = origY + dy;
	t.graphic.left = origX + dx;
	if (t.graphic.top < 0) {
	    t.graphic.top = 0;
	} else if (snapTo) {
	    t.graphic.top = Math.floor((t.graphic.top + 5) / 10) * 10;
	}
	if (t.graphic.left < 0) {
	    t.graphic.left = 0;
	} else if (snapTo) {
	    t.graphic.left = Math.floor((t.graphic.left + 5) / 10) * 10;
	}
    }
    updateProps();
    updateDims();
    flowChanged();
}

function ptrDblClick(e) {
    if (null != selTask && null != selLink) {
	var i, pos, path = linkPath(selTask, selLinkName);
	var x = e.layerX/dscale, y = e.layerY/dscale;
	if (snapTo) {
	    x = Math.floor((x + 5) / 10) * 10;
	    y = Math.floor((y + 5) / 10) * 10;
	}
	if (0 <= (pos = onPath(x, y, path))) {
	    selLinkPath.splice(pos + 1, 0, [x, y]);
	    link.path = selLinkPath.slice(1, selLinkPath.length - 1);
	    updateProps();
	    updateDims();
	    flowChanged();
	}
    }
}

function ptrMouseUp(e) {
    if (null != selLink) {
	var targ;
	// set last point to target center
	if (null != (targ = linkTarget(selTask, selLinkName))) {
	    var i = selLinkPath.length - 1;
	    var g = targ.graphic;
	    selLinkPath[i][0] = g.left + g.width / 2.0;
	    selLinkPath[i][1] = g.top + g.height / 2.0;
	    drawDiagram();
	} else if (null == selLink.target) {
	    delete selTask.links[selLinkName];
	    unSelect();
	    updateProps();
	    drawDiagram();
	}
    }
}
