import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { MdDialog } from '@angular/material'
import { PostComponent } from '../post/post.component'
import { MapComponent } from '../map/map.component'
import { Subscription } from 'rxjs/Subscription'
import { Data } from '../data'
import { FacebookService, InitParams } from 'ngx-facebook'

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  data1: any
  data2: any
  live: object
  user_attending = []
  live_id: any
  posts = []
  user_lives = []
  public bodyOverlay = {status: false}
  view_by = {today: false, near_you: true, trending: false}
  subscriptions: Array<Subscription>
  constructor(private _service: LiveService, private _router1: Router, private _router2: ActivatedRoute, private dialog: MdDialog, private ref: ChangeDetectorRef, private fb: FacebookService) {
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
          this.user_lives = data.data._lives
        } else {
          this._router1.navigate(['/'])
        }
      })
      .catch(() => this._router1.navigate(['/']))

    let new_post_subscribed = this._service.new_post()
      .subscribe(data => {
        this.data1 = data
        this.posts.push(this.data1)
        this.ref.markForCheck()
      })
    let user_post_subscribed = this._service.user_post()
      .subscribe(data => {
        this.data2 = data
        this.posts.push(this.data2)
        this.ref.markForCheck()
      })

    this._router2.paramMap
      .switchMap(params => {
        return this._service.find_live(params.get('id'))
      }).subscribe(data => {
        this.posts = data.data._feeds
        this.live = data.data
        this.live_id = data.data._id
      })
      this.dialog.afterAllClosed
        .subscribe( () => {
          this.bodyOverlay.status = false
        })

    this.subscriptions = [new_post_subscribed, user_post_subscribed]
  }
  show_image(src) {
    return `url(assets/lives/${src})`
  }
  open_user(id) {
    this._router1.navigate(['/user3', id])
  }

  attend_live(id) {
    this._service.attend(id)
      .then(data => this.get_user_attending() )
  }
  unattend_live(id) {
    this._service.unattend(id)
      .then(data => this.get_user_attending() )
  }
  open_post() {
    this.bodyOverlay.status = true
    let pop_up = this.dialog.open(PostComponent)
    pop_up.componentInstance.live = this.live_id
  }
  open_map() {
    this.bodyOverlay.status = true
    let pop_up = this.dialog.open(MapComponent)
    pop_up.componentInstance.live = this.live
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
  log_out() {
    this.fb.getLoginStatus()
      .then(response => {
        if(response.status == 'connected') {
          this.fb.logout()
        }
      })
  }
  private get_user_attending(){
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_attending = data.data._attending
        }
      })
  }
  ngOnDestroy() { //this happens once you leave the page
    this.subscriptions.forEach(subscription => subscription.unsubscribe()) //this happens for angular observer
    this._service.disconnect()
  }

}
