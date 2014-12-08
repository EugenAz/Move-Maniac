define([
  'backbone',
  'constants'
], function (
  Backbone,
  constants
) {
  'use strict';

  return Backbone.View.extend({
    className: 'tile',
    events: {
      // http://xavi.co/articles/trouble-with-touch-events-jquery
      'mousedown': '_onDragInit',
      'touchstart': '_onDragInit',
      'mouseup': '_stopDragging',
      'touchend': '_stopDragging'
    },
    initX: 0,
    initY: 0,
    initialize: function () {
      this.touchable = 'ontouchstart' in window;

      this.model.on('change:x change:y', this.render.bind(this));
    },
    _coordToSize: function (coord) {
      return coord * (constants.theme.tileSizePx + constants.theme.tileMarginPx);
    },
    render: function () {
      var x = this.model.get('x'),
          y = this.model.get('y');

      this.$el
          .attr({
            'draggable': true,
            'data-x': x,
            'data-y': y
          })
          .addClass('tile-type-' + this.model.get('type'))
          .css({
            width: constants.theme.tileSizePx,
            height: constants.theme.tileSizePx,
            transform: 'translate(' + this._coordToSize(x) + 'px, ' + this._coordToSize(y) + 'px)'
          });
      return this;
    },
    _onDragInit: function (e) {
      var dragHandler = _.bind(this._onDrag, this),
          moveEvent;

      this.undelegateEvents();
      setTimeout(this.delegateEvents.bind(this), constants.theme.animationDuration * 1000);

      this.initX = e.clientX ? e.clientX : e.originalEvent.touches[0].pageX;
      this.initY = e.clientY ? e.clientY : e.originalEvent.touches[0].pageY;

      moveEvent = this.touchable ? 'touchmove' : 'mousemove';

      this.$el
            .attr('draggable', 'false')
            .on(moveEvent, _.debounce(dragHandler, 100, {
              leading: false,
              trailing: true
            }));
    },
    _onDrag: function (e) {
      var x = e.clientX ? e.clientX : e.originalEvent.touches[0].pageX,
          y = e.clientY ? e.clientY : e.originalEvent.touches[0].pageY;

      if (x !== this.initX || y !== this.initY) {
        this._stopDragging();

        this.trigger('move', {
          model: this.model,
          coords: {
            X0: this.initX,
            Y0: this.initY,
            X1: x,
            Y1: y
          }
        });
      }
    },
    _stopDragging: function () {
      this.$el.off(this.touchable ? 'touchmove' : 'mousemove');
    }
  });
});
