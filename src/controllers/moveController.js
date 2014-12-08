define([
  'constants',
  'libs/combo'
], function (
  constants,
  Combo
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
      var combos = [];
      this.tiles = {};

      this.playGround.tiles.models.forEach(function (tile) {
        this.tiles[tile.get('y')] = this.tiles[tile.get('y')] || {};
        this.tiles[tile.get('y')][tile.get('x')] = {
          id: tile.cid,
          type: tile.get('type')
        };
      }.bind(this));

      combos = this._getCombos();
      // TODO: do something with combos

      delete this.tiles;
    },
    _getCombos: function () {
      var combos = [],
          horizontalCombos = [],
          verticalCombos = [],
          horizontalTempCombo = new Combo(),
          verticalTempCombo = new Combo(),
          i, j;

      for (i = 0; i < this.playGround.size; i++) {
        for (j = 0; j < this.playGround.size; j++) {
          this._getLineComboStep(i, j, {
            combos: horizontalCombos,
            tempCombo: horizontalTempCombo,
          });

          this._getLineComboStep(i, j, {
            combos: verticalCombos,
            tempCombo: verticalTempCombo,
            reverse: true
          });
        }
      }

      return {
        verticalCombos: verticalCombos,
        horizontalCombos: horizontalCombos
      };
    },
    _getLineComboStep: function (i, j, options) {
      var ij;

      if (i !== 0 && j === 0) {
        if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.get());
        options.tempCombo.flush();
      }

      if (options.reverse) {
        ij = i; i = j; j = ij;
      }

      if (options.tempCombo.isEmpty()) {
        options.tempCombo.push(i, j, this.tiles[i][j]);
      } else {
        if (options.tempCombo.lastTile().type === this.tiles[i][j].type) {
          options.tempCombo.push(i, j, this.tiles[i][j]);
        } else {
          if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.get());
          options.tempCombo.flush(i, j, this.tiles[i][j]);
        }
      }
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
