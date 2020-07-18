import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
// import * as middy from 'middy'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const s3= new AWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.TODOS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const url= getUploadUrl(todoId)

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      todoId,
      uploadUrl: url
     
    })
  }
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', { 
    Bucket: bucketName, 
    Key: todoId, 
    Expires: +urlExpiration 
  })
}



