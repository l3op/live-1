import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalModule } from "ngx-modal"
import { MdDialog } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { User } from '../user'
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-authorization',
  template: `
  <div class='container'>
  <h2  *ngIf='status == true'>S I G N &ensp; U P</h2>
  <h2  *ngIf='status == false'>L O G  &ensp; I N</h2>
  <button md-dialog-close class='close-button' (click)='cancel()'> </button>
  <form *ngIf='status == true' #formOne='ngForm'>
      <input type="text" name="username" placeholder="F U L L &ensp; N A M E" [(ngModel)]='user.fullname' required minlength='2'
       #fullName='ngModel' [ngClass]="{'untouched': fullName.invalid, 'touched': fullName.valid}" (click)='error.fullname = true'><br>
       <span *ngIf='fullName.invalid && error.fullname' class='user-error error-one'>Your name should be more than 2 characters.</span>

      <input type="email" name="email" placeholder=" E M A I L" [(ngModel)]='user.email' required (click)='error.email = true' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
      #email='ngModel' [ngClass]="{'untouched': email.invalid, 'touched': email.valid}"><br>
      <span *ngIf='fullName.invalid && error.email' class='user-error error-two'>Enter a valid email.</span>

      <input type="password" name="password" placeholder="P A S S W O R D" [(ngModel)]='user.password' required pattern='^([a-zA-Z0-9@*#.,]{5,20})$' (click)='error.password = true'
      #password='ngModel' [ngClass]="{'untouched': password.invalid, 'touched': password.valid}"><br>
      <span *ngIf='fullName.invalid && error.password' class='user-error error-three'>Your password should be at least 6 characters.</span>

      <p class='or'>O R</p>
      <button md-dialog-close (click)='post_data()' 
       [disabled]='formOne.invalid'
       [ngClass]="{'undone': formOne.invalid, 'done': formOne.valid}">D O N E</button>
  </form>

  <form *ngIf='status == false' #formTwo='ngForm'>
      <input type="text" name="nothing" id='nothing' disabled><br>
      <input type="email" name="username" placeholder="E M A I L" [(ngModel)]='log_user.email' #logEmail='ngModel'
       required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" [ngClass]="{'untouched': logEmail.invalid, 'touched': logEmail.valid}"><br>
      <input type="password" name="password" placeholder="P A S S W O R D" [(ngModel)]='log_user.password' #logPassword='ngModel'
      required pattern='^([a-zA-Z0-9@*#.,]{5,20})$' [ngClass]="{'untouched': logPassword.invalid, 'touched': logPassword.valid}"><br>

      <p class='or'>O R</p>
      <button (click)='post_data()'
       [disabled]='formTwo.invalid'
       [ngClass]="{'undone': formTwo.invalid, 'done': formTwo.valid}">D O N E</button>
       <span *ngIf='error_message' class='user-error error-four'>{{error_message}}</span>
       <span *ngIf='error_no_email' class='user-error error-five'>{{error_no_email}}</span>
  </form>

    <section class='social-media-container'>
    <button (click)='fb_login()' class='facebook social-media' > <img src="assets/facebook.png" alt="fb"> </button>
    <button  class='google social-media'> <img src="assets/google-plus.png" alt="google"> </button>
    </section>

  <p class='bottom-info' *ngIf='status == true'>Already have an account? <span (click)='change_view(status)'>Log In</span></p>
  <p class='bottom-info' *ngIf='status == false'>You don't have an account? <span (click)='change_view(status)'>Sign Up</span></p>
  </div>
  `,
  styles: [
    '.container { transform: translate(-50%); position: absolute; top: 10%; left: 50%; background-color: white; width: 550px; height: 550px; border-radius: 20px; }',
    'h2 { font-weight: 200; top: 20px; left: 50%; transform: translate(-50%); position: absolute; color: #979797; font-size: 1.4em; }',
    'form { top: 120px; left: 50%; position: absolute; transform: translate(-50%); text-align: center;}',
    'input { border: none;  width: 200px; font-size: .6em; padding-bottom: 10px; margin-bottom: 50px;  }',
    '.untouched { border-bottom: 1px solid #979797; color: #979797; }', '.touched { border-bottom: 1px solid black; color: black; }',
    '.or { font-size: .6em; color: #979797; top: 220px; position: absolute; }',
    '.bottom-info { top: 500px; left: 50%; transform: translate(-50%); position: absolute; font-size: .7em; color: #979797; font-weight: 100; }',
    '.bottom-info span { color: aqua; }', '#nothing { border: none; }', '.body-overlay {  background-color: rgba(0,0,0,.2); }',
    '.user-error { position: absolute; font-size: .5em; color: red;  }', '.error-one { bottom: 185px; }', '.error-two { bottom: 105px; }',
    '.error-three { bottom: 25px; right: 33px; }', '.error-four { bottom: 25px; left: 1px; }'
  ]
})
export class AuthorizationComponent implements OnInit {
  user: User
  log_user: User
  error_message = ''
  error_no_email = ''
  error = {fullname: false, email: false, password: false}
  public status: Boolean
  public background: any

  constructor(private _service: LiveService, private _router: Router, private dialog: MdDialog, private fb: FacebookService) {
      let initParams: InitParams = {
        appId: '509166712750511',
        xfbml: true,
      version: 'v2.8'
      }
      fb.init(initParams)
  }

  ngOnInit() {
    this.user = new User
    this.log_user = new User
  }

  change_view(val) {
    if(val) {
      this.status = false
    } else {
      this.status = true
    }
  }
  cancel() {
    this.background = false
  }
  post_data() {
    if(this.status) {
      this._service.create_user(this.user)
        .then(data => {
          if(data) {
            this.user = new User
            this._router.navigate(['/home'])
          } else {
            this.user = new User
          }
        })
        .catch(error => console.log(error))
    } else {
      this._service.validate_user(this.log_user)
        .then(data => {
          if(data) {
            this.log_user = new User
            this.dialog.closeAll();
            this._router.navigate(['/home'])
          } else {
            this.error_no_email = ''
            this.error_message = 'Invalid Credentials'

            this.log_user = new User

          }
        })
        .catch(error => console.log(error))
    }
  }

  fb_login() {
    this.fb.getLoginStatus()
      .then(response => { //if you arent logged in it brings up the fb log in pop up
        if(response.status == 'connected') {
            this._router.navigate(['/home'])
        } else {
          this.fb.login({scope: 'public_profile,email'})
            .then((response2) => {
              this.fb.api('/me?fields=id,name,email')
                .then(response3 => {
                  if(!response3.email) { //this means if you didnt authorize the app to access your email.
                    this.error_message = ''
                    this.error_no_email = 'You must sign up with your email'
                    return
                  }
                  var new_user = new User
                  new_user.fullname = response3.name
                  new_user.email = response3.email
                  new_user.password = 'Password1.'
                  this._service.create_user(new_user)
                    .then(data => {
                      if(data) {
                        this.dialog.closeAll()
                        this._router.navigate(['/home'])
                      } else {
                        this._service.validate_fb_user(new_user)
                          .then(data => {
                            this.dialog.closeAll()
                            this._router.navigate(['/home'])
                          })
                      }
                    })
                    .catch(error => console.log(error))
                })
            })
        }
      })
      .catch(error => console.log(error))
  }

}
