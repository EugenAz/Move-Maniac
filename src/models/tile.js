define([
  'backbone'
], function (
  Backbone
) {
  'use strict';

  var TileModel = Backbone.Model.extend({
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
          this.moveTo(this.get('x'), this.get('y') - 1);
          break;
        case 'right':
          this.moveTo(this.get('x') + 1, this.get('y'));
          break;
        case 'down':
          this.moveTo(this.get('x'), this.get('y') + 1);
          break;
        case 'left':
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
