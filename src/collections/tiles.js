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
        var size = options.size,
            typeAmount = options.typeAmount,
            tile;

        for (var i = 0; i < size; i++) {
          for (var j = 0; j < size; j++) {
            tile = new Tile({
              x: i,
              y: j,
              type: Tile.getRandomType(typeAmount)
            });

            this.add(tile);
          }
        }

        return this;
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
          return neighbour.get('x') === dx[direction] && neighbour.get('y') === dy[direction]
        });

        return neighbour;
      }
    });
});
