import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { ModalModule } from "ngx-modal"
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'app-post',
  template: `
  <div class='container'>
    <h2>N E W &ensp; P O S T</h2>
    <button md-dialog-close class='close-button' > </button>
    <form #form="ngForm">
    <textarea name="post" rows="5" cols="60" [(ngModel)]='post' required maxlength="100" minlength='1' #userPost="ngModel"
    [ngClass]="{'untouched': userPost.invalid, 'touched': userPost.valid}"></textarea>
    <span [ngClass]= "{'valid-length': userPost.valid, 'invalid-length': userPost.invalid }">{{ 100 - post.length}}</span>

    <button md-dialog-close (click)='post_data()' [disabled]='form.invalid'
    [ngClass]="{'undone-post': form.invalid, 'done-post': form.valid}">Submit</button>
    </form>
  </div>
  `,
  styles: [
    '.container { transform: translate(-50%); position: absolute; top: 10%; left: 50%; background-color: white; width: 350px; height: 350px; border-radius: 20px; }',
    'h2 { font-weight: 200; top: 20px; left: 50%; transform: translate(-50%); position: absolute; color: #979797; font-size: 1.4em; }',
    'form { top: 120px; left: 50%; transform: translate(-50%); position: absolute; text-align: center; }',
    'textarea { border: none;  width: 250px; font-size: .6em; padding-bottom: 10px; }',
    '.untouched { border-bottom: 1px solid #979797; color: #979797; }',
    '.touched { border-bottom: 1px solid black; color: black; }',
    'form span { position: relative; font-size: .5em; left: 120px; }',
    '.valid-length {  color: black; }',
    '.invalid-length {  color: red; }',
    '.undone-post {  background-color: unset; border: 1.5px solid #979797;  color: #979797;  }',
    '.done-post {  background-color: black;  color: white;  border: none; }',
    '.undone-post, .done-post {border-radius: 50px;  position: absolute;  top: 150px; left: 50%;  transform: translate(-50%); width: 200px; padding: 10px;  font-size: .9em;  }'
  ]
})
export class PostComponent implements OnInit {
  public live: any
  post = ''
  user_id = ''
  constructor(private _service: LiveService, private _router: Router) { }

  ngOnInit() {
    this._service.current_user()
      .then(data => {
        if(data.status) {
          this.user_id = data.data._id
        } else {
          this._router.navigate(['/'])
        }
      })
      .catch(() => this._router.navigate(['/']))
  }
  post_data() {
    this._service.send_post({post: this.post, live_id: this.live, user_id: this.user_id})
    this.post = ''
    this._router.navigate(['/live', this.live])
  }

}
