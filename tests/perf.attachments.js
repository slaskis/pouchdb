"use strict";

var adapters = ["local-1"];

if (typeof module !== 'undefined' && module.exports) {
  var PouchDB = require('../lib');
  var testUtils = require('./test.utils.js');
}


adapters.map(function (adapter) {

  QUnit.module('attachment performance: ' + adapter, {
    setup : function () {
      this.name = testUtils.generateAdapterUrl(adapter);
    },
    teardown: testUtils.cleanupTestDatabases
  });

  var large = 5 * 1024 * 1024;

  var largeString = "";
  for(var i=0; i<large; i++){
    largeString += 'a';
  }

  var largeBuffer = new Buffer(large);
  for(var i=0; i<large; i++){
    largeBuffer[i] = (0xFF * Math.random()) | 0;
  }

  function map(doc) {
    /* globals emit */
    emit(null, doc);
  }

  asyncTest("Test large string attachments", function (done) {
    testUtils.initTestDB(this.name, function (err, db) {
      var queryStartTime1 = new Date().getTime();
      db.query({map: map}, function (err, response) {
        var queryDuration1 = new Date().getTime() - queryStartTime1;
        db.put({ _id: 'doc1' }, function (err, resp) {
          var writeStartTime1 = Date.now();
          db.putAttachment('doc1', 'string1', resp.rev, largeString, 'text/plain', function (err, res) {
            var writeDuration1 = Date.now() - writeStartTime1;
            db.put({ _id: 'doc2' }, function (err, resp) {
              var writeStartTime2 = Date.now();
              db.putAttachment('doc2','string2', resp.rev, largeString, 'text/plain', function (err, res) {
                var writeDuration2 = Date.now() - writeStartTime2;
                var queryStartTime2 = new Date().getTime();
                db.query({map: map}, function (err, response) {
                  var queryDuration2 = new Date().getTime() - queryStartTime2;
                  console.log("write doc1/string1 took " + writeDuration1 + " ms");
                  console.log("write doc2/string2 took " + writeDuration2 + " ms");
                  console.log("query before attachments took " + queryDuration1 + " ms");
                  console.log("query after attachments took " + queryDuration2 + " ms");
                  ok(queryDuration2 <= queryDuration1 * 10, 'Query finished within order of magnitude');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  asyncTest("Test large buffer attachments", function (done) {
    testUtils.initTestDB(this.name, function (err, db) {
      var queryStartTime1 = new Date().getTime();
      db.query({map: map}, function (err, response) {
        var queryDuration1 = new Date().getTime() - queryStartTime1;
        db.put({ _id: 'doc1' }, function (err, resp) {
          var writeStartTime1 = Date.now();
          db.putAttachment('doc1', 'buffer1', resp.rev, largeBuffer, 'application/octet-stream', function (err, res) {
            var writeDuration1 = Date.now() - writeStartTime1;
            db.put({ _id: 'doc2' }, function (err, resp) {
              var writeStartTime2 = Date.now();
              db.putAttachment('doc2','buffer2', resp.rev, largeBuffer, 'application/octet-stream', function (err, res) {
                var writeDuration2 = Date.now() - writeStartTime2;
                var queryStartTime2 = new Date().getTime();
                db.query({map: map},function (err, response) {
                  var queryDuration2 = new Date().getTime() - queryStartTime2;
                  console.log("write doc1/buffer1 took " + writeDuration1 + " ms");
                  console.log("write doc2/buffer2 took " + writeDuration2 + " ms");
                  console.log("query before attachments took " + queryDuration1 + " ms");
                  console.log("query after attachments took " + queryDuration2 + " ms");
                  ok(queryDuration2 <= queryDuration1 * 10, 'Query finished within order of magnitude');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  asyncTest("Test large string and buffer attachments", function (done) {
    testUtils.initTestDB(this.name, function (err, db) {
      var queryStartTime1 = new Date().getTime();
      db.query({map: map}, function (err, response) {
        var queryDuration1 = new Date().getTime() - queryStartTime1;
        db.put({ _id: 'doc1' }, function (err, resp) {
          var writeStartTime1 = Date.now();
          db.putAttachment('doc1', 'string1', resp.rev, largeString, 'text/plain', function (err, res) {
            var writeDuration1 = Date.now() - writeStartTime1;
            db.put({ _id: 'doc2' }, function (err, resp) {
              var writeStartTime2 = Date.now();
              db.putAttachment('doc2','buffer1', resp.rev, largeBuffer, 'application/octet-stream', function (err, res) {
                var writeDuration2 = Date.now() - writeStartTime2;
                var queryStartTime2 = new Date().getTime();
                db.query({map: map},function (err, response) {
                  var queryDuration2 = new Date().getTime() - queryStartTime2;
                  console.log("write doc1/string1 took " + writeDuration1 + " ms");
                  console.log("write doc2/buffer1 took " + writeDuration2 + " ms");
                  console.log("query before attachments took " + queryDuration1 + " ms");
                  console.log("query after attachments took " + queryDuration2 + " ms");
                  ok(queryDuration2 <= queryDuration1 * 10, 'Query finished within order of magnitude');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  // Currently fails by timing out. Probably because of https://github.com/daleharvey/pouchdb/issues/1287
  // asyncTest("Test large string and buffer attachments in one doc", function (done) {
  //   testUtils.initTestDB(this.name, function (err, db) {
  //     var queryStartTime1 = new Date().getTime();
  //     db.query({map: map}, function (err, response) {
  //       ok(!err,'no errors');
  //       var queryDuration1 = new Date().getTime() - queryStartTime1;
  //       db.put({ _id: 'doc1' }, function (err, resp) {
  //         ok(!err,'no errors');
  //         var writeStartTime1 = Date.now();
  //         db.putAttachment('doc1', 'string1', resp.rev, largeString, 'text/plain', function (err, res) {
  //           ok(!err,'no errors');
  //           var writeDuration1 = Date.now() - writeStartTime1;
  //           var writeStartTime2 = Date.now();
  //           db.putAttachment('doc1', 'buffer1', res.rev, largeBuffer, 'application/octet-stream', function (err, res) {
  //             ok(!err,'no errors');
  //             var writeDuration2 = Date.now() - writeStartTime2;
  //             var queryStartTime2 = new Date().getTime();
  //             db.query({map: map},function (err, response) {
  //               ok(!err,'no errors');
  //               var queryDuration2 = new Date().getTime() - queryStartTime2;
  //               console.log("write doc1/string1 took " + writeDuration1 + " ms");
  //               console.log("write doc1/buffer1 took " + writeDuration2 + " ms");
  //               console.log("query before attachments took " + queryDuration1 + " ms");
  //               console.log("query after attachments took " + queryDuration2 + " ms");
  //               ok(queryDuration2 <= queryDuration1 * 10, 'Query finished within order of magnitude');
  //               done();
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  // });

});
