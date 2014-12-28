define([
 'libs/combo'
], function (
  Combo
) {
  'use strict';

  var tiles = {},
      playGroundSize;

  function get (options) {
    tiles = options.tiles;
    playGroundSize = options.playGroundSize;

    var horizontalCombos = [],
        verticalCombos = [],
        horizontalTempCombo = new Combo(),
        verticalTempCombo = new Combo(),
        i, j;

    for (i = 0; i < playGroundSize; i++) {
      for (j = 0; j < playGroundSize; j++) {
        _getLineComboStep(i, j, horizontalCombos, horizontalTempCombo);
        _getLineComboStep(i, j, verticalCombos, verticalTempCombo, true);
      }
    }

    return _getCrossCombos(horizontalCombos, verticalCombos);
  };

  function _getLineComboStep (i, j, combos, tempCombo, reverse) {
    var ij;

    if (i !== 0 && j === 0) {
      if (tempCombo.length >= 3) combos.push(tempCombo.export());
      tempCombo.flush();
    }

    if (reverse && i !== j) {
      ij = i; i = j; j = ij;
    }

    if ( doPushToTempCombo(tempCombo, i, j) ) {
      tempCombo.push(i, j, tiles[i][j]);
    }

    if ( doPushToCombos(tempCombo, i, j) ) {
      if (tempCombo.length >= 3) combos.push(tempCombo.export());
      tempCombo.flush(i, j, tiles[i][j]);
    }
  }

  function doPushToTempCombo (tempCombo, i, j) {
    return tempCombo.isEmpty() || tempCombo.lastTile().type === tiles[i][j].type;
  }

  function doPushToCombos(tempCombo, i, j) {
    return i === playGroundSize - 1 &&
           j === playGroundSize - 1 ||
           !tempCombo.isEmpty() &&
           tempCombo.lastTile().type !== tiles[i][j].type;
  }

  function _getCrossCombos (aCombos, bCombos) {
    var cCombos = [],
        dAI = 0,
        dBI = 0;

    _(aCombos).forEach(function (aCombo, aIndex) {
      if (dAI > 0) {
        aCombo = aCombos[aIndex - dAI];
      }

      dBI = 0;

      _(bCombos).forEach(function (bCombo, bIndex) {
        if (dBI > 0) {
          bCombo = bCombos[bIndex - dBI];
        }

        if (aCombo === bCombo) {
          bCombos.splice(bIndex - dBI, 1);
          dBI++;
        } else {
          if (_.intersection(_.toArray(aCombo.coords), _.toArray(bCombo.coords)).length) {
            if (cCombos.length && _.intersection(_.toArray(_.last(cCombos).coords), _.toArray(bCombo.coords)).length) {
              cCombos[cCombos.length - 1] = Combo.mergeCombos(cCombos[cCombos.length - 1], bCombo);
            } else {
              cCombos.push(Combo.mergeCombos(aCombo, bCombo));
              aCombos.splice(aIndex - dAI, 1);
              dAI++;

              if (~aCombos.indexOf(bCombo)) {
                aCombos.splice(aCombos.indexOf(bCombo), 1);
              }
            }

            bCombos.splice(bIndex - dBI, 1);
            dBI++;
          }
        }
      });
    });

    if (cCombos.length) {
      aCombos = cCombos.concat(aCombos).concat(bCombos);
      bCombos = _(aCombos).clone();
      return _getCrossCombos(aCombos, bCombos);
    } else {
      return _.union(aCombos, bCombos);
    }
  }

  return {
    get: get
  };
});
