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
        var typeAmount = options.typeAmount,
            tile,
            size = options.size;

        for (var i = 0; i < size; i++) {
          for (var j = 0; j < size; j++) {
            tile = new Tile({
              x: i,
              y: j,
              type: this._getRandomType(typeAmount, i, j)
            });

            this.add(tile);
          }
        }
        return this;
      },
      _getRandomType: function (typeAmount, i, j) {
        var type = _.random(1, typeAmount);
        this._tempPlayGround = this._tempPlayGround || {};
        this._tempPlayGround[i] = this._tempPlayGround[i] || {};

        // horizontal simple combo (3x)
        if (!_.isEmpty(this._tempPlayGround[i])) {
          if (this._tempPlayGround[i][j - 2] === type && this._tempPlayGround[i][j - 1] === type) {
            return this._getRandomType(typeAmount, i, j);
          }
        }

        // vertical simple combo
        if (this._tempPlayGround[i - 1] && this._tempPlayGround[i - 2]) {
          if (this._tempPlayGround[i - 1][j] === type && this._tempPlayGround[i - 2][j] === type) {
            return this._getRandomType(typeAmount, i, j);
          }
        }

        // push to collector
        this._tempPlayGround[i][j] = type;

        // cleanup
        if (!_.isEmpty(this._tempPlayGround[i - 3])) {
          delete this._tempPlayGround[i - 3];
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

        neighbour = this.find(function (neighbour) {
          return neighbour.get('x') === dx[direction] && neighbour.get('y') === dy[direction];
        });

        return neighbour;
      }
    });
});
