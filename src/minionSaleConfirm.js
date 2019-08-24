//const aws = require('aws-sdk');

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETKEY,
    region: process.env.AWSREGION
});

const dynamo = new AWS.DynamoDB();

module.exports.confirm = async (fulfillmentRequest) => {
    //var userChoice = await agent.request_.body.queryResult.outputContexts[0].parameters;
    let userChoice = fulfillmentRequest.queryResult.outputContexts[0].parameters.num;
    console.log(`Fulfillment: ` + JSON.stringify(fulfillmentRequest.queryResult.outputContexts[0].parameters));
    let paramsMinion = {
      Key:{
        id : {N: "" + userChoice }
      },
      TableName: 'minions'
    }
    var ses = new AWS.SES({apiVersion: "2010-12-01"});
    let response;

    let get = dynamo.getItem(paramsMinion).promise(); 
    await get.then(
      async function(data){
        var emailParams = {
          Destination: { 
            ToAddresses: [
              fulfillmentRequest.queryResult.parameters.email,
            ]
          },
          Message: { 
            Body: { /* required */
              /*Html: {
               Charset: "UTF-8",
               Data: `<p>Obrigado pela compra na loja de minions! Os dados da sua compra estão aqui:</p><p id="output"></p><script></script> <p>Volte sempre!</p>`
              },*/
              Text: {
               Charset: "UTF-8",
               Data: "Obrigado pela compra na loja de minions! Aqui está o seu recibo: \n\nNúmero: "+ userChoice + "\nNome: "+data.Item.name.S+"\nPreço: R$"+data.Item.price.N +",00 \n\nVolte sempre!" 
              }
             },
             Subject: {
              Charset: 'UTF-8',
              Data: 'Loja de Minions - Compra efetuada com sucesso!'
             }
            },
          Source: "marcelovalentino99@gmail.com", 
          
        };
        var sendPromise = ses.sendEmail(emailParams).promise();
        await sendPromise.then(
          function(data){
            console.log(data);
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    fulfillmentText: `Email enviado para ${fulfillmentRequest.queryResult.parameters.email}! Verifique seu email pelo comprovante.`,
                })
            } 
            //agent.add('Email enviado para ' + agent.parameters.email + '! Verifique seu email pelo comprovante.');
          }).catch(
          function(err){
            console.error(err, err.stack);
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    fulfillmentText: `Erro no envio do email! Verifique se o mesmo está correto.`,
                })
            } 
            
            //agent.add('Falha no envio do email! Verifique se o mesmo está correto.')
          }
        );
      }
    ).catch(
      function(err){
        console.log("erro:\n"+err);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                fulfillmentText: `Opção inválida. Escolha um minion que vendemos.`,
            })
        }
        //agent.end("Erro no BD!");
      }
    );
    return response;
}