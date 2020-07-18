import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

 if(!(await deleteTodo(event))) {  
   // deleteTodo return false because todo does not exist
  return {
    statusCode: 404,
    body: JSON.stringify({
    error: 'This todo does not exist'
      })
    }
  } // end of if
  else{
    return{
      statusCode: 202,
    body: JSON.stringify({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
      })
    }
  }// end of else
}

