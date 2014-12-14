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
          };

        this.tiles = new Tiles(),
        this.tiles.create(options);

        this.playGroundView = new PlayGroundView(options);

        this.playGroundView.on('move', this.movement.handler.bind(this.movement));

        this.tiles.on('add', this.playGroundView.addTile.bind(this.playGroundView));

        this.rootEl.append(this.playGroundView.render(this.tiles).el);
      },
      _onTileAdd: function (tile, tiles, options) {
        this.playGroundView.addTile(tile);
      }
    };

    return PlayGroundController;
});
