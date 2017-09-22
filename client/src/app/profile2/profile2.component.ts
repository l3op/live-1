//other user's profile - when no user is signed in
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'

@Component({
  selector: 'app-profile2',
  templateUrl: './profile2.component.html',
  styleUrls: ['./profile2.component.css']
})
export class Profile2Component implements OnInit {
  followers = 0
  following = 0
  user = ''
  filter_value = 'future'
  live_count = 0
  view_by = {future: true, current: false, past: false}
  lives = []
  constructor(private _service: LiveService, private _router1: Router, private _router2: ActivatedRoute) { }

  ngOnInit() {
    this._router2.paramMap
      .switchMap(params => {
        return this._service.other_user_attending(params.get('id'))
      }).subscribe(data => {
        this.followers = data.data._followers.length
        this.following = data.data._followings.length
        this.user = data.data.fullname
        this.lives = data.data._attending
        this.live_count = data.data._lives.length
      })
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
  open_live(id) {
    this._router1.navigate(['/live', id])
  }

}
