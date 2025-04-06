import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { IEvent } from '../../interfaces';
import { DataService } from '../../data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Helpers } from '../../helpers';
import { API } from '../../../api';
import { WinRT } from '../../windows';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnChanges, OnInit {

  @Input() public eventId: string;
  @Input() public noCenter = false;
  @Output() public load = new EventEmitter<boolean>();

  public event: IEvent;
  public error: number;
  @Input() public desktopMode = false;
  public showVerifyEmailPopup = false;
  public emailRejected = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public router: Router,
  ) { }

  /** Refresh the component whenever passed eventId changes */
  ngOnChanges() {
    this.refresh();
  }

  /** Check if called with a url and update */
  ngOnInit() {

    if (!this.eventId) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.eventId = params['id'];
        this.refresh();
      });
    } else {
      this.desktopMode = true;
    }
  }

  /** Call the events API and show data */
  refresh() {
    this.event = null;
    this.dataService.FillGetEvent(this.eventId).subscribe(result => {
      /* Check if no image */
      if (result.image_url === null || result.image_url === '') {
        result.image_url = result.bodies[0]?.image_url || null;
      }

      /** Preload image and mark done */
      Helpers.preloadImage(result.image_url, () => {
        this.event = result;
        this.load.emit(true);
      });

      /* Do not change title in split mode */
      if (!this.desktopMode) {
        this.dataService.setTitle(result.name);
      }
    }, (e) => {
      this.load.emit(false);
      this.error = e.status;
    });
  }

  /** Helper for marking UserEventStatus */
  markUES(status: number) {
    if (this.event.user_ues === status) {
      status = 0;
    }
    return this.dataService.FireGET(API.UserMeEventStatus, { event: this.event.id, status: status }).subscribe(() => {
      /* Change counts */
      if (status === 0) {
        if (this.event.user_ues === 1) { this.event.interested_count--; }
        if (this.event.user_ues === 2) { this.event.going_count--; }
        WinRT.updateAppointments([this.event], true);
      } else if (status === 1) {
        if (this.event.user_ues !== 1) { this.event.interested_count++; }
        if (this.event.user_ues === 2) { this.event.going_count--; }
        WinRT.updateAppointments([this.event], true);
      } else if (status === 2) {
        if (this.event.user_ues !== 2) { this.event.going_count++; }
        if (this.event.user_ues === 1) { this.event.interested_count--; }
        WinRT.updateAppointments([this.event]);
      }

      /* Update UES */
      this.event.user_ues = status;
    });
  }

  /** Navigate back to feed (should be changed to last page) */
  closeEventDetails() {
    this.dataService.navigateBack();
  }

  /** Trigger the native share or show share prompt */
  share() {
    Helpers.NativeShare(this.event.name, `Check out ${this.event.name} at InstiApp!`, this.shareUrl());
  }

  /** Get the sharing url */
  shareUrl(): string {
    return `${environment.host}event/${this.event.str_id}`;
  }

  openEventEdit() {
    this.router.navigate(['edit-event', this.event.id]);
  }

  openVerifyEmailPopup() {
    this.showVerifyEmailPopup = true;
  }

  approveEmail(): void {
    console.log('event', this.eventId); // Log the eventId
    this.dataService.approveEmail(this.eventId).subscribe(
      () => {
        console.log('Email approved successfully!');
        this.event.email_verified = true;
      },
      (error) => {
        console.error('Error approving email:', error);
      }
    );
    this.showVerifyEmailPopup = false;
  }

  rejectEmail(): void {
    this.dataService.rejectEmail(this.eventId).subscribe(
      () => {
        console.log('Email rejected successfully!');
        this.event.email_rejected = true;
      },
      (error) => {
        console.error('Error rejecting email:', error);
      }
    );
    this.showVerifyEmailPopup = false;
  }

}
