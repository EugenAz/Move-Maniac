define([
  'backbone',
  'jss',
  'views/tileView',
  'constants'
], function(
  Backbone,
  jss,
  TileView,
  constants
) {
  'use strict';

  return Backbone.View.extend({
    id: 'playGround',
    initialize: function (options) {
      this.size = options.size;
      this.typeAmount = options.typeAmount;
    },
    render: function (tiles) {
      this._setPlayGroundSize();
      this._setTransitionDuration();

      _(tiles.models).each(function (tile) {
        this.addTile(tile);
      }.bind(this));

      return this;
    },
    addTile: function (tile) {
      var tileView;

      tileView = new TileView({
        model: tile
      });

      tileView.on('move', function (options) {
        this.trigger('move', options);
      }, this);

      this.$el.append(tileView.render().el);
    },
    _setTransitionDuration: function () {
      jss.createStyleSheet({
        '.tile': {
          'transition-duration': constants.theme.animationDuration + 's'
        }
      }).attach();
    },
    _setPlayGroundSize: function () {
      _(['width', 'height']).each(function (prop) {
        this.$el.css(prop, (this.size * constants.theme.tileSizePx) + ((this.size - 1) * constants.theme.tileMarginPx));
      }.bind(this));
    }
  });
});
