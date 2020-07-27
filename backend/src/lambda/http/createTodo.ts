import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import { getUserId } from '../utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todoId = uuid.v4()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newItem = {
    userId,
    todoId,
    done: false,
    attachmentUrl: '',
    createdAt: new Date().toLocaleDateString(),
    ...newTodo
  }

  await docClient
    .put({
      TableName: todoTable,
      Item: newItem
    })
    .promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
