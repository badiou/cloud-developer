import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  // This function is used to get all todos from DymanoDB. This function will be used in http/getTodos.ts
  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  // this function allows to create a todo in DynamoDB. This function will be used in http/createTodo.ts
async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()
    return todo
  }

// this fucntion allows to delete todo in database. 
async deleteTodo(todoId: string) {
    await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
            todoId
        }
    }).promise();
    }

// this function allow user to update todo in database.
async updateTodo(todoId:string, updatedTodo){
    await this.docClient.update({
        TableName: this.todosTable,
        Key: {
            todoId
        },
        UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
          ExpressionAttributeValues: {
              ':name': updatedTodo.name,
              ':dueDate': updatedTodo.dueDate,
              ':done': updatedTodo.done
          },
          ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
          }
      }).promise();
}


// This function check just if the todo exists in the database and return true if it's exist and false if not
async  todoExists(todoId) {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          id: todoId
        }
      })
      .promise()
    console.log('Get todo: ', result)
    return !!result.Item
  }

}



function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
