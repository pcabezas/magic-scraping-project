// getting-started.js
const mongoose = require('mongoose');


const dbConnection = async () => {
  try {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env
    await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}`,{
      auth: {
        authSource: "admin"
      },
      user: DB_USER,
      pass: DB_PASSWORD
    });

  } catch (error) {
    console.log(error)
    throw `Unable to connect to database ${error}`
  }
}

module.exports = {
  dbConnection
}