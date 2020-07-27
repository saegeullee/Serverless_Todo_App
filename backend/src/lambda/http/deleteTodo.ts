import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getUserId } from '../utils'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const tableName = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  await docClient
    .delete({
      TableName: tableName,
      Key: {
        userId,
        todoId
      }
    })
    .promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: 'successfully deleted item'
  }
}
