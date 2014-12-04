define([
  'controllers/playGroundController'
], function(
  PlayGroundController
) {
  'use strict';
  var GameRoundController = function (options) {
    this.size = options && options.size || 5;
    this.typeAmount = options && options.typeAmount || 4;
  };

  GameRoundController.prototype.startRound = function (gameEl) {
    var playGround = new PlayGroundController({
      size: this.size,
      typeAmount: this.typeAmount,
      rootEl: gameEl
    });

    playGround.init();
  };

  return GameRoundController;
});
