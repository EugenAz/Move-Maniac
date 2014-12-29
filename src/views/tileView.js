define([
  'backbone',
  'libs/timeManager',
  'constants'
], function (
  Backbone,
  TimeManager,
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
      this.model.on('change:x change:y', this.render, this);
      this.model.on('change:type', this._changeType, this);
      this.model.on('destroy', this._destroy, this);
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
    _changeType: function (model) {
      this.$el.removeClass('tile-type-' + model.previousAttributes().type);
      this.$el.addClass('tile-type-' + model.get('type'));
    },
    _destroy: function () {
      this.remove();
    },
    _onDragInit: function (e) {
      var dragHandler,
          moveEvent;

      if (TimeManager.getState() === constants.state.IDLE) {
        // TimeManager.setState(constants.state.INPROCESS);
        dragHandler = _.bind(this._onDrag, this);

        this.undelegateEvents();
        setTimeout(this.delegateEvents.bind(this), constants.theme.animationDuration * 1000);

        this.initX = this._getMousePosition(e, 'X');
        this.initY = this._getMousePosition(e, 'Y');

        moveEvent = this.touchable ? 'touchmove' : 'mousemove';

        this.$el
              .attr('draggable', 'false')
              .on(moveEvent, _.debounce(dragHandler, 100, {
                leading: false,
                trailing: true
              }));
      }
    },
    _onDrag: function (e) {
      var x = this._getMousePosition(e, 'X'),
          y = this._getMousePosition(e, 'Y');

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
    _getMousePosition: function (e, coord) {
      coord = coord.toUpperCase();
      return e['client' + coord] ? e['client' + coord] : e.originalEvent.touches[0]['page' + coord];
    },
    _stopDragging: function () {
      this.$el.off(this.touchable ? 'touchmove' : 'mousemove');
    }
  });
});
