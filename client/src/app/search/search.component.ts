import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  all_users = []
  user_id = ''
  user_following = []
  lives = []
  user_attending = []
  user_search = ''
  user_lives = []
  constructor(private _service: LiveService, private _router: Router) { }

  ngOnInit() {
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_id = data.data._id
          this.user_following = data.data._followings
          this.user_attending = data.data._attending
          this.user_lives = data.data._lives
        } else {
          this._router.navigate(['/'])
        }
      })
      .catch(() => this._router.navigate(['/']))
    this._service.all_users()
        .then(data => {
          this.all_users = data.data
        })
  this._service.all_lives()
      .then(data => {
        this.lives = data
      })
  }
  follow(id) {
    this._service.follow_user(id)
      .then(data => this.get_following() )
  }
  unfollow(id) {
    this._service.unfollow_user(id)
      .then(data => this.get_following() )
  }
  attend_live(id) {
    this._service.attend(id)
      .then(data => this.master() )
  }
  unattend_live(id) {
    this._service.unattend(id)
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
    return `url(assets/lives/${src})` //come back
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
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_attending = data.data._attending
          this.user_lives = data.data._lives
        }
        this._service.all_lives()
            .then(data => {
              this.lives = data
            })
      })
  }
  private get_following() {
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_following = data.data._followings
        }
      })
  }

}
