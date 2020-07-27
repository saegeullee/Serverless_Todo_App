import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'

AWS.config.correctClockSkew = true

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Current Processing Event: ', event)

  const userId = getUserId(event)

  const result = await docClient
    .query({
      TableName: todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()

  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
