import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';
import {Subject, takeUntil} from 'rxjs';
import {UserModel} from '../shared/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  private readonly unsubscribe: Subject<void> = new Subject();
  currentUser: UserModel;
  start = true;


  constructor(private router: Router,
              private authenticationService: AuthService) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => this.currentUser = x);
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getStarted() {
    this.router.navigate(['/register']);
  }
}
