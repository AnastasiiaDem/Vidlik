import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {UserModel} from '../shared/models/user.model';
import {Subject, takeUntil} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';
import {SocialAuthService} from '@abacritt/angularx-social-login';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {

  @Output() openModel: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentUser: UserModel;
  private readonly unsubscribe: Subject<void> = new Subject();
  darkMode = false;

  constructor(private authenticationService: AuthService,
              private socialAuthService: SocialAuthService,
              private router: Router) {
    this.darkMode = document.documentElement.getAttribute('data-theme') == 'dark';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openModal() {
      this.openModel.emit('');
  }

  logout() {
    this.authenticationService
      .logout()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(_ => {
          this.socialAuthService.signOut().then().catch(err => console.log(err));
          this.router.navigate(['/']);
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
}
