import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { FacebookModule } from 'ngx-facebook';

import 'hammerjs'

import { LiveService } from './live.service'

import { FilterDatePipe } from './filter-date.pipe';
import { FilterCityPipe } from './filter-city.pipe';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthorizationComponent } from './authorization/authorization.component'
import { CreateLiveComponent } from './create-live/create-live.component';
import { Home2Component } from './home2/home2.component';
import { ProfileComponent } from './profile/profile.component';
import { InterestComponent } from './interest/interest.component';
import { LiveComponent } from './live/live.component';
import { PostComponent } from './post/post.component';
import { Profile2Component } from './profile2/profile2.component';
import { Profile3Component } from './profile3/profile3.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { SearchPipe } from './search.pipe';
import { UserLivesComponent } from './user-lives/user-lives.component';
import { FollowingComponent } from './following/following.component';
import { FollowersComponent } from './followers/followers.component'





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateLiveComponent,
    AuthorizationComponent,
    Home2Component,
    ProfileComponent,
    InterestComponent,
    LiveComponent,
    PostComponent,
    FilterDatePipe,
    FilterCityPipe,
    TimeAgoPipe,
    Profile2Component,
    Profile3Component,
    MapComponent,
    SearchComponent,
    SearchPipe,
    UserLivesComponent,
    FollowingComponent,
    FollowersComponent
  ],
  entryComponents: [
    AuthorizationComponent,
    CreateLiveComponent,
    PostComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAuRHsIXd2ESt8kU1u4mlpw33Fxp8dNeS8',
      libraries: ["places"]
    }),
    FacebookModule.forRoot()
  ],
  providers: [LiveService],
  bootstrap: [AppComponent]
})
export class AppModule { }
