import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../shared/services/task.service';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { TaskModel } from '../shared/models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../main/main.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: {
    firstName: any;
    lastName: any;
    password: any;
    id: any;
    email: any;
    tasks: any;
  };
  start = true;
  darkMode = false;
  checked = false;
  taskList: Array<TaskModel> = [
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title0',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title1',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title2',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title3',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title4',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title5',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title6',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title7',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title8',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title9',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title10',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title11',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title12',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title13',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title14',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
    {
      _id: Math.random(),
      userId: Math.random(),
      title: 'title15',
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 20,
    },
  ];

  constructor(
    public taskService: TaskService,
    public userService: UserService,
    private authenticationService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.darkMode =
      document.documentElement.getAttribute('data-theme') == 'dark';
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((x) => {
        if (!!x) {
          this.currentUser = {
            id: x['foundUser']._id,
            firstName: x['foundUser'].firstName,
            lastName: x['foundUser'].lastName,
            email: x['foundUser'].email,
            password: x['foundUser'].password,
            tasks: x['foundUser'].tasks,
          };
          this.getAllTasks();
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getAllTasks() {
    this.taskService
      .getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  logout() {
    this.authenticationService
      .logout()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (sub) => {
          this.socialAuthService.signOut();
          this.router.navigate(['/main']);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  setTheme() {
    this.darkMode = !this.darkMode;
    document.documentElement.setAttribute(
      'data-theme',
      this.darkMode ? 'dark' : 'light'
    );
    document.documentElement.style.colorScheme = this.darkMode
      ? 'dark'
      : 'light';
  }

  addNewTask() {}

  editTask() {}

  paginate(i) {
    this.active = true;
  }

  trackByFn(index, item) {
    return item.title;
  }
}
