import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {first, Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';
import {SocialAuthService} from '@abacritt/angularx-social-login';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  userForm: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  darkMode = false;
  checked = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private authenticationService: AuthService,
    private socialAuthService: SocialAuthService
  ) {
    this.darkMode =
      document.documentElement.getAttribute('data-theme') == 'dark';
    this.authenticationService.currentUser
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((x) => (this.currentUser = x));
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.socialAuthService.authState
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user) => {
      if (!!user) {
        this.authenticationService
          .login(user.email, true, '')
          .pipe(takeUntil(this.unsubscribe), first())
          .subscribe(
            (data) => {
              this.submitted = false;
              this.successMessage = data.message;
              setTimeout(() => {
                this.modalService.dismissAll();
                this.router.navigate(['/home']);
              }, 1000);
            },
            (err) => {
              this.errorMessage = err;
            }
          );
      }
    });

    this.userForm = this.formBuilder.group({
      _id: [''],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ],
      ],
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(action: string) {
    this.submitted = true;

    this.userForm.setValue({
      _id: Math.floor(Math.random() * 100),
      email: this.userForm.value.email,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      password: this.userForm.value.password,
    });

    if (this.userForm.invalid) {
      return;
    }

    setTimeout(() => {
      let userObject: UserModel = {
        _id: Math.round(Math.random() * 100),
        email: this.userForm.value.email,
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        password: this.userForm.value.password,
        tasks: [],
      };

      if (action == 'register') {
        this.registerUser(userObject);
      } else {
        this.loginUser(userObject);
      }
    }, 1000);
  }

  registerUser(user: Object) {
    this.authenticationService
      .register(user)
      .pipe(takeUntil(this.unsubscribe), first())
      .subscribe(_ => {
          this.submitted = false;
          setTimeout(() => {
            (document.getElementById('loginbtn') as HTMLElement).click();
          }, 1000);
        },
        (err) => {
          this.errorMessage = err;
        }
      );
  }

  loginUser(user: UserModel) {
    this.authenticationService
      .login(user.email, false, user.password)
      .pipe(takeUntil(this.unsubscribe), first())
      .subscribe(
        (data) => {
          this.submitted = false;
          this.successMessage = data.message;
          setTimeout(() => {
            this.modalService.dismissAll();
            this.router.navigate(['/home']);
          }, 1000);
        },
        (err) => {
          this.errorMessage = err;
        }
      );
  }

  openModal(content: any) {
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.userForm.setValue({
      _id: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });

    this.modalService.open(content, {centered: true});
  }

  changeModal(content: any, modal: any) {
    modal.close();
    this.openModal(content);
  }
}
