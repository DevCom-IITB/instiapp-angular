import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { IBody, ICommunity, ICommunityPost } from '../../interfaces';
import { DataService } from '../../data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { API } from '../../../api';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnChanges, OnInit {

  @Input() public groupId: string;
  @Input() public noCenter = false;
  @Output() public load = new EventEmitter<boolean>();

  public group: ICommunity;
  public group_body: IBody;

  public featured_posts: ICommunityPost[];

  public error: number;
  @Input() public desktopMode = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public router: Router,
  ) { }

  /** Refresh the component whenever passed groupId changes */
  ngOnChanges() {
    this.refresh();
  }



  /** Check if called with a url and update */
  ngOnInit() {

    if (!this.groupId) {
      this.activatedRoute.params.subscribe((params: Params) => {
        // this.refresh();
        this.groupId = params['id'];
      });
    } else {
      this.desktopMode = true;
    }
    
    this.refresh();
  }

  refresh() {

    this.group = null;
    this.dataService.FillGetCommunity(this.groupId).subscribe(result => {
      /* Check if no image */
      // if (result.image_url === null || result.image_url === '') {
      //   result.image_url = result.bodies[0].image_url;
      // }

      /** Preload image and mark done */
      // Helpers.preloadImage(result.image_url, () => {

      //   this.load.emit(true);
      // });

      this.group = result;

      /* Do not change title in split mode */
      if (!this.desktopMode) {
        this.dataService.setTitle(result.name);
      }
    }, (e) => {
      this.load.emit(false);
      this.error = e.status;
    });

    this.dataService.FireGET<IBody>(API.Body, {uuid: this.group.body}).subscribe(result => {
      this.group_body = result;
    }, (e) => {
      this.error = e.status;
    });
  }

  onJoinClicked(): void{
    this.followBody(this.group_body);
  }
  followBody(body: IBody) {
    if (!this.dataService.isLoggedIn()) { alert('Login first!'); return; }
    /* Fire new API! */
    this.dataService.FireGET(API.BodyFollow, {
      uuid: body.id, action: body.user_follows ? 0 : 1
    }).subscribe(() => {
      this.group.is_user_following = !this.group.is_user_following;
      this.group.followers_count += this.group.is_user_following ? 1 : -1;
    });
  }
  // /** Call the events API and show data */
  // refresh() {
  //   this.group = null;
  //   this.dataService.FillGetEvent(this.eventId).subscribe(result => {
  //     /* Check if no image */
  //     if (result.image_url === null || result.image_url === '') {
  //       result.image_url = result.bodies[0].image_url;
  //     }

  //     /** Preload image and mark done */
  //     Helpers.preloadImage(result.image_url, () => {
  //       this.group = result;
  //       this.load.emit(true);
  //     });

  //     /* Do not change title in split mode */
  //     if (!this.desktopMode) {
  //       this.dataService.setTitle(result.name);
  //     }
  //   }, (e) => {
  //     this.load.emit(false);
  //     this.error = e.status;
  //   });
  // }

  // /** Helper for marking UserEventStatus */
  // markUES(status: number) {
  //   if (this.event.user_ues === status) {
  //     status = 0;
  //   }
  //   return this.dataService.FireGET(API.UserMeEventStatus, { event: this.event.id, status: status }).subscribe(() => {
  //     /* Change counts */
  //     if (status === 0) {
  //       if (this.event.user_ues === 1) { this.event.interested_count--; }
  //       if (this.event.user_ues === 2) { this.event.going_count--; }
  //       WinRT.updateAppointments([this.event], true);
  //     } else if (status === 1) {
  //       if (this.event.user_ues !== 1) { this.event.interested_count++; }
  //       if (this.event.user_ues === 2) { this.event.going_count--; }
  //       WinRT.updateAppointments([this.event], true);
  //     } else if (status === 2) {
  //       if (this.event.user_ues !== 2) { this.event.going_count++; }
  //       if (this.event.user_ues === 1) { this.event.interested_count--; }
  //       WinRT.updateAppointments([this.event]);
  //     }

  //     /* Update UES */
  //     this.event.user_ues = status;
  //   });
  // }

  // /** Navigate back to feed (should be changed to last page) */
  // closeEventDetails() {
  //   this.dataService.navigateBack();
  // }

  // /** Trigger the native share or show share prompt */
  // share() {
  //   Helpers.NativeShare(this.event.name, `Check out ${this.event.name} at InstiApp!`, this.shareUrl());
  // }

  // /** Get the sharing url */
  // shareUrl(): string {
  //   return `${environment.host}event/${this.event.str_id}`;
  // }

  // openEventEdit() {
  //   this.router.navigate(['edit-event', this.event.id]);
  // }

}
