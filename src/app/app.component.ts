import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {AuthService} from './shared/services/auth.service';
import {Router} from '@angular/router';
import {UserModel} from './shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: UserModel;
  url;
  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(private router: Router,
              private authenticationService: AuthService) {
    this.authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.url = this.router.url;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
