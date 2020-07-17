
import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../lambda/utils';
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'

const todosAccess= new TodosAccess()
const bucketName = process.env.TODOS_S3_BUCKET


export async function getAllTodos(): Promise<TodoItem[]> {
    return todosAccess.getAllTodos()
  }
  
  export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    event: APIGatewayProxyEvent
  ): Promise<TodoItem> {
  
    const itemId = uuid.v4()
    const userId = getUserId(event)
    return await todosAccess.createTodo({
        todoId: itemId,
        userId: userId,
        createdAt:new Date(Date.now()).toISOString(),
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
        ...createTodoRequest
    })
  }
  
