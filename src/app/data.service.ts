import { Injectable } from '@angular/core';
import { Observable, Subject, noop } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import {
  IEnumContainer,
  IUserProfile,
  ILocation,
  IEvent,
  IBody,
  INewsEntry,
  INotification,
  ICommunity,
  ICommunityPost,
  IPath,
} from './interfaces';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import * as uriTemplates from 'uri-templates';
import { API } from '../api';
import { Location } from '@angular/common';
import { Helpers } from './helpers';
import { Title } from '@angular/platform-browser';
import { WinRT } from './windows';
// import { setWithCredentials } from 'ol/featureloader';
// import { error } from 'console';
/** Headers for injection for quick use */
let JSON_HEADERS = new HttpHeaders();
JSON_HEADERS = JSON_HEADERS.set('Content-Type', 'application/json');

/** The hoste the app is being served on */
const HOST = environment.apiUrl;

/** Absolute SSO redirection URL */
const SSO_REDIR = environment.host + 'login'; /* Has to be absolute URL */

/** SSO host address */
const SSOHOST = environment.sso_host;

/** SSO client id */
const CLIENT_ID = environment.sso_client_id;

/** Main data service */
@Injectable()
export class DataService {
  /** Detailed events */
  public eventsDetailed: IEvent[] = [] as IEvent[];
  public groupDetailed: ICommunity[] = [] as ICommunity[];
  public postDetailed: ICommunityPost[] = [] as ICommunityPost[];

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

  public originAndDestinationData: IPath;

  /** Function called when user reaches bottom of content */
  public scrollBottomFunction = noop;

  /* Constants */
  public LOGIN_REDIR = 'login_redir';
  public LS_USER = 'user_profile';
  public SESSION_ID = 'session_id';

  /** Running in a sandbox */
  public isSandbox = false;

  /** True when the user is/has just scrolled down */
  private _scrollingDown = false;

  /** Achievement offer types cache */
  private achievementOfferTypes: {
    name: string;
    code: string;
  }[];

  /** Show or hide QR code button */
  public showQRButton = false;

  constructor(
    private http: HttpClient,
    public router: Router,
    public location: Location,
    public titleService: Title
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
  EncodeObject(o: any): string {
    return encodeURIComponent(btoa(JSON.stringify(o)));
  }

  /**
   * Decode an object encoded with "EncodeObject"
   * @param s Encoded string
   */
  DecodeObject<T>(s: string): T {
    return JSON.parse(atob(decodeURIComponent(s))) as T;
  }

  /**
   * Fire a URI template or URL with GET verb
   * @param uriTemplate URI Template or URL
   * @param options Options to fill in URI Template
   */
  FireGET<T>(uriTemplate: string, options: any = {}): Observable<T> {
    // const sid = localStorage.getItem(this.SESSION_ID);
    // if (sid !== null && sid !== undefined) {
    //   options["headers"] = {
    //     ...options["headers"],
    //     Cookie: "sessionid=" + sid,
    //   };
    // }

    return this.http.get<T>(
      this.FillURITemplate(HOST + uriTemplate, {
        ...options,
        withCredentials: true,
      })
    );
  }

  /**
   * Fire a URI template or URL with PUT verb
   * @param uriTemplate URI Template or URL
   * @param body Body to PUT
   * @param options Options to fill in URI Template
   */
  FirePUT<T>(
    uriTemplate: string,
    body: any = null,
    options: any = {}
  ): Observable<T> {
    // const sid = localStorage.getItem(this.SESSION_ID);
    // if (sid !== null && sid !== undefined) {
    //   options["headers"] = {
    //     ...options["headers"],
    //     Cookie: "sessionid=" + sid,
    //   };
    // }
    return this.http.put<T>(
      this.FillURITemplate(HOST + uriTemplate, {
        ...options,
        withCredentials: true,
      }),
      body
    );
  }

  /**
   * Fire a URI template or URL with POST verb
   * @param uriTemplate URI Template or URL
   * @param body Body to POST
   * @param options Options to fill in URI Template
   */
  FirePOST<T>(
    uriTemplate: string,
    body: any = null,
    options: any = {}
  ): Observable<T> {
    // const sid = localStorage.getItem(this.SESSION_ID);
    // if (sid !== null && sid !== undefined) {
    //   if (options["headers"] != null) {
    //     const headers = options["headers"] as HttpHeaders;
    //     headers.append(
    //       "Cookie",
    //       "sessionid=" + localStorage.getItem(this.SESSION_ID)
    //     );
    //     options["headers"] = headers;
    //   } else {
    //     options["headers"] = new HttpHeaders().append(
    //       "Cookie",
    //       "sessionid=" + localStorage.getItem(this.SESSION_ID)
    //     );
    //   }
    // }
    return this.http.post<T>(
      this.FillURITemplate(HOST + uriTemplate, {
        ...options,
        withCredentials: true,
      }),
      body
    );
  }

  /**
   * Fire a URI template or URL with PATCH verb
   * @param uriTemplate URI Template or URL
   * @param body Body to PATCH
   * @param options Options to fill in URI Template
   */
  FirePATCH<T>(
    uriTemplate: string,
    body: any = null,
    options: any = {}
  ): Observable<T> {
    // const sid = localStorage.getItem(this.SESSION_ID);
    // if (sid !== null && sid !== undefined) {
    //   if (options["headers"] != null) {
    //     const headers = options["headers"] as HttpHeaders;
    //     headers.append(
    //       "Cookie",
    //       "sessionid=" + localStorage.getItem(this.SESSION_ID)
    //     );
    //     options["headers"] = headers;
    //   } else {
    //     options["headers"] = new HttpHeaders().append(
    //       "Cookie",
    //       "sessionid=" + localStorage.getItem(this.SESSION_ID)
    //     );
    //   }
    // }
    return this.http.patch<T>(
      this.FillURITemplate(HOST + uriTemplate, {
        ...options,
        withCredentials: true,
      }),
      body
    );
  }

  /**
   * Fire a URI template or URL with DELETE verb
   * @param uriTemplate URI Template or URL
   * @param options Options to fill in URI Template
   */
  FireDELETE<T>(uriTemplate: string, options: any = {}): Observable<T> {
    return this.http.delete<T>(
      this.FillURITemplate(HOST + uriTemplate, options)
    );
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
    /* Construct upload request */
    const formData = new FormData();
    formData.append('picture', image);
    const uploadReq = new HttpRequest('POST', HOST + API.PostImage, formData);

    /* Make upload request and return */
    return new Observable((observer) => {
      this.http.request(uploadReq).subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            observer.next(event.body['picture']);
            observer.complete();
          }
        },
        (error) => observer.error(error)
      );
    });
  }

  /**
   * Get all events currently stored
   */
  GetAllEvents(): Observable<IEnumContainer> {
    return this.FireGET<IEnumContainer>(API.Events);
  }

  GetAllEventsVerified(): Observable<IEnumContainer> {
    return this.FireGET<IEnumContainer>(API.EventAll);
  }

  GetEventsToVerify(): Observable<IEnumContainer> {
    return this.FireGET<IEnumContainer>(API.EventToVerify);
  }
  
  GetMyEvents(): Observable<IEnumContainer> {
    return this.FireGET<IEnumContainer>(API.EventMy);
  }

  /** Get detailed information on an event */
  GetEvent(uuid: string): Observable<IEvent> {
    return this.FireGET<IEvent>(API.Event, { uuid: uuid });
  }

  GetCommunity(uuid: string): Observable<ICommunity> {
    return this.FireGET<ICommunity>(API.Community, { uuid: uuid });
  }

  /** Fills the event with uuid into the cache and returns it */
  FillGetEvent(uuid: string): Observable<IEvent> {
    const index = this.eventsDetailed.findIndex((m) => m.id === uuid);
    return new Observable((observer) => {
      if (index === -1) {
        this.GetEvent(uuid).subscribe(
          (result) => {
            this.eventsDetailed.push(result);
            observer.next(result);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.next(this.eventsDetailed[index]);
        observer.complete();
      }
    });
  }

  /** Gets community with id=uuid
   * Checks cache first and caches the community if not cached
   */
  FillGetCommunity(uuid: string): Observable<ICommunity> {
    const index = this.groupDetailed.findIndex((m) => m.id === uuid);
    return new Observable((observer) => {
      if (index === -1) {
        this.GetCommunity(uuid).subscribe(
          (result) => {
            this.groupDetailed.push(result);
            observer.next(result);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.next(this.groupDetailed[index]);
        observer.complete();
      }
    });
  }

  fillGetPost(uuid: string): Observable<ICommunityPost> {
    const index = this.postDetailed.findIndex((m) => m.id === uuid);
    return new Observable((observer) => {
      if (index === -1) {
        this.FireGET<ICommunityPost>(API.CommunityPost, {
          uuid: uuid,
        }).subscribe((result) => {
          this.postDetailed.push(result);
          observer.next(result);
          observer.complete();
        });
      } else {
        observer.next(this.postDetailed[index]);
        observer.complete();
      }
    });
  }

  PostEvent(body: any): Observable<IEvent> {
    return this.FirePOST<IEvent>(API.Events, body);
  }

  PutEvent(id: string, body: any): Observable<IEvent> {
    return this.FirePUT<IEvent>(API.Event, body, { uuid: id });
  }

  /** Get all locations */
  GetAllLocations(excludeGroup: number = null): Observable<ILocation[]> {
    return this.FireGET<ILocation[]>(API.Locations, {
      exclude_group: excludeGroup,
    });
  }

  /**fetch all adj list posting origin and destination */

  postOriginAndDestination() {
    this.FirePOST<IPath>(API.ShortestPath, this.originAndDestinationData).subscribe((res) => {
      return res;
    }
    );
  }
  /** Gets the current user if logged in
  * The result is cached
  */
  GetFillCurrentUser(): Observable<IUserProfile> {
    return new Observable((observer) => {
      if (!this._currentUser) {
        /* Try to get from localStorage */
        if (!this.isSandbox && localStorage.getItem(this.LS_USER) !== null) {
          const user = JSON.parse(localStorage.getItem(this.LS_USER));
          this.loginUser(observer, user, false);
          this.updateUser();
          return;
        }

        /* Fire a get */
        this.FireGET<any>(API.LoggedInUser).subscribe(
          (result) => {
            this.loginUser(observer, result.profile, !this.isSandbox);
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.next(this._currentUser);
        observer.complete();
      }
    });
  }

  /** Set the local storage profile to argument */
  setLocalStorageUser(profile: IUserProfile) {
    localStorage.setItem(this.LS_USER, JSON.stringify(profile));
  }

  /** Helper to log in the user with the given user object */
  loginUser(observer: any, profile: IUserProfile, setLocal: Boolean) {
    this._loggedIn = true;
    this._currentUser = profile;

    /* Set local storage */
    if (setLocal) {
      this.setLocalStorageUser(profile);
    }

    observer.next(this._currentUser);
    this._loggedInSubject.next(true);
    observer.complete();
  }

  /** Updates the current user profile */
  updateUser(profile: IUserProfile = null) {
    if (!this._loggedIn) {
      return;
    }

    /* Helper function to update user */
    const update = (u: IUserProfile) => {
      this._currentUser = u;
      this.setLocalStorageUser(this._currentUser);
      this._loggedInSubject.next(true);
    };

    /* Check if profile was passed as an argument */
    if (profile !== null) {
      update(profile);
      return;
    }

    /* Update the profile */
    this.FireGET<any>(API.LoggedInUser).subscribe(
      (result) => {
        update(result.profile);

        /* Update calendar on WinRT */
        WinRT.updateAppointments(result.profile.events_going);
      },
      (error) => {
        if (error.status === 401) {
          alert('Your session has expired');
          this.PostLogout();
        }
        this._loggedInSubject.next(false);
      }
    );
  }

  /** Gets SSO URL */
  GetLoginURL() {
    const RESPONSE_TYPE = 'code';
    const SCOPE =
      'basic profile picture sex ldap phone insti_address program secondary_emails';

    return `${SSOHOST}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${SSO_REDIR}`;
  }

  /** Tries to authenticate with the given code */
  AuthenticateSSO(code: string) {
    return this.FireGET(API.Login, { code: code, redir: SSO_REDIR });
  }

  /** Send LDAP to to backend */
  SendLDAP(ldap: string) {
    return this.FireGET(API.Alumni, { ldap: ldap });
  }

  /** Send OTP to backend and verify */
  SendOTP(ldap: string, otp: string) {
    return this.FireGET(API.AlumniOTP, { ldap: ldap, otp: otp });
  }

  /** Resend OTP if requested by user */
  ResendOTP(ldap: string) {
    return this.FireGET(API.ResendAlumniOTP, { ldap: ldap });
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
    if (!this._loggedIn) {
      return [];
    }

    const bodies: IBody[] = [] as IBody[];
    for (const role of this._currentUser.roles) {
      if (role.permissions.includes(permission)) {
        for (const body of role.bodies) {
          if (!bodies.map((m) => m.id).includes(body.id)) {
            bodies.push(body);
          }
        }
      }
    }
    return bodies;
  }

  GetVerificationBodies(): Observable<IBody[]> {
    return this.FireGET<IBody[]>(`${API.EventVerificationBodies}`);
  }


  /** Returns true if the user has the permission for institute */
  HasInstitutePermission(permission: string): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }
    return this.GetInstitutePermissions().indexOf(permission) !== -1;
  }

  /** Get a list of institute permissions the user has */
  GetInstitutePermissions(): string[] {
    if (!this.isLoggedIn()) {
      return [];
    }
    return [].concat.apply(
      [],
      this.getCurrentUser().institute_roles.map((m) => m.permissions)
    );
  }

  /** Returns true if the user has the permission for the body */
  HasBodyPermission(bodyid: string, permission: string) {
    return (
      this.GetBodiesWithPermission(permission)
        .map((m) => m.id)
        .indexOf(bodyid) !== -1
    );
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

  /** Return true if the current user can view the max content of the event and push email */
  canViewMaxContent(event: IEvent): boolean {
    if (
      !this._loggedIn ||
      !event ||
      !event.verification_bodies_id ||
      !event.verification_bodies_id.length
    ) return false;

    const verificationBodyId = event.verification_bodies_id[0];

    for (const role of this._currentUser.roles) {
      if (
        role.permissions.includes("VerE") &&
        role.bodies.some(body => body.id === verificationBodyId)
      ) {
        return true;
      }
    }
    return false;
  }

  /** Mark a UNR for the current user */
  MarkUNR(news: INewsEntry, reaction: number) {
    return this.FireGET(API.NewsFeedReaction, {
      uuid: news.id,
      reaction: reaction,
    });
  }

  /** Gets concatenated going and interested events for current User */
  getFollowedEvents(): IEvent[] {
    if (!this._loggedIn) {
      return [] as IEvent[];
    }
    return this._currentUser.events_going.concat(
      this._currentUser.events_interested
    );
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
  GetEventSubtitle = (event: IEvent): string => Helpers.GetEventSubtitle(event);

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

  /** Returns true if the current user has at least one role */
  hasRole() {
    return this.isLoggedIn() && this.getCurrentUser().roles.length > 0;
  }

  /** Set the HTML title */
  setTitle(title: string) {
    this.titleService.setTitle(`${title} | InstiApp | IIT Bombay`);
    this._titleSubject.next(title);
  }

  /** Get unread notifications */
  getUnreadNotifications() {
    return this.notifications.filter((n) => n.unread && n.actor);
  }

  /** Set scrollingDown */
  setScrollingDown(value: boolean): void {
    if (this._scrollingDown !== value) {
      this._scrollingDown = value;
    }
  }

  /** Get scrollingDown */
  isScrollingDown(): boolean {
    return this._scrollingDown;
  }

  /** Get a resized URL for a static image */
  getResized(url: string, dim: number): string {
    return this.getCropped(url, dim, dim);
  }

  /** Get a cropped URL for a static image */
  getCropped(url: string, _: number, __: number): string {
    if (url === null) {
      return null;
    }
    return url;
    // TODO: fix this
    // .replace(
    //   'api.insti.app/static/',
    //   `img.insti.app/static/crop/${w}/${h}/`
    // );
  }

  /** Get the URL of a body from str_id */
  getBodyUrl(body: IBody): string {
    return window.location.origin + '/org/' + body.str_id;
  }

  /** Get (and cache) list of types of achievement offers */
  getAchievementOfferTypes(): Observable<any[]> {
    return new Observable((observer) => {
      if (this.achievementOfferTypes) {
        observer.next(this.achievementOfferTypes);
        observer.complete();
      } else {
        this.FireGET('/assets/achievements/list.json').subscribe(
          (res: any) => {
            this.achievementOfferTypes = res.types;
            observer.next(this.achievementOfferTypes);
            observer.complete();
          },
          (error) => observer.error(error)
        );
      }
    });
  }

  canEditInterest(roll: String): boolean {
    if (!this._loggedIn) {
      return false;
    }
    if (roll === this._currentUser.ldap_id) {
      return true;
    }
    return false;
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  /** Fills user and naviagtes user */
  performLogin() {
    this.GetFillCurrentUser().subscribe(() => {
      const redir = localStorage.getItem(this.LOGIN_REDIR);
      if (redir && redir !== '') {
        localStorage.setItem(this.LOGIN_REDIR, '');
        const rpath: any[] = this.DecodeObject(redir);
        this.router.navigate(rpath);
      } else {
        this.router.navigate(['feed']);
      }
    });
  }

  /**
   * Approve email for a specific event
   * @param eventId ID of the event
   */
  approveEmail(eventId: string): Observable<any> {
    const url = `${API.Events}/${eventId}/approve-mail`;
    console.log('Constructed URL:', url);
    return this.FirePOST(url, {});
  }

  /**
   * Reject email for a specific event
   * @param eventId ID of the event
   */
  rejectEmail(eventId: string): Observable<any> {
    const url = `${API.Events}/${eventId}/reject-mail`;

    return this.FirePOST(url, {});
  }

}
