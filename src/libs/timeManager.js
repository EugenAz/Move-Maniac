define([
  'q',
  'constants'
], function (
  q,
  constants
) {
  'use strict';
  var TimeManager = function () {
    this.state = constants.state.IDLE;
  };

  function getInstance () {
    if (!TimeManager.instance) {
      TimeManager.instance = new TimeManager();
      return TimeManager.instance;
    }
  };

  return (function () {
    var instance = getInstance();

    return {
      getState: function () {
        return instance.state;
      },
      setState: function (state) {
        return instance.state = (state in constants.state) ? state : false;
      },
      timeOut: function (callback, timeout) {
        var defer = q.defer();

        setTimeout(function () {
          var res = callback();
          defer.resolve(res);
        }, timeout);

        return defer.promise;
      }
    };
  })();
});
