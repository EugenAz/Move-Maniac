define(function () {
  'use strict';



  function Combo () {
    var comboTiles = {},
        lastTileInCombo = {};

    this.length = 0;


    this.lastTile = function () {
      return lastTileInCombo;
    }

    this.push = function (i, j, tile) {
      comboTiles[i] = comboTiles[i] || {};
      comboTiles[i][j] = lastTileInCombo = tile;
      this.length++;
    };

    this.flush = function () {
      this.length = 0;
      comboTiles = {};
      lastTileInCombo = {};

      if (arguments.length === 3) {
        this.push.apply(this, arguments);
      }
    };

    this.valueOf = function () {
      return comboTiles;
    };

    this.get = function () {
      return comboTiles;
    };
  }

  Combo.prototype.isEmpty = function () {
    return this.length === 0;
  };

  return Combo;
});
