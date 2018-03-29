const MongoClient = require('mongodb').MongoClient;
 
// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
const PROD_URI = "mongodb://username:password@ds113849.mlab.com:13849/chatapp"
//const PROD_URI = "mongodb://localhost:27017/dbs"
 
function connect(url) {
  return MongoClient.connect(url).then(client => client.db())
}
 
module.exports = async function() {
  let databases = await Promise.all([connect(PROD_URI)])
 
  return {
    production: databases[0]
  }
}