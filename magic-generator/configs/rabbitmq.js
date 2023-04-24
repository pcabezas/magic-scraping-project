const amqp = require('amqplib');

class RabbitMqConnector {
  constructor () {
    this.host = process.env.RABBIT_HOST;
    this.port = process.env.RABBIT_PORT;
    this.connection = null;
    this.channel = null;
  }

  async init (){
    try {
      console.log('INIT CONNECTION TO RABBIT');
      await this.setConnection();
      await this.setChannel();
      console.log('SUCCESS CONNECTION TO RABBIT');
    } catch (error) {
      console.log(`ERROR CONNECTION TO RABBIT, ${this.urlConnector()}`)
    }
  }

  async setConnection (){
    this.connection = await amqp.connect(this.urlConnector());
  }

  async setChannel (){
    this.channel = await this.connection.createChannel();
  }

  async setNewTask (queue, msgBuffer) {
    await this.channel.assertQueue(queue);
    await this.channel.sendToQueue(queue, msgBuffer);
    console.log(`Sending message to queue name ${queue}. ${msgBuffer}`);
  }

  processTask (queue){
    this.channel.consume(queue, message => {
      const product = JSON.parse(message.content.toString());
      console.log(`Received product: ${JSON.stringify(product)}`);
      this.channel.ack(message);
    });

  }

  urlConnector () {
    return `amqp://${this.host}:${this.port}`;
  }

  async closeConnection (){
    try {
      await this.channel.close();
      await this.connection.close();
      console.log('Success close connection to RabbitMQ')
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = RabbitMqConnector;