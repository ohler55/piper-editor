// Copyright 2016 by Peter Ohler, All Rights Reserved
// contact: peter@ohler.com

function linkMouseDown(e) {
    toolPick('ptr');
    if (null != (selTask = pointTask(e.layerX, e.layerY))) {
        selLinkName = '';
        for (var i = 0; null != selTask.links[selLinkName]; i++) {
            selLinkName = 'untitled-' + i;
        }
        selLink = {'target': null, 'path': []};
        var g = selTask.graphic;
        selLinkPath = [[g.left + g.width / 2.0, g.top + g.height / 2.0], [e.layerX, e.layerY]];
        selTask.links[selLinkName] = selLink;

        selBut = 1;
        origX = e.layerX;
        origY = e.layerY;
        updateProps();
        flowChanged();
    }
}
