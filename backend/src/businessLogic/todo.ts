import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem as Todo } from '../models/TodoItem'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function createTodo(
  userId: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  const todoId = uuid.v4()
  const newItem = {
    userId,
    todoId,
    done: false,
    attachmentUrl: '',
    createdAt: new Date().toLocaleDateString(),
    ...newTodo
  }

  return await todoAccess.createTodo(newItem)
}

export async function getTodos(userId: string): Promise<Todo[]> {
  return await todoAccess.getTodos(userId)
}

export async function deleteTodo(userId: string, todoId: string) {
  await todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(
  todoId: string,
  updateTodo: UpdateTodoRequest
) {
  await todoAccess.updateTodo(todoId, updateTodo)
}
