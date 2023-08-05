import { Component } from '@angular/core';

const minutesToSeconds = (minutes) => minutes * 60;
const secondsToMinutes = (seconds) => Math.floor(seconds / 60);
const padWithZeroes = (number) => number.toString().padStart(2, '0');

const POMODORO_S = minutesToSeconds(25);
const LONG_BREAK_S = minutesToSeconds(20);
const SHORT_BREAK_S = minutesToSeconds(5);

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  pomodoroTime = POMODORO_S;
  completedPomodoros = 0;
  interval = null;
  isRest = false;
  isLongBreak = false;

  get percent() {
    let time = this.isRest
      ? this.isLongBreak
        ? LONG_BREAK_S
        : SHORT_BREAK_S
      : POMODORO_S;
    return 360 - (this.pomodoroTime * 360) / time;
  }

  formatTime(timeInSeconds) {
    const minutes = secondsToMinutes(timeInSeconds);
    const remainingSeconds = timeInSeconds % 60;
    return `${padWithZeroes(minutes)}:${padWithZeroes(remainingSeconds)}`;
  }

  startPomodoro() {
    if (!this.isRest) {
      this.interval = setInterval(() => {
        if (this.pomodoroTime === 0) {
          this.completedPomodoros++;
          this.stopPomodoro();
          this.completePomodoro();
        }
        this.pomodoroTime -= 1;
      }, 1000);
    } else {
      this.rest();
    }
  }

  break() {
    this.stopPomodoro();
    this.completePomodoro();
  }

  completePomodoro() {
    this.isRest = true;
    if (this.completedPomodoros === 4) {
      this.pomodoroTime = LONG_BREAK_S;
      this.isLongBreak = true;
      this.rest();
      this.completedPomodoros = 0;
    } else {
      this.pomodoroTime = SHORT_BREAK_S;
      this.rest();
    }
  }

  cancelPomodoro() {
    this.stopPomodoro();
    this.isRest = false;
    this.pomodoroTime = POMODORO_S;
    this.completedPomodoros = 0;
  }

  stopPomodoro() {
    clearInterval(this.interval);
    this.interval = null;
  }

  rest() {
    this.interval = setInterval(() => {
      if (this.pomodoroTime === 0) {
        this.pomodoroTime = POMODORO_S;
        this.isRest = false;
        if (this.isLongBreak) {
          this.cancelPomodoro();
        } else {
          this.stopPomodoro();
          this.startPomodoro();
        }
      }
      this.pomodoroTime -= 1;
    }, 1000);
  }
}
