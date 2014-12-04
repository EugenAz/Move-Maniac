define([
  'backbone'
], function (
  Backbone
) {
    'use strict';

    var TileModel = Backbone.Model.extend({
      initialize: function () {
        // TODO set position here
      },
      canMove: function (direction, playGroundSize) {
        switch (direction) {
          case 'up':
            return this.get('y') >= 1;
          case 'right':
            return this.get('x') <= playGroundSize - 2;
          case 'down':
            return this.get('y') <= playGroundSize - 2;
          case 'left':
            return this.get('x') >= 1;
        }
      },
      move: function (direction) {
        switch (direction) {
          case 'up':
            this.set('y', this.get('y') - 1);
            break;
          case 'right':
            this.set('x', this.get('x') + 1);
            break;
          case 'down':
            this.set('y', this.get('y') + 1);
            break;
          case 'left':
            this.set('x', this.get('x') - 1);
            break;
        }
      }
    });

    TileModel.getRandomType = function (typeAmount) {
      return _.random(1, typeAmount);
    }

    return TileModel;
});
