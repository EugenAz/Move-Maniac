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
        size: 5,
        typeAmount: 4
      });

      var gameView = new GameView();

      gameRound.startRound(gameView.render().$el);
    };

    return GameController;
});
