require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb')
// Init Database URI and other options
const client = new MongoClient(process.env.MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Expose for global use (mongoDB)
var dbConnection: null

// Handle connections
module.exports = {
  connectToDB: async (dbName = undefined, callback: Function) => {
    return await client.connect()
      .then((client: { db: Function }) => {
        dbConnection = client.db(dbName)
        return callback()
      })
      .catch((err: null) => {
        return callback(err)
      })
  },
  mongoDB: () => dbConnection
}