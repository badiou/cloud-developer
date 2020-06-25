'use script'

const AWS=require('aws-sdk')
const uuid=require('uuid')

const docClient= new AWS.DynamoDB.DocumentClient()
const groupsTable=process.env.GROUPS_TABLE // the dynamoDB table is set like env variable. We need to add the variable name on the parameter of the lambda function


// cette ligne qui suit permet
exports.handler = async (event) => {
  console.log('Processing event : ', event)
  const itemId=uuid.v4()

  const parsedBody=JSON.parse(event.body)

  const newItem={
    id: itemId,
    ...parsedBody
  }
  await docClient.put({
    TableName:groupsTable,
    Item: newItem
    }).promise()
  
 return {
  statusCode:201,
  headers:{
             'Access-Control-Allow-Origin':'*'
             //ici on est en train d'allouer l'accès aux utilsiateurs venant d'autres domaine
         },
  body: JSON.stringify({
          newItem
       })
      }
}

// This code help to get all data from DynamoDB Table...
// exports.handler = async (event) => {
//   const result=await docClient.scan({
//       TableName:groupsTable
//   }).promise()
  
//   const items=result.Items
  
//  return {
//      statusCode:200,
//      headers:{
//          'Access-Control-Allow-Origin':'*'
//          //ici on est en train d'allouer l'accès aux utilsiateurs venant d'autres domaine
//      },
     
//      body: JSON.stringify({
//          items
//      })
//  }