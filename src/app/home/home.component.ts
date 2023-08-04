import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {TaskService} from '../shared/services/task.service';
import {UserService} from '../shared/services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: { firstName: any; lastName: any; password: any; id: any; email: any; tasks: any };

  constructor(public taskService: TaskService,
              public userService: UserService,
              private authenticationService: AuthService,
              private router: Router) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => {
        if (!!x) {
          this.currentUser = {
            id: x['foundUser']._id,
            firstName: x['foundUser'].firstName,
            lastName: x['foundUser'].lastName,
            email: x['foundUser'].email,
            password: x['foundUser'].password,
            tasks: x['foundUser'].tasks
          };
          this.getAllTasks();
        }
      });
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getAllTasks() {
    this.taskService.getTasks()
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(res => {
          console.log(res);
        },
        err => {
          console.log(err);
        });
  }
}
