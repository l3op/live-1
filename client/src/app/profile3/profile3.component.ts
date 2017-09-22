//other user's profile - when user is signed in
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { FacebookService, InitParams } from 'ngx-facebook'
import { CreateLiveComponent } from '../create-live/create-live.component'
import { MdDialog } from '@angular/material'

@Component({
  selector: 'app-profile3',
  templateUrl: './profile3.component.html',
  styleUrls: ['./profile3.component.css']
})
export class Profile3Component implements OnInit {
  followers = 0
  following = 0
  viewed_user = ''
  filter_value = 'future'
  live_count = 0
  view_by = {future: true, current: false, past: false}
  lives = []
  user_attending = []
  user_following = []
  other_user_id = ''
  user_lives = []
  public bodyOverlay = {status: false}
  constructor(private _service: LiveService, private _router1: Router, private _router2: ActivatedRoute, private dialog: MdDialog, private fb: FacebookService) {
    let initParams: InitParams = {
      appId: '509166712750511',
      xfbml: true,
    version: 'v2.8'
    }
    fb.init(initParams)
   }

  ngOnInit() {
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_attending = data.data._attending
          this.user_following = data.data._followings
          this.user_lives = data.data._lives
        } else {
          this._router1.navigate(['/'])
        }
      })
      .catch(() => this._router1.navigate(['/']))
    this._router2.paramMap
      .switchMap(params => {
        this.other_user_id = params.get('id')
        return this._service.other_user_attending(params.get('id'))
      }).subscribe(data => {
        this.followers = data.data._followers.length
        this.following = data.data._followings.length
        this.viewed_user = data.data.fullname
        this.lives = data.data._attending
        this.live_count = data.data._lives.length
      })
    this.dialog.afterAllClosed
        .subscribe( () => {
          if(this.bodyOverlay.status) {
            this.bodyOverlay.status = false
            this.ngOnInit()
          }
        })
  }
  attend_live(id) {
    this._service.attend(id)
      .then(data => this.master() )
  }
  unattend_live(id) {
    this._service.unattend(id)
      .then(data => this.master() )
  }
  follow(id) {
    this._service.follow_user(id)
      .then(data => this.master() )
  }
  unfollow(id) {
    this._service.unfollow_user(id)
      .then(data => this.master() )
  }
  change_view(text) {
    for(var key in this.view_by) {
      if(key == text) {
        this.view_by[key] = true
      } else {
        this.view_by[key] = false
      }
    }
  }
  create_live() {
    this.bodyOverlay.status = true
    this.dialog.open(CreateLiveComponent)
  }
  show_image(src) {
    return `url(assets/lives/${src})`
  }
  open_live(id) {
    this._router1.navigate(['/live', id])
  }
  log_out() {
    this.fb.getLoginStatus()
      .then(response => {
        if(response.status == 'connected') {
          this.fb.logout()
        }
      })
  }
  private master() {
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_attending = data.data._attending
          this.user_following = data.data._followings
          this.user_lives = data.data._lives
        }
        this._service.other_user_attending(this.other_user_id)
          .then(data => {
            this.lives = data.data._attending
            this.followers = data.data._followers.length
          })
      })
  }
}
