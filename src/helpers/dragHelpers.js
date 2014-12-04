define([
  'constants'
], function (
  constants
) {
  'use strict';

  var movements;

  function dragHelpers (options) {
    this.$el = options.viewEl;
  }

  return dragHelpers;
});
