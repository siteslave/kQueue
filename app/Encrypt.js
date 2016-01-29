"use strict";

((window, angular) => {

  angular.module('app.tools.Encrypt', [])
  .factory('Encrypt', () => {

    const _crypto = require('crypto');
    const algorithm = 'aes-256-ctr';
    const salt = 'mANiNThEdARk';

    return {
      encrypt: (text) => {
        var cipher = _crypto.createCipher(algorithm, salt);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
      },
      decrypt: (text) => {
        var decipher = _crypto.createDecipher(algorithm, salt);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
      }
    }
  })
})(window, window.angular);