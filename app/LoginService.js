
"use strict";
angular.module('app.services.Login', [])
  .factory('LoginService', ($q, $http, Config) => {

    let url = Config.getConfig().url;

    return {
      doLogin (username, password) {
        let q = $q.defer();
        let options = {
          url: url + '/users/login',
          method: 'POST',
          data: {
            username: username,
            password: password
          }
        };

        $http(options)
        .success((data) => {
          if (data.ok) {
            q.resolve()
          } else {
            q.reject(data.msg)
          }
        })
        .error(() => {
          q.reject('Connection failed!')
        });

        return q.promise;
      }
    }

  });