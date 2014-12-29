define([
  'q',
  'constants',
  'libs/combos',
  'libs/timeManager'
], function (
  q,
  constants,
  Combos,
  TimeManager
) {
  'use strict';

  function MoveController (playGround) {
    this.playGround = playGround;
  }

  MoveController.prototype = {
    getDragDirection: function (deltaX, deltaY) {
      if ( deltaX === 0 || (deltaY !== 0 && Math.abs(deltaX) < Math.abs(deltaY)) ) {
        if ( deltaY > 0 ) {
          return constants.movement.UP;
        } else {
          return constants.movement.DOWN;
        }
      } else {
        if ( deltaX < 0 ) {
          return constants.movement.RIGHT;
        } else {
          return constants.movement.LEFT;
        }
      }
    },
    init: function (options) {
      var tile,
          direction,
          neighbour,
          // removedTiles,
          combos;

      this.tiles = this.playGround.tiles;

      tile = options.model;
      direction = this.getDragDirection(
                    options.coords.X0 - options.coords.X1,
                    options.coords.Y0 - options.coords.Y1);

      if (tile.canMove(direction, this.playGround.size)) {
        neighbour = this.tiles.findNeighbour(tile, direction);
        neighbour.move(constants.movement.opposite[direction]);
        tile.move(direction);

        if (combos = this.wholeFieldComboSearch()) { // TODO: checkMoveCombo
          TimeManager.setState(constants.state.INPROCESS);

          var intervalID = setInterval(function () {
            var _this = this;
            TimeManager.timeOut(function () {
              var removedTiles = _this.tiles.removeSelected(combos);
              _this.tiles.createSubstitutions(removedTiles);
              return removedTiles;
            }, constants.theme.animationDuration * 2000)
            .then(function (removedTiles) {
              TimeManager.timeOut(function () {
                _this.tiles.dropTilesIntoPositions(removedTiles);

                if (! (combos = _this.wholeFieldComboSearch()) ) {
                  clearInterval(intervalID);
                }
              }, constants.theme.animationDuration * 1000)
              .then(function () {
                TimeManager.setState(constants.state.IDLE);
              });
            });
          }.bind(this), constants.theme.animationDuration * 3000)
        } else {
          TimeManager.timeOut(function () {
            neighbour.move(direction);
            tile.move(constants.movement.opposite[direction]);
          }, constants.theme.animationDuration * 1000).then(function () {
            TimeManager.setState(constants.state.IDLE);
          });
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
