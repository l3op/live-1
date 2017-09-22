//user's main profile
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { CreateLiveComponent } from '../create-live/create-live.component'
import { MdDialog } from '@angular/material'
import { FacebookService, InitParams } from 'ngx-facebook'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  followers = 0
  following = 0
  user = ''
  filter_value = 'future'
  live_count = 0
  view_by = {future: true, current: false, past: false}
  lives = []
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
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user = data.data.fullname
          this.live_count = data.data._lives.length
          this.followers = data.data._followers.length
          this.following = data.data._followings.length
        } else {
          this._router.navigate(['/'])
        }
      })
    this._service.all_user_attending()
      .then(data => {
        this.lives = data.data._attending
      })
      this.dialog.afterAllClosed
        .subscribe( () => {
          if(this.bodyOverlay.status) {
            this.bodyOverlay.status = false
            this.ngOnInit()
          }
        })
  }
  create_live() {
    this.bodyOverlay.status = true
    this.dialog.open(CreateLiveComponent)
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
  show_image(src) {
    return `url(assets/lives/${src})`
  }
  unattend_live(id) {
    this._service.unattend(id)
      .then(data => {
        this._service.all_user_attending()
          .then(data => {
            this.lives = data.data._attending
          })
      })
  }
  open_live(id) {
    this._router.navigate(['/live', id])
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
}
