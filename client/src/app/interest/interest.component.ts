import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {
  interest = {
    name: ''
  }
  interest_lives = []
  user_attending = []

  constructor(private _router1: Router, private _router2: ActivatedRoute, private _service: LiveService) { }

  ngOnInit() {
    this._router2.paramMap
      .switchMap(params => {
        this.interest.name = params.get('interest')
        return this._service.find_interest(this.interest)
      }).subscribe( data => {
        for(let live of data.data) {
          this.interest_lives.push({live: live, user: live._user.username})
        }
      })

      this._service.current_user()
        .then(data => {
          if(data.status) {
            this.user_attending = data.data._attending
          } else {
            this._router1.navigate(['/'])
          }
        })
        .catch(() => this._router1.navigate(['/']))
  }

  attend_live(id) {
    this._service.attend(id)
      .then(data => {
        this._service.find_interest(this.interest)
          .then(data => {
            this.interest_lives = []
            for(let live of data.data) {
              this.interest_lives.push({live: live, user: live._user.username})
            }
            this._service.current_user()
              .then(data => {
                if(data.status) {
                  this.user_attending = data.data._attending
                }
              })
          })
      })
  }
  unattend_live(id) {
    this._service.unattend(id)
      .then(data => {
        this._service.find_interest(this.interest)
          .then(data => {
            this.interest_lives = []
            for(let live of data.data) {
              this.interest_lives.push({live: live, user: live._user.username})
            }
            this._service.current_user()
              .then(data => {
                if(data.status) {
                  this.user_attending = data.data._attending
                }
              })
          })
      })
  }

}
