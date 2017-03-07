var MongoClient = require('mongodb').MongoClient

function getConnectionString(connection_string) {


   // var connection_string = "mongodb://mawmaw:ranky1337@ds119748.mlab.com:19748/ranky"
    var connection_string = "mongodb://mawmaw:ranky1337@ds119508.mlab.com:19508/testranky"

  return connection_string;
}
var connection;

var connect = function(connectionString, done) {
  if (connection) return done();
  var url = getConnectionString(connectionString);
  console.log(url);
  MongoClient.connect(url, function(err, db) {
    if (err){
      return done(err);
    }
    connection = db;
    done();
  })
}
var get = function() {
  return connection;
}
var close = function(done) {
  if (connection) {
    connection.close(function(err, result) {
      connection= null;
      done(err,result)
    })
  }
}
module.exports.connect = connect;
module.exports.get = get;
module.exports.close = close;
