define([
  'controllers/moveController',
  'collections/tiles',
  'models/tile',
  'views/playGroundView',
  'constants'
], function (
  MoveController,
  Tiles,
  Tile,
  PlayGroundView,
  constants
) {
    'use strict';

    // TODO: eject alllogic from tileView to here maybe using MoveController

    function PlayGroundController (options) {
      this.size = options.size;
      this.typeAmount = options.typeAmount;
      this.rootEl = options.rootEl;
      this.movement = new MoveController(this);
    }

    PlayGroundController.prototype = {
      init: function () {
          var options = {
              size: this.size,
              typeAmount: this.typeAmount
            },
            playGroundView;

        this.tiles = new Tiles(),
        this.tiles.create(options);

        playGroundView = new PlayGroundView(options);

        playGroundView.on('move', this.movement.handler.bind(this.movement));

        this.rootEl.append(playGroundView.render(this.tiles).el);
      },
      initialComboCheck: function () {

      },
      checkMoveCombo: function () {

      }
    };

    return PlayGroundController;
});
