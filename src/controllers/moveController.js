define([
  'constants',
  'libs/combos'
], function (
  constants,
  Combos
) {
  'use strict';

  var oppositeDirection = {
    'up': 'down',
    'right': 'left',
    'down': 'up',
    'left': 'right'
  };

  function MoveController (playGround) {
    this.playGround = playGround;
  }

  MoveController.prototype = {
    getDragDirection: function (deltaX, deltaY) {
      if ( deltaX === 0 || (deltaY !== 0 && Math.abs(deltaX) < Math.abs(deltaY)) ) {
        if ( deltaY > 0 ) {
          return 'up';
        } else {
          return 'down';
        }
      } else {
        if ( deltaX < 0 ) {
          return 'right';
        } else {
          return 'left';
        }
      }
    },
    init: function (options) {
      var tile,
          direction,
          neighbour,
          removedTiles,
          combos;

      this.tiles = this.playGround.tiles;

      tile = options.model;
      direction = this.getDragDirection(
                    options.coords.X0 - options.coords.X1,
                    options.coords.Y0 - options.coords.Y1);

      if (tile.canMove(direction, this.playGround.size)) {
        neighbour = this.tiles.findNeighbour(tile, direction);
        neighbour.move(oppositeDirection[direction]);
        tile.move(direction);

        if (combos = this.wholeFieldComboSearch()) { // TODO: checkMoveCombo
          var intervalID = setInterval(function () {
            removedTiles = this.tiles.removeSelected(combos);
            this.tiles.createSubstitutions(removedTiles);

            // TODO: add global animation and timing control

            setTimeout(function () {
              this.tiles.dropTilesIntoPositions(removedTiles);

              if (! (combos = this.wholeFieldComboSearch()) ) {
                clearInterval(intervalID);
              }
            }.bind(this), 500);

          }.bind(this), 700);
        } else {
          setTimeout(function () {
            neighbour.move(direction);
            tile.move(oppositeDirection[direction]);
          }, constants.theme.animationDuration * 1000);
        }
      }
    },
    wholeFieldComboSearch: function () {
      var combos = [];

      combos = Combos.get({
        tiles: this.tiles.format('rows'),
        playGroundSize: this.playGround.size
      });

      return combos.length > 0 ? combos : false;
    },
    checkMoveCombo: function () {}
  };

  return MoveController;
});
