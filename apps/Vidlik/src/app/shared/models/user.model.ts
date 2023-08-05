import { TaskModel } from './task.model';

export class UserModel {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: Array<TaskModel>;
}
