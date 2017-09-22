import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { CreateLiveComponent } from '../create-live/create-live.component'
import { MdDialog } from '@angular/material'
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  following = []
  following_id = []
  public bodyOverlay = {status: false}
  constructor(private _service: LiveService, private _router: Router, private dialog: MdDialog, private fb: FacebookService) {
    let initParams: InitParams = {
      appId: '509166712750511',
      xfbml: true,
    version: 'v2.8'
    }
    fb.init(initParams)
  }

  ngOnInit() {
    this._service.user_follow_data()
      .then(data => {
        if(data.status) {
          this.following = data.data._followings
          for(let user of data.data._followings) {
            this.following_id.push(user._id)
          }
        } else {
          this._router.navigate(['/'])
        }
      })
      .catch(() => this._router.navigate(['/']))

    this.dialog.afterAllClosed
      .subscribe( () => {
        this.bodyOverlay.status = false
      })
  }
  unfollow(id) {
    this._service.unfollow_user(id)
      .then(data => this.get_user_following() )
  }
  follow(id) {
    this._service.follow_user(id)
      .then(data => this.get_user_following() )
  }

  create_live() {
    this.bodyOverlay.status = true
    this.dialog.open(CreateLiveComponent)
  }
  open_user(id) {
    this._router.navigate(['/user3', id])
  }
  log_out() {
    this.fb.getLoginStatus()
      .then(response => {
        if(response.status == 'connected') {
          this.fb.logout()
        }
      })
  }

  private get_user_following() {
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.following_id = data.data._followings
        }
      })
  }
}
