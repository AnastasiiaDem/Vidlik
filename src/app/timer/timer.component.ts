import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

const minutesToSeconds = (minutes: number) => minutes * 60;
const secondsToMinutes = (seconds: number) => Math.floor(seconds / 60);
const padWithZeroes = (number: number) => number.toString().padStart(2, '0');

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnChanges {
  @Input() workMin: number;
  @Input() shortBreakMin: number;
  @Input() longBreakMin: number;
  @Input() rounds: number;
  displayTime: number;
  completedRounds = 0;
  interval = null;
  isRest = false;
  isLongBreak = false;
  workSec: number;
  shortBreakSec: number;
  longBreakSec: number;
  numberOfRounds: number;

  ngOnInit() {
    this.workSec = minutesToSeconds(25);
    this.shortBreakSec = minutesToSeconds(5);
    this.longBreakSec = minutesToSeconds(20);
    this.numberOfRounds = 4;
    this.displayTime = this.workSec;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.workSec = minutesToSeconds(this.workMin);
    this.shortBreakSec = minutesToSeconds(this.shortBreakMin);
    this.longBreakSec = minutesToSeconds(this.longBreakMin);
    this.numberOfRounds = this.rounds;
    this.displayTime = this.workSec;
  }

  get percent() {
    let time = this.isRest
      ? this.isLongBreak
        ? this.longBreakSec
        : this.shortBreakSec
      : this.workSec;
    return 360 - (this.displayTime * 360) / time;
  }

  formatTime(timeInSeconds: number) {
    const minutes = secondsToMinutes(timeInSeconds);
    const remainingSeconds = timeInSeconds % 60;
    return `${padWithZeroes(minutes)}:${padWithZeroes(remainingSeconds)}`;
  }

  startRound() {
    if (!this.isRest) {
      this.interval = setInterval(() => {
        if (this.displayTime === 0) {
          this.completedRounds++;
          this.stopRound();
          this.completeRound();
        }
        this.displayTime -= 1;
      }, 1000);
    } else {
      this.rest();
    }
  }

  break() {
    this.stopRound();
    this.completeRound();
  }

  completeRound() {
    this.isRest = true;
    if (this.completedRounds === this.numberOfRounds) {
      this.displayTime = this.longBreakSec;
      this.isLongBreak = true;
      this.rest();
      this.completedRounds = 0;
    } else {
      this.displayTime = this.shortBreakSec;
      this.rest();
    }
  }

  cancelRound() {
    this.stopRound();
    this.isRest = false;
    this.displayTime = this.workSec;
    this.completedRounds = 0;
  }

  stopRound() {
    clearInterval(this.interval);
    this.interval = null;
  }

  rest() {
    this.interval = setInterval(() => {
      if (this.displayTime === 0) {
        this.displayTime = this.workSec;
        this.isRest = false;
        if (this.isLongBreak) {
          this.cancelRound();
        } else {
          this.stopRound();
          this.startRound();
        }
      }
      this.displayTime -= 1;
    }, 1000);
  }
}
