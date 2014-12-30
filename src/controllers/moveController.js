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
          neighbour;

      this.tiles = this.playGround.tiles;

      tile = options.model;
      direction = this.getDragDirection(
                    options.coords.X0 - options.coords.X1,
                    options.coords.Y0 - options.coords.Y1);

      if (tile.canMove(direction, this.playGround.size)) {
        neighbour = this.tiles.findNeighbour(tile, direction);
        this._gameMove(tile, neighbour, direction);

        this._comboIterations()
        .then(null, function () {
          TimeManager.timeOut(function () {
            this._gameMove(neighbour, tile, direction);
          }.bind(this), constants.theme.animationDuration * 1000)
          .then(function () {
            TimeManager.setState(constants.state.IDLE);
          });
        }.bind(this));
      }
    },
    _comboIterations: function (iteration) {
      var _this = this,
          defer = q.defer();

      TimeManager.setState(constants.state.INPROCESS);
      iteration = iteration || 0;

      this.wholeFieldComboSearch() // TODO: checkMoveCombo

      .then(function (combos) {
          return TimeManager.timeOut(function () {
            var removedTiles = _this.tiles.removeSelected(combos);
            _this.tiles.createSubstitutions(removedTiles);

            return removedTiles;
          }, constants.theme.animationDuration * 2000);
        },
        function () {
          TimeManager.setState(constants.state.IDLE);
          defer.reject(iteration);
      })

      .then(function (removedTiles) {
        return TimeManager.timeOut(function () {
          _this.tiles.dropTilesIntoPositions(removedTiles);
        }, constants.theme.animationDuration * 1000);
      })

      .then(function () {
        return _this._comboIterations(++iteration);
      })

      .done();

      return defer.promise;
    },
    _gameMove: function (tile, neighbour, direction) {
      tile.move(direction);
      neighbour.move(constants.movement.opposite[direction]);
    },
    wholeFieldComboSearch: function () {
      var combos = [],
          defer;

      defer = q.defer();

      combos = Combos.get({
        tiles: this.tiles.format('rows'),
        playGroundSize: this.playGround.size
      });

      if (combos.length > 0) {
        defer.resolve(combos);
      } else {
        defer.reject();
      }

      return defer.promise;
    },
    checkMoveCombo: function () {}
  };

  return MoveController;
});
