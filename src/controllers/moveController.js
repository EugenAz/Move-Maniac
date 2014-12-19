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

          console.log('before first tick');
          var intervalID = setInterval(function () {
            console.log('tick');
            removedTiles = this.tiles.removeSelected(combos);
            this.tiles.createSubstitutions(removedTiles);

            setTimeout(function () {
              console.log('tick and drop');
              this.tiles.dropTilesIntoPositions(removedTiles);

              if (! (combos = this.wholeFieldComboCheck()) ) {
                clearInterval(intervalID);
              }
            }.bind(this), 500);

          }.bind(this), 700);

          // do {
          //   // TODO: Add delay for animation
          //   removedTiles = this.tiles.removeSelected(combos);
          //   this.tiles.createSubstitutions(removedTiles);
          //   this.tiles.dropTilesIntoPositions(removedTiles);
          // } while (combos = this.wholeFieldComboCheck());
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
      this._tempTiles = {};

      this.tiles.models.forEach(function (tile) {
        this._tempTiles[tile.get('y')] = this._tempTiles[tile.get('y')] || {};
        this._tempTiles[tile.get('y')][tile.get('x')] = {
          id: tile.cid,
          type: tile.get('type')
        };
      }.bind(this));

      combos = this._getCombos();

      delete this._tempTiles;
      return combos.length > 0 ? combos : false;
    },
    _getCombos: function () {
      var horizontalCombos = [],
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

      return this._getCrossCombos(horizontalCombos, verticalCombos);
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
        options.tempCombo.push(i, j, this._tempTiles[i][j]);
      } else {
        if (!options.tempCombo.lastTile() || !this._tempTiles[i][j]) debugger;
        if (options.tempCombo.lastTile().type === this._tempTiles[i][j].type) {
          options.tempCombo.push(i, j, this._tempTiles[i][j]);
        } else {
          if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.export());
          options.tempCombo.flush(i, j, this._tempTiles[i][j]);
        }
      }

      if (i === this.playGround.size - 1 && j === this.playGround.size - 1) {
        if (options.tempCombo.length >= 3) options.combos.push(options.tempCombo.export());
        options.tempCombo.flush();
      }
    },
    _getCrossCombos: function (aCombos, bCombos) {
      // TODO: find all matching coords in combos
      var matches = false,
          cCombos = [];

      for(var i = 0, alength = aCombos.length; i < alength; ++i) {
        if (aCombos[i]) {
          for (var aCoord in aCombos[i].coords) {

            for(var j = 0, blength = bCombos.length; j < blength; ++j) {
              var coords;

              if (aCombos[i] && aCombos[i] === bCombos[j]) {
                bCombos.splice(j--, 1);
                break;
              }

              coords = bCombos[j] ? Object.keys(bCombos[j].coords) : [];

              if (~coords.indexOf(aCoord)) {
                matches = true;

                if (cCombos.length && ~Object.keys(cCombos[cCombos.length - 1].coords).indexOf(aCoord)) {
                  cCombos[cCombos.length - 1] = Combo.mergeCombos(cCombos[cCombos.length - 1], bCombos[j]);
                  bCombos.splice(j--, 1);
                } else {
                  cCombos.push(Combo.mergeCombos(aCombos[i], bCombos[j]));
                  aCombos.splice(i--, 1);
                  bCombos.splice(j--, 1);
                }
              }
            }
          }
        }
      }

      if (matches) {
        aCombos = cCombos.concat(aCombos).concat(bCombos);
        bCombos = aCombos.slice(0);
        return this._getCrossCombos(aCombos, bCombos);
      } else {
        return aCombos.concat(bCombos);
      }
    },
    checkMoveCombo: function () {}
  };

  return MoveController;
});
