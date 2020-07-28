import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem as Todo } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodoAccess {
  private readonly docClient: DocumentClient
  private readonly todoTable: string
  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient()
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
