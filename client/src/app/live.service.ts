import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import 'rxjs'
import { User } from './user'
import * as io from 'socket.io-client'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

@Injectable()
export class LiveService {
  private url = 'http://localhost:8000'
  private socket
  constructor(private _http: Http) {
    this.socket = io(this.url)
  }
  current_location(latitude, longitude) {
    return this._http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true')
      .map(data => data.json())
      .toPromise()
  }
  create_user(user: User) {
    return this._http.post('/create_user', user)
      .map(data => data.json())
      .toPromise()
  }
  validate_user(user: User) {
    return this._http.post('/validate_user', user)
      .map(data => data.json())
      .toPromise()
  }
  validate_fb_user(user: User) {
    return this._http.post('/validate_fb_user', user)
      .map(data => data.json())
      .toPromise()
  }
  current_user() {
    return this._http.get('/current_user')
      .map(data => data.json())
      .toPromise()
  }
  all_users() {
    return this._http.get('/all_users')
      .map(data => data.json())
      .toPromise()
  }
  follow_user(id) {
    return this._http.get(`/follow_user/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  unfollow_user(id) {
    return this._http.get(`/unfollow_user/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  create_live(data) {
    return this._http.post('/create_live', data)
      .map(data => data.json())
      .toPromise()
  }
  following_lives() {
    return this._http.get('/following_lives')
      .map(data => data.json())
      .toPromise()
  }
  attend(id) {
    return this._http.get(`/attend/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  unattend(id) {
    return this._http.get(`/unattend/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  find_interest(interest) {
    return this._http.post('/find_interest', interest)
      .map(data => data.json())
      .toPromise()
  }
  follow_interest(interest) {
    return this._http.post('/follow_interest', interest)
      .map(data => data.json())
      .toPromise()
  }
  unfollow_interest(interest) {
    return this._http.post('/unfollow_interest', interest)
      .map(data => data.json())
      .toPromise()
  }
  following_interests_lives() {
    return this._http.get('/user_interests')
      .map(data => data.json())
      .toPromise()
  }
  find_live(id) {
    return this._http.get(`/find_live/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  all_lives() {
    return this._http.get('/all_lives')
      .map(data => data.json())
      .toPromise()
  }
  user_attending() {
    return this._http.get('/user_attending')
      .map(data => data.json())
      .toPromise()
  }
  all_user_attending() {
    return this._http.get('/all_user_attending')
      .map(data => data.json())
      .toPromise()
  }
  other_user_attending(id) {
    return this._http.get(`/other_user_attending/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  other_user_info(id) {
    return this._http.get(`/other_user_info/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  user_lives() {
    return this._http.get('/user_lives')
      .map(data => data.json())
      .toPromise()
  }
  delete_live(id) {
    return this._http.get(`/delete_live/${id}`)
      .map(data => data.json())
      .toPromise()
  }
  user_follow_data() {
    return this._http.get('/user_follow_data')
      .map(data => data.json())
      .toPromise()
  }

  //socketsssss
  send_post(post) {
    this.socket.emit('post', post)
  }
  new_post() {
    let observable = new Observable(observer => {
      this.socket.on('new_post', data =>  observer.next(data))
    })
    return observable
  }
  user_post() {
    let observable = new Observable(observer => {
      this.socket.on('user_post', data =>  observer.next(data))
    })
    return observable
  }
  disconnect() {
    this.socket.disconnect()
  }

}
