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
        size: 4,
        typeAmount: 3
      });

      var gameView = new GameView();

      gameRound.startRound(gameView.render().$el);
    };

    return GameController;
});
