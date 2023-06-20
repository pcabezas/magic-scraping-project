class CreateObjectService {
  constructor (queueName, data){
    this.queue = queueName;
    this.data = data;
  }

  create(){
    console.log('Implement this method on a subClass');
  }
}

module.exports = CreateObjectService