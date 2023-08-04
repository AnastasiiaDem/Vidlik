import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './shared/services/auth.guard';
import {HomeComponent} from './home/home.component';
import {MainComponent} from './main/main.component';
import {GreetingComponent} from './greeting/greeting.component';

const routes: Routes = [
  {path: '', component: GreetingComponent},
  {path: 'main', component: MainComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
