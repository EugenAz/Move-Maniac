define([
  'constants'
], function (
  constants
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
    handler: function (options) {
      var tile,
          direction,
          canMove,
          neighbour,
          removedTiles;

      tile = options.model;
      direction = this.getDragDirection(options.coords.X0 - options.coords.X1, options.coords.Y0 - options.coords.Y1);
      canMove = tile.canMove(direction, this.playGround.size);

      if (canMove) {
        neighbour = this.playGround.tiles.findNeighbour(tile, direction);
        neighbour.move(oppositeDirection[direction]);
        tile.move(direction);

        if (this.wholeFieldComboCheck()) { // TODO: checkMoveCombo
          removedTiles = this.removeComboTiles();
          this.fillInPlayGround(removedTiles);
        } else {
          setTimeout(function () {
            neighbour.move(direction);
            tile.move(oppositeDirection[direction]);
          }, constants.theme.animationDuration * 1000);
        }

      }
    },
    wholeFieldComboCheck: function () {
      var hCombos = [],
          vCombos = [];

      this.tiles = {};

      this.playGround.tiles.models.forEach(function (tile) {
        this.tiles[tile.get('x')] = this.tiles[tile.get('x')] || {};
        this.tiles[tile.get('x')][tile.get('y')] = {
          id: tile.cid,
          type: tile.get('type')
        };
      }.bind(this));

      hCombos = this._getHCombos();

      // for (var i = 0; i < this.playGround.size; i++) {
      //   // horizontal  combos
      //   for (var j = 0; j < this.playGround.size; j++) {

      //   }
      // }
    },
    _getHCombos: function () {
      var combos = [],
          tempCombo = [],
          i, j;

      for (i = 0; i < this.playGround.size; i++) {
        for (j = 0; j < this.playGround.size; j++) {
          if (_.isEmpty(tempCombo) || tempCombo[tempCombo.length - 1] && tempCombo[tempCombo.length - 1].type === this.tiles[i][j].type) {
            tempCombo.push(this.tiles[i][j]);
          } else if (!_.isEmpty(tempCombo)) {
            if (tempCombo.length >= 3) {
              combos.push(tempCombo);
            }
            tempCombo = [];
          }
        }
      }
      debugger;
    },
    _getRowCombos: function () {

    },
    checkMoveCombo: function () {},
    removeComboTiles: function () {
      console.log('remove tiles from combo');
    },
    fillInPlayGround: function (removedTiles) {
      console.log('fill in play ground with new tiles');
    }
  };

  return MoveController;
});
