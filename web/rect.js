// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

function rectMouseDown(e) {
    var x = e.layerX, y = e.layerY;
    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }
    if (snapTo) {
	x = Math.floor((x + 5) / 10) * 10;
	y = Math.floor((y + 5) / 10) * 10;
    }
    toolPick('ptr');

    var name = 'untitled';
    for (var i = 0; null != dflow.tasks[name]; i++) {
        name = 'untitled-' + i;
    }
    selTask = {
        'name': name,
        'links': {},
        'actor': '',
        'trace': false,
        'graphic': {'left': x, 'top': y, 'width': 100, 'height': 60, 'color': 'white'}
    };
    selBut = 0x33;
    dflow.tasks[selTask.name] = selTask;
    origX = selTask.graphic.left;
    origY = selTask.graphic.top;

    updateProps();
    updateDims();
    flowChanged();
}
