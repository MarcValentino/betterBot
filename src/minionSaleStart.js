const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETKEY,
    region: process.env.AWSREGION
});

const dynamo = new AWS.DynamoDB();

module.exports.start = async () => {
    let params = {
        TableName: 'minions'
      }
      let response;
      
      let scan = dynamo.scan(params).promise(); 
      await scan.then(
        function(data){
          console.log("Vaaai\n");
          
          let stringResponse = "";
          for(let i = 0;i<data.Items.length;i++){
            stringResponse += "Num: " + data.Items[i].id.N + "\nNome: " + data.Items[i].name.S + "\nPreço: " + data.Items[i].price.N + "\n\n";
            
          }
          console.log("sucesso!\n" + stringResponse);
          response = {
              statusCode: 200,
              body: JSON.stringify({
                  fulfillmentText: "Bem vindo à loja de minions! Temos esses minions:\n\n" + stringResponse + "\nQual você quer?",

              })
          }
          //agent.add("Bem vindo à loja de minions! Temos esses minions:\n\n" + stringResponse + "\nQual você quer?");
          
        }
      ).catch(
        function(err){
          console.log("Erro!\n" + err);
          response = {
            statusCode: 200,
            body: JSON.stringify({
                fulfillmentText: "Houve um erro no BD. Tente novamente mais tarde.",
                
            })
        }
          //agent.add("Erro no BD!");
          
        }
      );
    return response;
    }

