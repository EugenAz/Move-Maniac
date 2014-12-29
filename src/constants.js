define(function () {
  var constants = {
    theme: {
      tileSizePx: 100,
      tileMarginPx: 5,
      animationDuration: .3 // seconds
    },
    state: {
      INPROCESS: 'INPROCESS',
      IDLE: 'IDLE'
    },
    movement: {
      UP: 'UP',
      RIGHT: 'RIGHT',
      DOWN: 'DOWN',
      LEFT: 'LEFT',
      opposite: {
        UP: 'DOWN',
        RIGHT: 'LEFT',
        DOWN: 'UP',
        LEFT: 'RIGHT'
      }
    }
  };

  return constants;
});
