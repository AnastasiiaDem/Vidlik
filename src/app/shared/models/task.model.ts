export class TaskModel {
  _id: number;
  userId: number;
  title: string;
  status: statusEnum;
  workMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  rounds: number;
}

export enum statusEnum {
  Done = 'Done',
  Ongoing = 'Ongoing',
  Waiting = 'Waiting'
}
