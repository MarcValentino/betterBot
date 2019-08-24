const minionSaleStart = require('./src/minionSaleStart')  
const minionSaleConfirm = require('./src/minionSaleConfirm'); 

module.exports.fulfillmentHandler = async (event) => {
  let fulfillmentRequest = JSON.parse(event.body);
  console.log("Body:" + JSON.stringify(fulfillmentRequest));
  let intentName = fulfillmentRequest.queryResult.intent.displayName;
  let response;

  switch(intentName){
    case "minionSaleStart":
      response = await minionSaleStart.start();
      break;
    case "minionSaleConfirm":
      response = await minionSaleConfirm.confirm(fulfillmentRequest);
      break;
  }
  return response;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
