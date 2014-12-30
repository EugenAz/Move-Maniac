define([
  'views/gameView',
  'controllers/gameRoundController'
], function (
  GameView,
  GameRoundController
) {
  'use strict';

  function GameController () {};

  GameController.prototype.startGame = function () {
    var gameRound = new GameRoundController({
      size: 7,
      typeAmount: 2
    });

    var gameView = new GameView();

    gameRound.startRound(gameView.render().$el);
  };

  return GameController;
});
