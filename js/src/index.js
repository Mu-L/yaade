// src/index.js
const jsonpath = require("jsonpath");
const { DateTime } = require("luxon");
const { MersenneTwister19937, Random } = require("random-js");

var __chars = {
  ascii: function () {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  },
  indices: function () {
    if (!this.cache) {
      this.cache = {};
      var ascii = __chars.ascii();

      for (var c = 0; c < ascii.length; c++) {
        var chr = ascii[c];
        this.cache[chr] = c;
      }
    }
    return this.cache;
  },
};

const btoa = function (data) {
  var ascii = __chars.ascii(),
    len = data.length - 1,
    i = -1,
    b64 = "";

  while (i < len) {
    var code =
      (data.charCodeAt(++i) << 16) |
      (data.charCodeAt(++i) << 8) |
      data.charCodeAt(++i);
    b64 +=
      ascii[(code >>> 18) & 63] +
      ascii[(code >>> 12) & 63] +
      ascii[(code >>> 6) & 63] +
      ascii[code & 63];
  }

  var pads = data.length % 3;
  if (pads > 0) {
    b64 = b64.slice(0, pads - 3);

    while (b64.length % 4 !== 0) {
      b64 += "=";
    }
  }

  return b64;
};

const atob = function (b64) {
  var indices = __chars.indices(),
    pos = b64.indexOf("="),
    padded = pos > -1,
    len = padded ? pos : b64.length,
    i = -1,
    data = "";

  while (i < len) {
    var code =
      (indices[b64[++i]] << 18) |
      (indices[b64[++i]] << 12) |
      (indices[b64[++i]] << 6) |
      indices[b64[++i]];
    if (code !== 0) {
      data += String.fromCharCode(
        (code >>> 16) & 255,
        (code >>> 8) & 255,
        code & 255
      );
    }
  }

  if (padded) {
    data = data.slice(0, pos - b64.length);
  }

  return data;
};

const jpath = function (expr, value) {
  let json = value;
  if (typeof value === 'string') json = JSON.parse(value);
  return jsonpath.value(json, expr);
};

global.jp = jpath;
global.DateTime = DateTime;
global.rand = new Random(MersenneTwister19937.autoSeed());
global.btoa = btoa;
global.atob = atob;
