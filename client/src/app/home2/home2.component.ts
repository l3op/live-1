import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { CreateLiveComponent } from '../create-live/create-live.component'
import { MdDialog } from '@angular/material'
import { FacebookService, InitParams } from 'ngx-facebook'

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {
  all_users = []
  user_following = []
  user_attending = []
  user_interests = []
  status = true
  all_lives = []
  user_id = ''
  user_lives = []
  user_name = ''
  public bodyOverlay = {status: false}
  interests = [{name: 'Tech'},  {name: 'Food'}, {name: 'Love'}, {name: 'Family'}, {name: 'Music'}, {name: 'Nature'}, {name: 'Coding'}, {name: 'Fitness'}]

  constructor(private _service: LiveService, private _router: Router, private dialog: MdDialog, private fb: FacebookService) {
        let initParams: InitParams = {
          appId: '509166712750511',
          xfbml: true,
        version: 'v2.8'
        }
        fb.init(initParams)
   }

  ngOnInit() {
    this.master()

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
  attend_live(id) {
    this._service.attend(id)
      .then(data => this.master() )
  }
  unattend_live(id) {
    this._service.unattend(id)
      .then(data => this.master() )
  }
  add_interest(value) {
    this._service.follow_interest(value)
      .then(data => this.master() )
  }
  unadd_interest(value) {
    this._service.unfollow_interest(value)
      .then(data => this.master() )
  }
  delete_live(title, id) {
    let result = confirm(`Are you sure you want to delete ${title}`)
    if(result) {
      this._service.delete_live(id)
        .then(data => this.master() )
    }
  }
  show_image(src) {
    return `url(assets/lives/${src})`
  }
  open_live(id) {
    this._router.navigate(['/live', id])
  }
  open_user(id) {
    if(id == this.user_id) {
      this._router.navigate(['/profile'])
    } else {
      this._router.navigate(['/user3', id])
    }
  }
  private master() {
    this.all_lives = []
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_id = data.data._id
          this.user_interests = data.data.interests
          this.user_following = data.data._followings
          this.user_attending = data.data._attending
          this.user_lives = data.data._lives
          this.user_name = data.data.fullname
        } else {
          this._router.navigate(['/'])
        }
      })
      .catch(() => this._router.navigate(['/']))
  this._service.following_lives() //must come before user_attending
    .then(data => {
      if(data.data._followings) {
        for(let user of data.data._followings) {
          for(let live of user._lives) {
            this.all_lives.push({live: live, user: user.fullname, user_id: user._id})
          }
        }
      }
    })
    this._service.following_interests_lives()
      .then(data => {
        for(let live of data.data) {
          this.all_lives.push({live: live, user: live._user.fullname, user_id: live._user._id})
        }
      })
    this._service.user_attending()
        .then(data => {
          for(let live of data.data) {
            this.all_lives.push({live: live, user: live._user.fullname, user_id: live._user._id})
          }
        })
  this._service.user_lives()
    .then(data => {
      for(let live of data.data._lives) {
        this.all_lives.push({live: live, user: this.user_name, user_id: this.user_id})
      }
      console.log(this.all_lives)
    })
  }

  log_out() {
    this.fb.getLoginStatus() //check if the person is logged in with fb, if yes then log out
      .then(response => {
        if(response.status == 'connected') {
          this.fb.logout()
        }
      })
  }

}
