"use strict";

angular.module('app.services.Upload', [])
  .factory('UploadService', ($q, Config) => {

    let request = require('request');
    let url = Config.getConfig().url;
    let key = Config.getConfig().key;

    return {
      upload(data) {
        let q = $q.defer();
        data.key = key;

        request.post({
          url: url + '/uploads',
          formData: data
          //formData: data
        }, (err, res, body) => {
          if (err) q.reject(err);
          else {
            let result = JSON.parse(body);
            if (result.ok) {
              q.resolve()
            } else {
              q.reject(result.msg)
            }
          }
        });

        return q.promise;
      }
    }
  });
