import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {TaskService} from '../shared/services/task.service';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {SocialAuthService} from '@abacritt/angularx-social-login';
import {statusEnum, TaskModel} from '../shared/models/task.model';
import {UserModel} from '../shared/models/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../main/main.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  darkMode = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  taskList: Array<TaskModel> = [];
  pagNum: any;
  taskForm: FormGroup;
  action: string;
  workMinValue: number;
  shortBreakMinValue: number;
  longBreakMinValue: number;
  numberOfRounds: number;

  constructor(
    public taskService: TaskService,
    private authenticationService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private socialAuthService: SocialAuthService
  ) {
    this.darkMode =
      document.documentElement.getAttribute('data-theme') == 'dark';
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((x) => {
        if (!!x) {
          this.currentUser = {
            _id: x['foundUser']._id,
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

  ngOnInit(): void {
    this.workMinValue = 25;
    this.shortBreakMinValue = 5;
    this.longBreakMinValue = 20;
    this.numberOfRounds = 4;
    this.taskForm = this.formBuilder.group({
      _id: [''],
      title: [''],
      userId: [''],
      status: [statusEnum.Waiting],
      workMin: [25, Validators.required],
      shortBreakMin: [5, Validators.required],
      longBreakMin: [20, Validators.required],
      rounds: [4]
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get f() {
    return this.taskForm.controls;
  }

  getAllTasks() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res: Array<TaskModel>) => {
          this.taskList = res.filter(t => t.userId == this.currentUser._id);
          this.pagNum = this.taskList.length > 6 ? [].constructor(Math.round(this.taskList.length / 3) - 1) : 0;
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
          this.socialAuthService.signOut().then().catch();
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

  addNewTask(task: TaskModel) {
    this.taskService.addTask(task)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          console.log(res);
          this.submitted = false;
          this.successMessage = res;
          this.modalService.dismissAll();
          this.getAllTasks();
        },
        (err) => {
          console.log(err);
          this.errorMessage = err;
        }
      );
  }

  updateTask(task: TaskModel) {
    this.taskService.updateTask(task)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          console.log(res);
          this.submitted = false;
          this.successMessage = res;
          this.modalService.dismissAll();
          this.getAllTasks();
        },
        (err) => {
          console.log(err);
          this.errorMessage = err;
        }
      );
  }

  deleteTask(item) {
    this.taskService.deleteTask(item._id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          console.log(res);
          this.submitted = false;
          this.successMessage = res;
          this.modalService.dismissAll();
          this.getAllTasks();
        },
        (err) => {
          console.log(err);
          this.errorMessage = err;
        }
      );
  }

  paginate(i) {

  }

  trackByFn(index: number, item: TaskModel) {
    return item.status;
  }

  changeStatus(item: TaskModel) {
    let statusState: statusEnum;

    switch (item.status) {
      case statusEnum.Done:
        statusState = statusEnum.Waiting;
        break;
      case statusEnum.Waiting:
        statusState = statusEnum.Ongoing;
        break;
      case statusEnum.Ongoing:
        statusState = statusEnum.Done;
        break;
      default:
        break;
    }

    let updatedItem: TaskModel = {
      _id: item._id,
      userId: item.userId,
      title: item.title,
      status: statusState,
      workMin: item.workMin,
      shortBreakMin: item.shortBreakMin,
      longBreakMin: item.longBreakMin,
      rounds: item.rounds
    };
    this.taskService.updateTask(updatedItem)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
          console.log(res);
          this.getAllTasks();
        },
        (err) => {
          console.log(err);
        }
      );

    if (statusState === statusEnum.Ongoing) {
      this.updateTimeValues(item);
    } else if (statusState === statusEnum.Done) {
      this.updateTimeValues({workMin: 25, shortBreakMin: 5, longBreakMin: 20, rounds: 4});
    }
  }

  updateTimeValues(item) {
    this.workMinValue = item.workMin;
    this.shortBreakMinValue = item.shortBreakMin;
    this.longBreakMinValue = item.longBreakMin;
    this.numberOfRounds = item.rounds;
  }

  onSubmit() {
    this.submitted = true;

    if (this.taskForm.invalid) {
      return;
    }

    setTimeout(() => {
      let taskObject: TaskModel = {
        _id: Math.round(Math.random() * 100),
        userId: this.currentUser._id,
        status: statusEnum.Waiting,
        title: this.taskForm.value.title,
        workMin: this.taskForm.value.workMin,
        shortBreakMin: this.taskForm.value.shortBreakMin,
        longBreakMin: this.taskForm.value.longBreakMin,
        rounds: this.taskForm.value.rounds
      };

      if (this.action == 'create') {
        this.addNewTask(taskObject);
      } else {
        this.updateTask(this.taskForm.value);
      }
    }, 1000);
  }

  openModal(content: any, action: string, item?: TaskModel) {
    this.action = action;
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.action == 'create') {
      this.taskForm.setValue({
        _id: '',
        userId: '',
        title: '',
        status: statusEnum.Waiting,
        workMin: 25,
        shortBreakMin: 5,
        longBreakMin: 20,
        rounds: 4
      });
    } else {
      this.taskForm.setValue({
        _id: item._id,
        userId: item.userId,
        title: item.title,
        status: item.status,
        workMin: item.workMin,
        shortBreakMin: item.shortBreakMin,
        longBreakMin: item.longBreakMin,
        rounds: item.rounds
      });
    }
    this.modalService.open(content, {centered: true});
  }
}
