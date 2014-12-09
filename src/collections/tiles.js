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

        neighbour = this.find(function (neighbour) {
          return neighbour.get('x') === dx[direction] && neighbour.get('y') === dy[direction];
        });

        return neighbour;
      }
    });
});
