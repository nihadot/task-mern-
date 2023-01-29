const MongoClient = require('mongodb').MongoClient
const state = {
    db: null
}
module.exports.connect = ((callback) => {
    const url = 'mongodb://localhost:27017'
    const dbname = 'hospitalAdministaration' 

    MongoClient.connect(url, (err, data) => {
        if (err)
            return callback(err)
        state.db = data.db(dbname)
        callback()
    })
})


module.exports.get = () => {
    return state.db
}