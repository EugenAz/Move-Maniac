define([
  'backbone',
  'constants'
], function (
  Backbone,
  constants
) {
  'use strict';

  var TileModel = Backbone.Model.extend({
    canMove: function (direction, playGroundSize) {
      switch (direction) {
        case constants.movement.UP:
          return this.get('y') >= 1;
        case constants.movement.RIGHT:
          return this.get('x') <= playGroundSize - 2;
        case constants.movement.DOWN:
          return this.get('y') <= playGroundSize - 2;
        case constants.movement.LEFT:
          return this.get('x') >= 1;
      }
    },
    move: function (direction) {
      switch (direction) {
        case constants.movement.UP:
          this.moveTo(this.get('x'), this.get('y') - 1);
          break;
        case constants.movement.RIGHT:
          this.moveTo(this.get('x') + 1, this.get('y'));
          break;
        case constants.movement.DOWN:
          this.moveTo(this.get('x'), this.get('y') + 1);
          break;
        case constants.movement.LEFT:
          this.moveTo(this.get('x') - 1, this.get('y'));
          break;
      }
    },
    moveTo: function (x, y) {
      this.set({
        x: x,
        y: y
      });

      return this;
    }
  });

  return TileModel;
});
