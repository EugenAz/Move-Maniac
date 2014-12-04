require.config({
  baseUrl: 'src',
  paths: {
    jss: '../libs/jss.min',
    jquery: '../libs/jquery-2.1.1.min',
    underscore: '../libs/lodash.compat.min',
    backbone: '../libs/backbone-min'
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    jss: {
      exports: 'jss'
    }
  }
});

/*
  TODO:
  1. sync models and collections with localStorage
*/

require([
  'controllers/gameController'
], function(
  GameController
) {
  var GameController = new GameController();
  GameController.startGame();
});
