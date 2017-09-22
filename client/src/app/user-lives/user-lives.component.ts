import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { CreateLiveComponent } from '../create-live/create-live.component'
import { MdDialog } from '@angular/material'
import { FacebookService, InitParams } from 'ngx-facebook'

@Component({
  selector: 'app-user-lives',
  templateUrl: './user-lives.component.html',
  styleUrls: ['./user-lives.component.css']
})
export class UserLivesComponent implements OnInit {
  lives = []
  user_name = ''
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
    this._service.user_lives()
        .then(data => {
          if(data.status) {
            this.lives = data.data._lives
            this.user_name = data.data.fullname
          } else {
            this._router.navigate(['/'])
          }
        })
        .catch(() => this._router.navigate(['/']))
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
  delete_live(title, id) {
    let result = confirm(`Are you sure you want to delete ${title}`)
    if(result) {
      this._service.delete_live(id)
        .then(data => {
          this.ngOnInit()
        })
    }
  }
  show_image(src) {
    return `url(assets/lives/${src})`
  }
  open_live(id) {
    this._router.navigate(['/live', id])
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
