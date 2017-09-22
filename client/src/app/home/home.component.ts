import { Component, OnInit } from '@angular/core';
import { AuthorizationComponent } from '../authorization/authorization.component'
import { MdDialog } from '@angular/material'
import { LiveService } from '../live.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lives = []
  filter_value = ''
  user_location = ''
  city = ''
  error = ''
  public bodyOverlay = {status: false}
  interests = [{name: 'Tech'},  {name: 'Food'}, {name: 'Love'}, {name: 'Family'}, {name: 'Music'}, {name: 'Nature'}, {name: 'Coding'}, {name: 'Fitness'}]
  view_by = {today: false, near_you: false, all: true}

  constructor(private dialog: MdDialog, private _service: LiveService, private _router: Router, private _router2: ActivatedRoute) { }

  ngOnInit() {
    this.setCurrentPosition()
    this.bodyOverlay.status = false
    this._service.all_lives()
        .then(data => {
          this.lives = data
        })
    this.dialog.afterAllClosed
      .subscribe( () => {
        this.bodyOverlay.status = false
      })
    this._router2.paramMap.subscribe(params => { //COME BACK ITS NOT WORKING
      this.error = params.get('message')
    })
  }
  sign_up() {
    this.bodyOverlay.status = true
    let pop_up = this.dialog.open(AuthorizationComponent)
    pop_up.componentInstance.status = true
    pop_up.componentInstance.background = this.bodyOverlay.status
  }
  log_in() {
    this.bodyOverlay.status = true
    let pop_up = this.dialog.open(AuthorizationComponent)
    pop_up.componentInstance.status = false
    pop_up.componentInstance.background = this.bodyOverlay.status
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
    return `url(assets/lives/${src})` //come back
  }
  open_live(id) {
    this._router.navigate(['/live', id])
  }
  open_user(id) {
    this._router.navigate(['/user', id])
  }

  private setCurrentPosition() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this._service.current_location(position.coords.latitude, position.coords.longitude)
          .then(data => {
            var result = data.results[0].address_components
            for(var i = 0; i < result.length; i ++) {
              if(result[i].types[0] == "locality") {

                this.user_location = result[i].short_name
              }
            }
          })
      })
    }
  }

}
