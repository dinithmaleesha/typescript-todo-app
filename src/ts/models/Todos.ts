import { DataResource } from "../service/DataResource"

export interface ToDoProps {
  id: string,
  title: string,
  description: string,
  completed: boolean
}

export const ToDo = new DataResource<ToDoProps>(
  'http://localhost:3000/tasks'
)