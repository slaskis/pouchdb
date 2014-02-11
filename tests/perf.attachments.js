"use strict";

var adapters = ["local-1"];

var testHelpers = {};
describe('performance',function(){
  describe('attachments',function(){
    adapters.map(function (adapter) {
      describe(adapter, function(){
        var db;
        beforeEach(function (done) {
          var name = testUtils.generateAdapterUrl(adapter);
          testUtils.initTestDB(name,function(err,database){
            db = database;
            done(err);
          });
        });
        afterEach(testUtils.cleanupTestDatabases);

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

        it("large string attachments", function (done) {
          var queryStartTime1 = Date.now();
          db.query({map: map}, function (err, response) {
            if( err ){ return done(err) }
            var queryDuration1 = Date.now() - queryStartTime1;
            db.put({ _id: 'doc1' }, function (err, resp) {
              if( err ){ return done(err) }
              var writeStartTime1 = Date.now();
              db.putAttachment('doc1', 'string1', resp.rev, largeString, 'text/plain', function (err, res) {
                if( err ){ return done(err) }
                var writeDuration1 = Date.now() - writeStartTime1;
                db.put({ _id: 'doc2' }, function (err, resp) {
                  if( err ){ return done(err) }
                  var writeStartTime2 = Date.now();
                  db.putAttachment('doc2','string2', resp.rev, largeString, 'text/plain', function (err, res) {
                    if( err ){ return done(err) }
                    var writeDuration2 = Date.now() - writeStartTime2;
                    var queryStartTime2 = Date.now();
                    db.query({map: map}, function (err, response) {
                      if( err ){ return done(err) }
                      var queryDuration2 = Date.now() - queryStartTime2;
                      console.log("write doc1/string1 took " + writeDuration1 + " ms");
                      console.log("write doc2/string2 took " + writeDuration2 + " ms");
                      console.log("query before attachments took " + queryDuration1 + " ms");
                      console.log("query after attachments took " + queryDuration2 + " ms");
                      queryDuration2.should.be.below(0);
                      done();
                    });
                  });
                });
              });
            });
          });
        });

        it("large buffer attachments", function (done) {
          var queryStartTime1 = Date.now();
          db.query({map: map}, function (err, response) {
            if( err ){ return done(err) }
            var queryDuration1 = Date.now() - queryStartTime1;
            db.put({ _id: 'doc1' }, function (err, resp) {
              if( err ){ return done(err) }
              var writeStartTime1 = Date.now();
              db.putAttachment('doc1', 'buffer1', resp.rev, largeBuffer, 'application/octet-stream', function (err, res) {
                if( err ){ return done(err) }
                var writeDuration1 = Date.now() - writeStartTime1;
                db.put({ _id: 'doc2' }, function (err, resp) {
                  if( err ){ return done(err) }
                  var writeStartTime2 = Date.now();
                  db.putAttachment('doc2','buffer2', resp.rev, largeBuffer, 'application/octet-stream', function (err, res) {
                    if( err ){ return done(err) }
                    var writeDuration2 = Date.now() - writeStartTime2;
                    var queryStartTime2 = Date.now();
                    db.query({map: map},function (err, response) {
                      if( err ){ return done(err) }
                      var queryDuration2 = Date.now() - queryStartTime2;
                      console.log("write doc1/buffer1 took " + writeDuration1 + " ms");
                      console.log("write doc2/buffer2 took " + writeDuration2 + " ms");
                      console.log("query before attachments took " + queryDuration1 + " ms");
                      console.log("query after attachments took " + queryDuration2 + " ms");
                      queryDuration2.should.be.below(Math.max(1,queryDuration1 * 10));
                      done();
                    });
                  });
                });
              });
            });
          });
        });

        it("large string and buffer attachments", function (done) {
          var queryStartTime1 = Date.now();
          db.query({map: map}, function (err, response) {
            if( err ){ return done(err) }
            var queryDuration1 = Date.now() - queryStartTime1;
            db.put({ _id: 'doc1' }, function (err, resp) {
              if( err ){ return done(err) }
              var writeStartTime1 = Date.now();
              db.putAttachment('doc1', 'string1', resp.rev, largeString, 'text/plain', function (err, res) {
                if( err ){ return done(err) }
                var writeDuration1 = Date.now() - writeStartTime1;
                db.put({ _id: 'doc2' }, function (err, resp) {
                  if( err ){ return done(err) }
                  var writeStartTime2 = Date.now();
                  db.putAttachment('doc2','buffer1', resp.rev, largeBuffer, 'application/octet-stream', function (err, res) {
                    if( err ){ return done(err) }
                    var writeDuration2 = Date.now() - writeStartTime2;
                    var queryStartTime2 = Date.now();
                    db.query({map: map},function (err, response) {
                      if( err ){ return done(err) }
                      var queryDuration2 = Date.now() - queryStartTime2;
                      console.log("write doc1/string1 took " + writeDuration1 + " ms");
                      console.log("write doc2/buffer1 took " + writeDuration2 + " ms");
                      console.log("query before attachments took " + queryDuration1 + " ms");
                      console.log("query after attachments took " + queryDuration2 + " ms");
                      queryDuration2.should.be.below(Math.max(1,queryDuration1 * 10));
                      done();
                    });
                  });
                });
              });
            });
          });
        });

        it("large string and buffer attachments in a single doc", function (done) {
          var queryStartTime1 = Date.now();
          db.query({map: map}, function (err, response) {
            if( err ){ return done(err) }
            var queryDuration1 = Date.now() - queryStartTime1;
            db.put({ _id: 'doc1' }, function (err, resp) {
              if( err ){ return done(err) }
              var writeStartTime1 = Date.now();
              db.putAttachment('doc1', 'string1', resp.rev, largeString, 'text/plain', function (err, res) {
                if( err ){ return done(err) }
                var writeDuration1 = Date.now() - writeStartTime1;
                var writeStartTime2 = Date.now();
                db.putAttachment('doc1', 'buffer1', res.rev, largeBuffer, 'application/octet-stream', function (err, res) {
                  if( err ){ return done(err) }
                  var writeDuration2 = Date.now() - writeStartTime2;
                  var queryStartTime2 = Date.now();
                  db.query({map: map},function (err, response) {
                    if( err ){ return done(err) }
                    var queryDuration2 = Date.now() - queryStartTime2;
                    console.log("write doc1/string1 took " + writeDuration1 + " ms");
                    console.log("write doc1/buffer1 took " + writeDuration2 + " ms");
                    console.log("query before attachments took " + queryDuration1 + " ms");
                    console.log("query after attachments took " + queryDuration2 + " ms");
                    queryDuration2.should.be.below(Math.max(1,queryDuration1 * 10));
                    done();
                  });
                });
              });
            });
          });
        });
      })
    });
  })
})