'use strict';

((window, angular) => {

  angular.module('app.services.Search', [])
  .factory('SearchService', ($q, Config) => {

    let db = Config.getMySQLConnection();

    return {

      searchByFirstLastName(fname, lname) {
        let q = $q.defer();

        let _fname = `${fname}%`;
        let _lname = `${lname}%`;

        db('patient as p')
          .select('p.hn', db.raw('concat(p.pname, p.fname, " ", p.lname) as fullname'))
          .where('p.fname', 'like', _fname)
          .where('p.lname', 'like', _lname)
          .limit(20)
          .then((rows) => {
            q.resolve(rows)
          })
          .catch((err) => {
            q.reject(err)
          });

        return q.promise;
      },

      searchByFirst(fname, lname) {
        let q = $q.defer();

        let _fname = `${fname}%`;

        db('patient as p')
          .select('p.hn', db.raw('concat(p.pname, p.fname, " ", p.lname) as fullname'))
          .where('p.fname', 'like', _fname)
          .limit(20)
          .then((rows) => {
            q.resolve(rows)
          })
          .catch((err) => {
            q.reject(err)
          });

        return q.promise;
      },

      getOpd(hn) {
        let q = $q.defer();

        let sql = `
        select o.vn, o.hn, o.vstdate, o.vsttime, sp.name as spclty_name
        from ovst as o
        left join spclty as sp on sp.spclty=o.spclty
        where o.hn=? order by o.vstdate desc
        limit 20`;

        db.raw(sql, [hn])
          .then((rows) => {
            q.resolve(rows[0])
          })
          .catch((err) => {
            q.reject(err)
          });

        return q.promise;
      },

      getIpd(hn) {
        let q = $q.defer();

        let sql = `
        select i.hn, i.an, i.regdate, i.regtime, w.name as ward_name
        from ipt as i
        left join ward as w on w.ward=i.ward
        where i.hn=?
        order by i.an desc
        limit 20`;

        db.raw(sql, [hn])
          .then((rows) => {
            q.resolve(rows[0])
          })
          .catch((err) => {
            q.reject(err)
          });

        return q.promise;
      }
    }
  })

})(window, window.angular);