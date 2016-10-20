# piper-editor

Piper Editor is a process flow editor for creating and modifying Piper process
flows. Flows are represented by a JSON description and are run with [Piper
Push Cache](http://piperpushcache.com) applications. Both the Piper push web
server and the Piper Flow processor (coming soon).

The Piper Flow editor is written in Javascript with no dependencies on any
other Javascript library. It is a graphical editor that is not only included
in the Piper web server but can be served standalone as on the [Piper Push
Cache](http://piperpushcache.com/editor/editor.html) web site.

A sample file is included in this repository. To run the Flow use Piper. See
the 'flowing' example. The sample includes the sample Ruby code to run the
sample. The Ruby code uses the
[piper-ruby](https://github.com/ohler55/piper-ruby) and the
[Oj](https://github.com/ohler55/oj) gem.

