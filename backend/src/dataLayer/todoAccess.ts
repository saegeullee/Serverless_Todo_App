import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger, format, transports } from 'winston'

import { TodoItem as Todo } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
  private readonly docClient: DocumentClient
  private readonly todoTable: string
  constructor() {
    this.docClient = createDynamoDBClient()
    this.todoTable = process.env.TODO_TABLE
  }

  async createTodo(newItem): Promise<Todo> {
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: newItem
      })
      .promise()

    return newItem
  }

  async getTodos(userId: string): Promise<Todo[]> {
    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return result.Items as Todo[]
  }

  async updateTodo(todoId: string, updatedTodo: UpdateTodoRequest) {
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          id: todoId
        },
        UpdateExpression: 'set name = :name, done = :done, dueDate = :dueDate',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':done': updatedTodo.done,
          ':dueDate': updatedTodo.dueDate
        }
      })
      .promise()
  }

  async deleteTodo(userId: string, todoId: string) {
    await this.docClient
      .delete({
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()
  }
}

function createDynamoDBClient() {
  logger.info('Creating Todos DynamoDB Client...')
  return new XAWS.DynamoDB.DocumentClient()
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'your-service-name' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: 'quick-start-error.log', level: 'error' }),
    new transports.File({ filename: 'quick-start-combined.log' })
  ]
})
