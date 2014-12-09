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

      tile = options.model;
      direction = this.getDragDirection(options.coords.X0 - options.coords.X1, options.coords.Y0 - options.coords.Y1);
      canMove = tile.canMove(direction, this.playGround.size);

      if (canMove) {
        neighbour = this.playGround.tiles.findNeighbour(tile, direction);
        neighbour.move(oppositeDirection[direction]);
        tile.move(direction);

        if (combos = this.wholeFieldComboCheck()) { // TODO: checkMoveCombo
          // TODO: do something with combos
          // 1. list of tile coords(ids) to delete
          // 2. list of combos + qty of tiles in each combo to count score
          // 3. coord(type) of key elem of combo in case of getting a super combo (>= 4 || cross) to replace with super tile
          removedTiles = this.removeComboTiles(combos);
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

      delete this.tiles;
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
        // verticalCombos: verticalCombos,
        // horizontalCombos: horizontalCombos,
        // crossCombos: crossCombos
      // };
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
        options.tempCombo.push(i, j, this.tiles[i][j]);
      } else {
        if (options.tempCombo.lastTile().type === this.tiles[i][j].type) {
          options.tempCombo.push(i, j, this.tiles[i][j]);
        } else {
          if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.export());
          options.tempCombo.flush(i, j, this.tiles[i][j]);
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
    checkMoveCombo: function () {},
    removeComboTiles: function (combos) {
      var tile;

      combos.forEach(function (combo) {
        for (var key in combo.coords) {
          tile = this.playGround.tiles.get(combo.coords[key]);
          this.playGround.tiles.remove(tile);
          tile.destroy();
        }
      }.bind(this));
    },
    fillInPlayGround: function (removedTiles) {
      console.log('fill in play ground with new tiles');
    }
  };

  return MoveController;
});
