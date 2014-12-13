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
          removedTiles,
          combos;

      this.tiles = this.playGround.tiles;

      tile = options.model;
      direction = this.getDragDirection(options.coords.X0 - options.coords.X1, options.coords.Y0 - options.coords.Y1);
      canMove = tile.canMove(direction, this.playGround.size);

      if (canMove) {
        neighbour = this.tiles.findNeighbour(tile, direction);
        neighbour.move(oppositeDirection[direction]);
        tile.move(direction);

        if (combos = this.wholeFieldComboCheck()) { // TODO: checkMoveCombo
          removedTiles = this.tiles.removeSelected(combos);
          this.tiles.createSubstitutions(removedTiles);
          this.tiles.getIntoPositions(removedTiles);
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
      this.tempTiles = {};

      this.tiles.models.forEach(function (tile) {
        this.tempTiles[tile.get('y')] = this.tempTiles[tile.get('y')] || {};
        this.tempTiles[tile.get('y')][tile.get('x')] = {
          id: tile.cid,
          type: tile.get('type')
        };
      }.bind(this));

      combos = this._getCombos();

      delete this.tempTiles;
      return combos.length > 0 ? combos : false;
    },
    _getCombos: function () {
      var crossCombos = [],
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

      crossCombos = this._getCrossCombos(verticalCombos, horizontalCombos);

      return verticalCombos
              .concat(horizontalCombos).
              concat(crossCombos);
    },
    _getLineComboStep: function (i, j, options) {
      var ij;

      function _tryToCollectAndFlush () {
        if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.export());
        options.tempCombo.flush();
      }

      if (i !== 0 && j === 0) {
        if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.export());
        options.tempCombo.flush();
      }

      if (options.reverse && i !== j) {
        ij = i; i = j; j = ij;
      }

      if (options.tempCombo.isEmpty()) {
        options.tempCombo.push(i, j, this.tempTiles[i][j]);
      } else {
        if (options.tempCombo.lastTile().type === this.tempTiles[i][j].type) {
          options.tempCombo.push(i, j, this.tempTiles[i][j]);
        } else {
          if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.export());
          options.tempCombo.flush(i, j, this.tempTiles[i][j]);
        }
      }

      if (i === this.playGround.size - 1 && j === this.playGround.size - 1) {
        if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.export());
        options.tempCombo.flush();
      }
    },
    _getCrossCombos: function (verticalCombos, horizontalCombos) {
      var crossCombos = [];
      horizontalCombos.forEach(function (hCombo, hIndex) {
        for (var hCoord in hCombo.coords) {
          verticalCombos.forEach(function (vCombo, vIndex) {
            for (var vCoord in vCombo.coords) {
              if (hCoord === vCoord) {
                crossCombos.push(Combo.mergeCombos(hCombo, vCombo));
                horizontalCombos.splice(hIndex, 1);
                verticalCombos.splice(vIndex, 1);
              }
            };
          });
        }
      });

      return crossCombos;
    },
    checkMoveCombo: function () {}
  };

  return MoveController;
});
