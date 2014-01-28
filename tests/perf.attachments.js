"use strict";

var adapters = ["local-1"];

if (typeof module !== undefined && module.exports) {
  var PouchDB = require('../lib');
  var testUtils = require('./test.utils.js');
}


adapters.map(function (adapter) {

  module('attachment performance: ' + adapter, {
    setup : function () {
      this.name = testUtils.generateAdapterUrl(adapter);
    }
  });

  asyncTest("Test large attachments", function () {
    var i;

    var fiveMB = "";
    for (i = 0; i < 5 * 1024 * 1024; i++) {
      fiveMB += "a";
    }

    var fiveMB2 = "";
    for (i = 0; i < 5 * 1024 * 1024; i++) {
      fiveMB2 += "b";
    }

    testUtils.initTestDB(this.name, function (err, db) {
      var queryStartTime1 = new Date().getTime();

      function map(doc) {
        /* globals emit */
        emit(null, doc);
      }

      db.query({map: map}, {reduce: false}, function (err, response) {
        var duration1 = new Date().getTime() - queryStartTime1;
        console.log("query 1 took " + duration1 + " ms");
        db.put({ _id: 'mydoc' }, function (err, resp) {
          var writeStartTime1 = Date.now();
          db.putAttachment('mydoc/mytext', resp.rev, fiveMB, 'text/plain', function (err, res) {
            var writeDuration1 = Date.now() - writeStartTime1;
            console.log("write 1 took " + writeDuration1 + " ms");
            db.put({ _id: 'mydoc2' }, function (err, resp) {
              var writeStartTime2 = Date.now();
              db.putAttachment('mydoc/mytext2', resp.rev, fiveMB2, 'text/plain', function (err, res) {
                var writeDuration2 = Date.now() - writeStartTime2;
                console.log("write 1 took " + writeDuration2 + " ms");
                var queryStartTime2 = new Date().getTime();
                db.query({map: map}, {reduce: false}, function (err, response) {
                  var duration2 = new Date().getTime() - queryStartTime2;
                  console.log("query 2 took " + duration2 + " ms");
                  ok(duration2 <= duration1 * 10, 'Query finished within order of magnitude');
                  start();
                });
              });
            });
          });
        });
      });
    });
  });

});
