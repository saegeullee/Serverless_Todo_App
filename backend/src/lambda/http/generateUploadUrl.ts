import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import uuid from 'uuid'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { getUserId } from '../utils'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const docClient = new XAWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODO_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const imageId = uuid.v4()

  await docClient
    .update({
      TableName: todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set attachmentUrl = :url',
      ExpressionAttributeValues: {
        ':url': `https://${bucketName}.s3.amazonaws.com/${imageId}`
      }
    })
    .promise()

  const url = getUploadUrl(imageId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

function getUploadUrl(imageId) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: Number(urlExpiration)
  })
}
