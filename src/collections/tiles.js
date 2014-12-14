define([
  'backbone',
  'models/tile'
], function (
  Backbone,
  Tile
) {
    'use strict';

    return Backbone.Collection.extend({
      model: Tile,
      create: function (options) {
        var tile;

        this.typeAmount = options.typeAmount;
        this.size = options.size;

        for (var i = 0; i < this.size; i++) {
          for (var j = 0; j < this.size; j++) {
            this._createTile({
              y: i,
              x: j,
              type: this._getRandomType(i, j)
            });
          }
        }
        return this;
      },
      createN: function (coords) {
        var tile,
            split,
            x, y;

        coords.forEach(function (coord) {
          split = coord.split(',');
          y = split[0];
          x = split[1];

          this._createTile({
            x: x,
            y: y,
            type: this._getRandomType()
          });

        }.bind(this));
      },
      _createTile: function (options) {
        var tile = new Tile(options);
        this.add(tile);
      },
      _getRandomType: function (i, j) {
        var type = _.random(1, this.typeAmount);

        if (arguments.length === 2) {
          this._tempPlayGround = this._tempPlayGround || {};
          this._tempPlayGround[i] = this._tempPlayGround[i] || {};

          // horizontal simple combo (3x)
          if (!_.isEmpty(this._tempPlayGround[i])) {
            if (this._tempPlayGround[i][j - 2] === type && this._tempPlayGround[i][j - 1] === type) {
              return this._getRandomType(i, j);
            }
          }

          // vertical simple combo
          if (this._tempPlayGround[i - 1] && this._tempPlayGround[i - 2]) {
            if (this._tempPlayGround[i - 1][j] === type && this._tempPlayGround[i - 2][j] === type) {
              return this._getRandomType(i, j);
            }
          }

          // push to collector
          this._tempPlayGround[i][j] = type;

          // cleanup
          if (!_.isEmpty(this._tempPlayGround[i - 3])) {
            delete this._tempPlayGround[i - 3];
          }

          if (i === this.size - 1 && j === this.size - 1) {
            delete this._tempPlayGround;
          }
        }

        return type;
      },
      findNeighbour: function (tile, direction) {
        var neighbour,
            dx = {
              'up': tile.get('x'),
              'right': tile.get('x') + 1,
              'down': tile.get('x'),
              'left': tile.get('x') - 1
            },
            dy = {
              'up': tile.get('y') - 1,
              'right': tile.get('y'),
              'down': tile.get('y') + 1,
              'left': tile.get('y')
            };

        neighbour = this.getTileByCoords(dx[direction], dy[direction]);
        return neighbour;
      },
      removeSelected: function (combos) {
        var tile,
            emptyCoords = [];

        combos.forEach(function (combo) {
          for (var key in combo.coords) {
            emptyCoords.push(key);
            tile = this.get(combo.coords[key]);
            this.remove(tile);
            tile.destroy();
          }
        }.bind(this));

        return emptyCoords;
      },
      createSubstitutions: function (removedTiles) {
        var colIterator = {};
        removedTiles.forEach(function (coords) {
          var x = parseInt(coords.split(',')[1]);
          colIterator[x] = !!colIterator[x] ? colIterator[x] - 1 : -1;

          this._createTile({
            x: x,
            y: colIterator[x],
            type: this._getRandomType()
          });
        }.bind(this));
      },
      dropTilesIntoPositions: function (removedTiles) {
        var gapLength = 0,
            firstGapYInACol,
            tile;

        removedTiles.sort().reverse();
        removedTiles.temp = {};
        removedTiles.forEach(function (coords) {
          var x, y;

          coords = coords.split(',');
          y = parseInt(coords[0]);
          x = parseInt(coords[1]);

          removedTiles.temp[x] = removedTiles.temp[x] || [];
          removedTiles.temp[x].push(y);
        });

        for (var col in removedTiles.temp) {
          col = parseInt(col);
          gapLength = removedTiles.temp[col].length;
          firstGapYInACol = removedTiles.temp[col][removedTiles.temp[col].length - 1];

          for (var i = 1; i <= gapLength + firstGapYInACol; i++) {
            tile = this.getTileByCoords(col, firstGapYInACol - i);
            tile.moveTo(col, tile.get('y') + gapLength);
          }
        }
      },
      getTileByCoords: function (x, y) {
        return this.find(function (tile) {
          return tile.get('x') === x && tile.get('y') === y;
        });
      }
    });
});
