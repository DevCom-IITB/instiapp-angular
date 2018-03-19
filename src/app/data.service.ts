import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnumContainer, UserProfile, UserEventStatus, Location, Event } from './interfaces';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import * as uriTemplates from 'uri-templates';
import { Subject } from 'rxjs/Subject';
import { API } from '../api';

let JSON_HEADERS = new HttpHeaders();
JSON_HEADERS = JSON_HEADERS.set('Content-Type', 'application/json');

const HOST = environment.host;
const SSO_REDIR = HOST + 'login'; /* Has to be absolute URL */
const SSOHOST = environment.sso_host;
const CLIENT_ID = environment.sso_client_id;

/** Main data service */
@Injectable()
export class DataService {

  /** True to show the global toolbar */
  public showToolbar = true;

  /** Detailed events */
  public eventsDetailed: Event[] = [] as Event[];

  /** If user is logged in */
  public loggedIn = false;
  public loggedInObservable: Observable<boolean>;
  private loggedInSubject: Subject<boolean>;

  /** User Profile of the logged in user */
  public currentUser: UserProfile;

  constructor(private http: HttpClient, public router: Router) {
    /* Initialize */
    this.loggedInSubject = new Subject<boolean>();
    this.loggedInObservable = this.loggedInSubject.asObservable();
  }

  /**
   * Fire a URI template or URL with GET verb
   * @param uriTemplate URI Template or URL
   * @param options Options to fill in URI Template
   */
  FireGET<T>(uriTemplate: string, options: any = {}): Observable<T> {
    return this.http.get<T>(this.FillURITemplate(HOST + uriTemplate, options));
  }

  /**
   * Fire a URI template or URL with PUT verb
   * @param uriTemplate URI Template or URL
   * @param body Body to PUT
   * @param options Options to fill in URI Template
   */
  FirePUT<T>(uriTemplate: string, body: any = null, options: any = {}): Observable<T> {
    return this.http.put<T>(this.FillURITemplate(HOST + uriTemplate, options), body);
  }

  /**
   * Fire a URI template or URL with POST verb
   * @param uriTemplate URI Template or URL
   * @param body Body to POST
   * @param options Options to fill in URI Template
   */
  FirePOST<T>(uriTemplate: string, body: any = null, options: any = {}): Observable<T> {
    return this.http.post<T>(this.FillURITemplate(HOST + uriTemplate, options), body);
  }

  /**
   * Fire a URI template or URL with DELETE verb
   * @param uriTemplate URI Template or URL
   * @param options Options to fill in URI Template
   */
  FireDELETE<T>(uriTemplate: string, options: any = {}): Observable<T> {
    return this.http.delete<T>(this.FillURITemplate(HOST + uriTemplate, options));
  }

  /**
   * Fill URI Templates according to RFC 6570
   * @param uriTemplate URI Template to fill
   * @param options Options to fill URI with
   */
  FillURITemplate(uriTemplate: string, options: any): string {
    const URITemplate = uriTemplates(uriTemplate);
    return URITemplate.fill(options);
  }

  /** Uploads a static image to the server */
  UploadImage(image: File): Observable<any> {
    return Observable.create(observer => {
      this.GetBase64(image).subscribe(result => {
        return this.FirePOST(API.PostImage, {picture: result}).subscribe(httpresult => {
          observer.next(httpresult);
          observer.complete();
        }, (error) => observer.error(error.message));
      }, (error) => observer.error(error.message));
    });
  }

  /** Returns an observable with the base64 representaion of a file */
  GetBase64(file: File): Observable<string> {
    return Observable.create(observer => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (() => {
        observer.next(reader.result);
        observer.complete();
      });

      reader.onerror = ((error) => {
        observer.error(new Error(error.message));
      });
    });
  }

  /**
   * Gets a list of all users
   */
  GetUsersList(): Observable<UserProfile[]> {
    return this.FireGET<UserProfile[]>(API.UserList);
  }

  /**
   * Gets an EnumContainer with all events
   * related to bodies the user follows
   * @param uuid UUID of user
   */
  GetUserFollowedBodiesEvents(uuid: string): Observable<EnumContainer> {
    return this.FireGET<EnumContainer>(API.UserFollowedEvents, {uuid: uuid});
  }

  /**
   * Get all events currently stored
   */
  GetAllEvents(): Observable<EnumContainer> {
    return this.FireGET<EnumContainer>(API.Events);
  }

  /** Get detailed information on an event */
  GetEvent(uuid: string): Observable<Event> {
    return this.FireGET<Event>(API.Event, {uuid: uuid});
  }

  /** Fills the event with uuid into the cache and returns it */
  FillGetEvent(uuid: string): Observable<Event> {
    const index = this.eventsDetailed.findIndex(m => m.id === uuid);
    return Observable.create(observer => {
      if (index === -1) {
        this.GetEvent(uuid).subscribe(result => {
          result.venues_str = result.venues.map(v => v.name).join(', ');
          this.eventsDetailed.push(result);
          observer.next(result);
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
      } else {
        observer.next(this.eventsDetailed[index]);
        observer.complete();
      }
    });
  }

  PostEvent(body: any): Observable<Event> {
    return this.FirePOST<Event>(API.Events, body);
  }

  /** Get all locations */
  GetAllLocations(): Observable<Location[]> {
    return this.FireGET<Location[]>(API.Locations);
  }

  /** Gets the current user if logged in
   * The result is cached
   */
  GetFillCurrentUser(): Observable<UserProfile> {
    return Observable.create(observer => {
      if (!this.currentUser) {
        this.FireGET<any>(API.LoggedInUser).subscribe(result => {
          this.loggedIn = true;
          this.currentUser = result.profile;
          console.log(this.currentUser.name + ' is logged in');
          observer.next(this.currentUser);
          this.loggedInSubject.next(true);
          observer.complete();
        }, (error) => {
          console.log(error.error);
          observer.error(error);
        });
      } else {
        observer.next(this.currentUser);
        observer.complete();
      }
    });
  }

  /** Gets SSO URL */
  GetLoginURL() {
    const RESPONSE_TYPE = 'code';
    const SCOPE = 'basic profile picture sex ldap phone insti_address program secondary_emails';

    return SSOHOST +
            '?client_id=' + CLIENT_ID +
            '&response_type=' + RESPONSE_TYPE +
            '&scope=' + SCOPE +
            '&redirect_uri=' + SSO_REDIR;
  }

  /** Tries to authenticate with the given code */
  AuthenticateSSO(code: string) {
    return this.FireGET(API.Login, {code: code, redir: SSO_REDIR});
  }

  /** Logout the current user */
  Logout() {
    return this.FireGET(API.Logout).subscribe(() => {
      this.loggedIn = false;
      this.loggedInSubject.next(false);
      this.currentUser = null;
    });
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
        day + daySuffix + ' ' + monthNames[monthIndex];
  }

}
