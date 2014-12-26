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

    this.export = function () {
      var combo = {
        count: 0,
        coords: {},
        type: ''
      };

      for (var i in comboTiles) {
        for (var j in comboTiles[i]) {
          combo.count++;
          combo.coords[i + ',' + j] = comboTiles[i][j].id;

          if (combo.type === '') {
            combo.type = comboTiles[i][j].type;
          }
        }
      }
      return combo;
    }
  }

  Combo.prototype.isEmpty = function () {
    return this.length === 0;
  };

  Combo.mergeCombos = function (combo1, combo2) {
    var union = _.union(Object.keys(combo1.coords), Object.keys(combo2.coords)),
        crossCombo = {
          count: union.length,
          type: combo1.type,
          coords: {},
          keyElem: '' // id TODO:
        };

    _(union).forEach(function (coordKey) {
      crossCombo.coords[coordKey] = combo1.coords[coordKey] || combo2.coords[coordKey];
    });

    return crossCombo;
  };

  return Combo;
});
