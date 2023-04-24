require('dotenv').config();
const express = require('express');
const app = express()
const port = process.env.PORT || 3030
const categoriesRoutes = require('./routes/v1/categories/index');
const productsRoutes = require('./routes/v1/products/index');
const { dbConnection } = require('./database/config');
const RabbitMqConnector = require('./configs/rabbitmq');

const startProcessingRabbitMqTask = async () => {
  let rabbit = new RabbitMqConnector();
  await rabbit.init();
  rabbit.processTask('product.create');
}

// Parse request to Json Formatt
app.use(express.json());
// Define Category routes
app.use('/v1', categoriesRoutes);
// Define Product routes
app.use('/v1', productsRoutes);

// DB Connection
dbConnection();
// Init Rabbit Mq Processing task
startProcessingRabbitMqTask();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});