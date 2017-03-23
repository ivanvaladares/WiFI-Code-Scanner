node-qr-image
========

[![npm version](https://badge.fury.io/js/qr-image.svg)](https://badge.fury.io/js/qr-image)

#####THIS REPO IS BESED ON [alexeyten/qr-image](https://github.com/alexeyten/qr-image)

#####DIFFERENCES:

1. change `size` option to image's `width` || `height`.
2. remove `margin` option.

-----------------------------------------------------------------

This is yet another QR Code generator.

Overview
--------

  * No dependecies;
  * generate image in `png`, `svg`, `eps` and `pdf` formats;
  * numeric and alphanumeric modes;
  * support UTF-8.

[Releases](https://github.com/wanming/qr-image/releases/)


Installing
-----

```shell
npm install node-qr-image
```

Usage
-----

Example:
```javascript
var qr = require('node-qr-image');

var qr_svg = qr.image('I love QR!', { type: 'svg' });
qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));

var svg_string = qr.imageSync('I love QR!', { type: 'svg' });
```

[More examples](./examples)

`qr = require('node-qr-image')`

### Methods

  * `qr.image(text, [ec_level | options])` — Readable stream with image data;
  * `qr.imageSync(text, [ec_level | options])` — string with image data. (Buffer for `png`);
  * `qr.svgObject(text, [ec_level | options])` — object with SVG path and size;
  * `qr.matrix(text, [ec_level])` — 2D array.


### Options

  * `text` — text to encode;
  * `ec_level` — error correction level. One of `L`, `M`, `Q`, `H`. Default `M`.
  * `options` — image options object:
    * `ec_level` — default `M`.
    * `type` — image type. Possible values `png` (default), `svg`, `pdf` and `eps`.
    * `size` (png and svg only) — size of IMAGE's width or height in pixels. Default `100` for png and `undefined` for svg.
    * `margin` — white space around QR image in modules. Default `4` for `png` and `1` for others.
    * `customize` (only png) — function to customize qr bitmap before encoding to PNG.
    * `parse_url` (experimental, default `false`) — try to optimize QR-code for URLs.

Changes
-------

  * Implement `imageSync` for `png`.


TODO
----

  * Tests;
  * mixing modes;
  * Kanji (???).
