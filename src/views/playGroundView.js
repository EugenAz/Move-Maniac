define([
  'jss',
  'backbone',
  'views/tileView',
  'constants'
], function(
  jss,
  Backbone,
  TileView,
  constants
) {
  'use strict';

  return Backbone.View.extend({
    id: 'playGround',
    initialize: function (options) {
      this.size = options.size;
      this.typeAmount = options.typeAmount;
      // TODO event triggers for tiles changing destroying adding...
    },
    render: function (tiles) {
      var tileView;
      _(['width', 'height']).each(function (prop) {
        this.$el.css(prop, (this.size * constants.theme.tileSizePx) + ((this.size - 1) * constants.theme.tileMarginPx));
      }.bind(this));

      _(tiles.models).each(function (tile) {
        tileView = new TileView({
          model: tile
        });

        tileView.on('move', function (options) {
          this.trigger('move', options);
        }.bind(this));

        this.$el.append(tileView.render().el);
      }.bind(this));

      jss.createStyleSheet({
        '.tile': {
          'transition-duration': constants.theme.animationDuration + 's'
        }
      }).attach();

      return this;
    }
  });
});
