import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { Home2Component } from './home2/home2.component'
import { ProfileComponent } from './profile/profile.component'
import { InterestComponent } from './interest/interest.component'
import { LiveComponent } from './live/live.component'
import { Profile2Component } from './profile2/profile2.component'
import { Profile3Component } from './profile3/profile3.component'
import { SearchComponent } from './search/search.component'
import { UserLivesComponent } from './user-lives/user-lives.component';
import { FollowingComponent } from './following/following.component';
import { FollowersComponent } from './followers/followers.component'

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: Home2Component},
  {path: 'profile', component: ProfileComponent},
  {path: 'interest/:interest', component: InterestComponent},
  {path: 'live/:id', component: LiveComponent},
  {path: 'user/:id', component: Profile2Component},
  {path: 'user3/:id', component: Profile3Component},
  {path: 'search', component: SearchComponent},
  {path: 'lives', component: UserLivesComponent},
  {path: 'following', component: FollowingComponent},
  {path: 'followers', component: FollowersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
