import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnumContainer, UserProfile, UserEventStatus, Location, Event } from './interfaces';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import * as uriTemplates from 'uri-templates';

let JSON_HEADERS = new HttpHeaders();
JSON_HEADERS = JSON_HEADERS.set('Content-Type', 'application/json');

const Host = 'https://temp-iitb.radialapps.com/';
const ApiGetUserList = 'api/users';
const ApiGetUserFollowedEvents = 'api/users/{uuid}/followed_bodies_events';
const ApiGetEvents = 'api/events';

/** Main data service */
@Injectable()
export class DataService {

  constructor(private http: HttpClient, public router: Router) { }

  FireGET<T>(uriTemplate: string, options: any = {}): Observable<T> {
    return this.http.get<T>(this.FillURITemplate(Host + uriTemplate, options));
  }

  FirePUT<T>(uriTemplate: string, body: any = null, options: any = {}): Observable<T> {
    return this.http.put<T>(this.FillURITemplate(Host + uriTemplate, options), body);
  }

  FirePOST<T>(uriTemplate: string, body: any = null, options: any = {}): Observable<T> {
    return this.http.post<T>(this.FillURITemplate(Host + uriTemplate, options), body);
  }

  FireDELETE<T>(uriTemplate: string, options: any = {}): Observable<T> {
    return this.http.delete<T>(this.FillURITemplate(Host + uriTemplate, options));
  }

  FillURITemplate(uriTemplate: string, options: any): string {
    const URITemplate = uriTemplates(uriTemplate);
    return URITemplate.fill(options);
  }

  GetUsersList(): Observable<UserProfile[]> {
    return this.FireGET<UserProfile[]>(ApiGetUserList);
  }

  GetUserFollowedBodiesEvents(uuid: string): Observable<EnumContainer> {
    return this.FireGET<EnumContainer>(ApiGetUserFollowedEvents, {uuid: uuid});
  }

  /** DEPRACATED */
  GetAllEvents(): Observable<EnumContainer> {
    return this.FireGET<EnumContainer>(ApiGetEvents);
  }

  /** Adds leading zeros to a number */
  zeroPad(num, places) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
  }

  /**Returns a human readable representation of a Date */
  public GetDate(obj: any): string {
    const date = new Date(obj);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December' ];
    let daySuffix = 'th';
    if (day % 10 === 1) {
      daySuffix = 'st';
    } else if (day % 10 === 2) {
      daySuffix = 'nd';
    }
    return this.zeroPad(hours, 2) + ':' + this.zeroPad(minutes, 2) + ' | ' +
        day + daySuffix + ' ' + monthNames[monthIndex + 1];
  }

}
