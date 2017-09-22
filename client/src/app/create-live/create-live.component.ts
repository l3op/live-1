import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalModule} from "ngx-modal"
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { Live } from '../live'
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';

@Component({
  selector: 'app-create-live',
  template: `
  <div class='container'>
    <h2>C R E A T E &ensp; L I V E</h2>
    <button md-dialog-close class='close-button'> </button>
    <form #form='ngForm' #form2>
        <input type="text" name="title" placeholder="T I T L E" required maxlength="45" (click)='error.title = true'
        #liveTitle='ngModel' [ngClass]="{'untouched': liveTitle.invalid, 'touched': liveTitle.valid}" [(ngModel)]='live.title'><br>
        <span *ngIf='liveTitle.invalid && error.title' class='user-error error-one'>Your title can't be more than 45 characters.</span>

        <input type="file" name="image" style="display:none;" id='uploader' >

        <input type="date" name="date" min="{{now | date:'yyyy-MM-dd' }}" [(ngModel)]='date' required (click)='error.date = true'
        #liveDate='ngModel' [ngClass]="{'untouched': liveDate.invalid, 'touched': liveDate.valid}" [(ngModel)]='live.date'><br>
        <span *ngIf='liveDate.invalid && error.date' class='user-error error-two'>Select the date for your new live.</span>

        <input type="time" name="time" [(ngModel)]='time' required (click)='error.time = true' [(ngModel)]='live.time'
        #liveTime='ngModel' [ngClass]="{'untouched': liveTime.invalid, 'touched': liveTime.valid}" ><br>
        <span *ngIf='liveTime.invalid && error.time' class='user-error error-three'>Select the time for your new live.</span>

        <input #search type="text" placeholder="L O C A T I O N" autocomplete="off" class="form-control" spellcheck="off"
        [ngClass]="{'location-invalid': error.location == false, 'location-valid': error.location}" autocapitalize="off"
        [formControl]="searchControl" required (click)='error.location = true'  ><br>

          <div  class='image' [ngClass]="{'upload': error.image == false, 'uploaded': error.image}">
            <img src="assets/upload.png" (click)='open_upload()' class='upload-button' (click)='error.image = true'>
            <span *ngIf='error.image == false'> U P L O A D &ensp; I M A G E</span>
            <span *ngIf='error.image'>I M A G E &ensp; U P L O A D E D</span>
          </div>

        <input type="hidden" name="interests" value='{{interests}}'>
        <input type="hidden" name="address" value='{{full_address}}'>
        <input type="hidden" name="city" value='{{city}}'>
        <input type="hidden" name="latitude" value='{{latitude}}'>
        <input type="hidden" name="longitude" value='{{longitude}}'>
        <input type="hidden" name="date_time"  id="dateTime">

        <button md-dialog-close (click)='post_data()' class='submit' [ngClass]="{'create': form.invalid || !error.image || !error.location, 'created': form.valid && error.image && error.location}"
        [disabled]='form.invalid || !error.image || !error.location'>D O N E</button>
    </form>

    <div class='tags'>
    <button (click)='status.tech = !status.tech' (click)='add_interest("Tech", status.tech)' [ngClass]='{select: status.tech, unselect: !status.tech}'>Tech</button> <button (click)='status.food = !status.food' (click)='add_interest("Food", status.food)' [ngClass]='{select: status.food, unselect: !status.food}'>Food</button>
    <button (click)='status.family = !status.family' (click)='add_interest("Family", status.family)' [ngClass]='{select: status.family, unselect: !status.family}'>Family</button> <button (click)='status.love = !status.love' (click)='add_interest("Love", status.love)' [ngClass]='{select: status.love, unselect: !status.love}'>Love</button>
    <button (click)='status.music = !status.music' (click)='add_interest("Music", status.music)' [ngClass]='{select: status.music, unselect: !status.music}'>Music</button> <button (click)='status.nature = !status.nature' (click)='add_interest("Nature", status.nature)' [ngClass]='{select: status.nature, unselect: !status.nature}'>Nature</button>
    <button (click)='status.coding = !status.coding' (click)='add_interest("Coding", status.coding)' [ngClass]='{select: status.coding, unselect: !status.coding}'>Coding</button> <button (click)='status.fitness = !status.fitness' (click)='add_interest("Fitness", status.fitness)' [ngClass]='{select: status.fitness, unselect: !status.fitness}'>Fitness</button>
    </div>

  </div>
  `,
  styles: [
    '.tags { transform: translate(-50%); position: absolute; bottom: 100px; left: 50%; }',
    '.select { background-color: #EAE5E5; border-radius: 2px; border: none; padding: 5px 10px; margin: 3px; color: black; }',
    '.unselect {  background-color: black; border-radius: 2px; border: none; padding: 5px 10px; margin: 3px; color: white;  }',
    '.container { transform: translate(-50%); position: absolute; top: 10%; left: 50%; background-color: white; width: 650px; height: 650px; border-radius: 20px; }',
    'h2 { font-weight: 200; top: 20px; left: 50%; transform: translate(-50%); position: absolute; color: #979797; font-size: 1.4em; }',
    'form { top: 120px; left: 50%; transform: translate(-50%); position: absolute; text-align: center; }',
    'input { border: none;  width: 200px; font-size: .6em; padding-bottom: 10px; margin-bottom: 50px;  }',
    '.untouched { border-bottom: 1px solid #979797; color: #979797; }', '.touched { border-bottom: 1px solid black; color: black; }',
    '.location-invalid { border-bottom: 1px solid #979797; color: #979797; }', '.location-valid { border-bottom: 1px solid black; color: black; }',
    '.submit {  border-radius: 50px; position: absolute; bottom: -180px; left: 50%; transform: translate(-50%);  width: 200px; padding: 10px; font-size: .9em; }',
    '.create { background-color: unset; border: 1.5px solid #979797; color: #979797; }', '.created { background-color: black; border: none; color: white; }',
    '.image { transform: translate(-50%); position: absolute; bottom: -30px; left: 50%; width: 400px; text-align: center; }',
    '.upload { color: #979797;  }', '.uploaded { color: black;  }', '.image span { font-size: .6em; position: relative; left: 15px; bottom: 15px; }',
    '.upload-button {width: 40px; }', '.user-error { position: absolute; font-size: .5em; color: red;  }',
    '.error-one { bottom: 270px; }', '.error-two { bottom: 190px; }', '.error-three { bottom: 105px; }',
  ]
})
export class CreateLiveComponent implements OnInit {
  live: Live
  interests = []
  now: Date
  status: object
  date = ''
  time = ''
  error = {title: false, image: false, date: false, time: false, location: false}
  //google maps
  address: any
  full_address: string
  city: string
  public latitude: number
  public longitude: number
  public searchControl: FormControl
  public zoom: number
  @ViewChild('search')
  public searchElementRef: ElementRef

  @ViewChild('form2') my_form  //I needed 2 form names because #form1 is tied to ngModel and #form2 is used here
  constructor(private _service: LiveService, private _router: Router,
              private _mapsAPILoader: MapsAPILoader, private _ngZone: NgZone) { }

  ngOnInit() {
    this.now = new Date(new Date().getTime() + 60*24*60*1000)  //getting yesterday's time
    this.interests = []
    this.address = {street_number: '', route: '', locality: '', administrative_area_level_1: '', country: '', postal_code: ''}
    this.status = { tech: true, family: true, food: true, love: true, music: true, nature: true, fitness: true, coding: true}
    this.live = new Live

    //google maps
    this.zoom = 8
    this.latitude = 39.8282
    this.longitude = -98.5795

    this.searchControl = new FormControl()
    this.setCurrentPosition()
    this._mapsAPILoader.load()
      .then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['address']
        })
        autocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace()
            if(place.geometry === undefined || place.geometry === null) {
              return
            }
            for(var i=0; i<place.address_components.length; i++) {
              if(place.address_components[i].types[0] in this.address) {
                this.address[place.address_components[i].types[0]] = place.address_components[i].short_name
              }
            }
            this.full_address = `${this.address.street_number} ${this.address.route}, ${this.address.locality}, ${this.address.administrative_area_level_1} ${this.address.country} ${this.address.postal_code}`
            this.city = this.address.locality
            this.latitude = place.geometry.location.lat()
            this.longitude = place.geometry.location.lng()
            this.zoom = 18
          })
        })
      })
  }

  private setCurrentPosition() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.zoom = 18
      })
    }
  }
  open_upload() {
    document.getElementById('uploader').click()
  }
  post_data() {
    var inputValue = <HTMLInputElement>document.getElementById("dateTime")
    inputValue.value =  "" + new Date(`${this.date} ${this.time}`)
    let form_data = new FormData(this.my_form.nativeElement)
    this._service.create_live(form_data)
      .then(data => {
        this.interests = []
      })
      .catch(error => console.log(error))
  }
  add_interest(val, status) {
    if(!status) {
      this.interests.push(val)
    } else {
      let index = this.interests.indexOf(val)
      this.interests.splice(index, 1)
    }
  }

}
