import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LiveService } from '../live.service'
import { ModalModule } from "ngx-modal"
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public live: any
  longitude: Number
  latitude: Number
  address: String
  constructor() { }

  ngOnInit() {
    this.address = this.live.location
    this.latitude = Number(this.live.latitude)
    this.longitude = Number(this.live.longitude)
  }

}
