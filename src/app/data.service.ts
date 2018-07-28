import { Injectable } from '@angular/core';
import { Observable ,  Subject, noop } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEnumContainer, IUserProfile, ILocation, IEvent, IBody, INewsEntry, INotification } from './interfaces';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import * as uriTemplates from 'uri-templates';
import { API } from '../api';
import { Location } from '@angular/common';
import { Helpers } from './helpers';
import { Title } from '@angular/platform-browser';

let JSON_HEADERS = new HttpHeaders();
JSON_HEADERS = JSON_HEADERS.set('Content-Type', 'application/json');

const HOST = environment.host;
const SSO_REDIR = HOST + 'login'; /* Has to be absolute URL */
const SSOHOST = environment.sso_host;
const CLIENT_ID = environment.sso_client_id;

/** Main data service */
@Injectable()
export class DataService {

  /** Detailed events */
  public eventsDetailed: IEvent[] = [] as IEvent[];

  /** If user is logged in */
  private _initialized = false;
  private _loggedIn = false;
  private _loggedInSubject: Subject<boolean>;
  public loggedInObservable: Observable<boolean>;

  /* Observable for title */
  private _titleSubject: Subject<string>;
  public titleObservable: Observable<string>;

  /** User Profile of the logged in user */
  private _currentUser: IUserProfile;

  /** Notifications */
  public notifications: INotification[];

  /** Function called when user reaches bottom of content */
  public scrollBottomFunction = noop;

  /* Constants */
  public LOGIN_REDIR = 'login_redir';
  public LS_USER = 'user_profile';

  /** Running in a sandbox */
  public isSandbox = false;

  constructor(
    private http: HttpClient,
    public router: Router,
    public location: Location,
    public titleService: Title,
  ) {
    /* Initialize */
    this._loggedInSubject = new Subject<boolean>();
    this.loggedInObservable = this._loggedInSubject.asObservable();

    this._titleSubject = new Subject<string>();
    this.titleObservable = this._titleSubject.asObservable();
  }

  /**
   * Encode an object for passing through URL
   * @param o Object to encode
   */
  EncodeObject(o: any): string { return encodeURIComponent(btoa(JSON.stringify(o))); }

  /**
   * Decode an object encoded with "EncodeObject"
   * @param s Encoded string
   */
  DecodeObject<T>(s: string): T { return JSON.parse(atob(decodeURIComponent(s))) as T; }

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
   * Fire a URI template or URL with PATCH verb
   * @param uriTemplate URI Template or URL
   * @param body Body to PATCH
   * @param options Options to fill in URI Template
   */
  FirePATCH<T>(uriTemplate: string, body: any = null, options: any = {}): Observable<T> {
    return this.http.patch<T>(this.FillURITemplate(HOST + uriTemplate, options), body);
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

    });
  }

  /**
   * Get all events currently stored
   */
  GetAllEvents(): Observable<IEnumContainer> {
    return this.FireGET<IEnumContainer>(API.Events);
  }

  /** Get detailed information on an event */
  GetEvent(uuid: string): Observable<IEvent> {
    return this.FireGET<IEvent>(API.Event, {uuid: uuid});
  }

  /** Fills the event with uuid into the cache and returns it */
  FillGetEvent(uuid: string): Observable<IEvent> {
    const index = this.eventsDetailed.findIndex(m => m.id === uuid);
    return Observable.create(observer => {
      if (index === -1) {
        this.GetEvent(uuid).subscribe(result => {
          result.venues_str = result.venues.map(v => v.short_name).join(', ');
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

  PostEvent(body: any): Observable<IEvent> {
    return this.FirePOST<IEvent>(API.Events, body);
  }

  PutEvent(id: string, body: any): Observable<IEvent> {
    return this.FirePUT<IEvent>(API.Event, body, {uuid: id});
  }

  /** Get all locations */
  GetAllLocations(): Observable<ILocation[]> {
    return this.FireGET<ILocation[]>(API.Locations);
  }

  /** Gets the current user if logged in
   * The result is cached
   */
  GetFillCurrentUser(): Observable<IUserProfile> {
    return Observable.create(observer => {
      if (!this._currentUser) {
        /* Try to get from localStorage */
        if (localStorage.getItem(this.LS_USER) !== null) {
          const user = JSON.parse(localStorage.getItem(this.LS_USER));
          this.loginUser(observer, user, false);
          this.updateUser();
          return;
        }

        /* Fire a get */
        this.FireGET<any>(API.LoggedInUser).subscribe(result => {
          this.loginUser(observer, result.profile, true);
        }, (error) => {
          observer.error(error);
        });

      } else {
        observer.next(this._currentUser);
        observer.complete();
      }
    });
  }

  /** Helper to log in the user with the given user object */
  loginUser(observer: any, profile: IUserProfile, setLocal: Boolean) {
    this._loggedIn = true;
    this._currentUser = profile;

    /* Set local storage */
    if (setLocal) {
      localStorage.setItem(this.LS_USER, JSON.stringify(profile));
      console.log(this._currentUser.name + ' is logged in');
    }

    observer.next(this._currentUser);
    this._loggedInSubject.next(true);
    observer.complete();
  }

  /** Updates the current user profile */
  updateUser() {
    if (!this._loggedIn) { return; }

    /* Update the profile */
    this.FireGET<any>(API.LoggedInUser).subscribe(result => {
      this._currentUser = result.profile;
      this._loggedInSubject.next(true);
    }, (error) => {
      if (error.status === 401) {
        alert('Your session has expired');
        this.PostLogout();
      }
      this._loggedInSubject.next(false);
    });
  }

  /** Gets SSO URL */
  GetLoginURL() {
    const RESPONSE_TYPE = 'code';
    const SCOPE = 'basic profile picture sex ldap phone insti_address program secondary_emails';

    return `${SSOHOST}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${SSO_REDIR}`;
  }

  /** Tries to authenticate with the given code */
  AuthenticateSSO(code: string) {
    return this.FireGET(API.Login, {code: code, redir: SSO_REDIR});
  }

  /** Logout the current user */
  Logout() {
    return this.FireGET(API.Logout).subscribe(() => {
      this.PostLogout();
    });
  }

  /** Chores to carry out after logout */
  PostLogout() {
    this._loggedIn = false;
    this._loggedInSubject.next(false);
    this._currentUser = null;
    localStorage.removeItem(this.LS_USER);
  }

  /**
   * Gets a list of minimal bodies for which the user has the listed permission
   * @param permission Any of `AddE`, `UpdE`, `DelE`, `Role`
   */
  GetBodiesWithPermission(permission: string): IBody[] {
    if (!this._loggedIn) { return []; }

    const bodies: IBody[] = [] as IBody[];
    for (const role of this._currentUser.roles) {
      if ((role.permissions.includes(permission))) {
        for (const body of role.bodies) {
          if (!bodies.map(m => m.id).includes(role.body)) {
            bodies.push(body);
          }
        }
      }
    }
    return bodies;
  }

  /** Returns true if the user has the permission for the body */
  HasBodyPermission(bodyid: string, permission: string) {
    return this.GetBodiesWithPermission(permission).map(m => m.id).indexOf(bodyid) !== -1;
  }

  /** Returns true if the user has permission to edit the event */
  CanEditEvent(event: IEvent): boolean {
    for (const body of event.bodies) {
      if (this.HasBodyPermission(body.id, 'UpdE')) {
        return true;
      }
    }
    return false;
  }

  /** Return true if the current user can delete the event */
  CanDeleteEvent(event: IEvent): boolean {
    for (const body of event.bodies) {
      if (!this.HasBodyPermission(body.id, 'DelE')) {
        return false;
      }
    }
    return true;
  }

  /** Mark a UNR for the current user */
  MarkUNR(news: INewsEntry, reaction: number) {
    return this.FireGET(API.NewsFeedReaction, {uuid: news.id, reaction: reaction});
  }

  /** Gets concatenated going and interested events for current User */
  getFollowedEvents(): IEvent[] {
    if (!this._loggedIn) { return []  as IEvent[]; }
    return this._currentUser.events_going.concat(
      this._currentUser.events_interested);
  }

  /** Navigates to the previous page */
  navigateBack() {
    this.location.back();
  }

  /** Is this a small width device */
  isMobile(maxwidth = 767) {
    return window.matchMedia(`(max-width: ${maxwidth}px)`).matches;
  }

  /* Define any aliases here */
  GetDate = (obj: any) => Helpers.GetDate(obj);
  processMDHTML = (html: string) => Helpers.processMDHTML(html);

  /* Getters and setters */

  /** If login is initialized */
  isInitialized(): boolean {
    return this._initialized;
  }

  /** If login is initialized */
  setInitialized() {
    this._initialized = true;
  }

  /** Return true if someone is logged in */
  isLoggedIn() {
    return this._loggedIn;
  }

  /** Current user profile: Check if logged in first */
  getCurrentUser() {
    return this._currentUser;
  }

  /** Set the HTML title */
  setTitle(title: string) {
    this.titleService.setTitle(`InstiApp | ${title}`);
    this._titleSubject.next(title);
  }

  /** Get unread notifications */
  getUnreadNotifications() {
    return this.notifications.filter(n => n.unread && n.actor);
  }

}
