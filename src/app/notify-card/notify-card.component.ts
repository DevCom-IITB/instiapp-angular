import { Component, OnInit, Input } from '@angular/core';
import { INotification } from '../interfaces';
import { DataService } from '../data.service';
import { API } from '../../api';
import { Router } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material';

const ACTOR_TYPE_EVENT = 'event';

@Component({
  selector: 'app-notify-card',
  templateUrl: './notify-card.component.html',
  styleUrls: ['./notify-card.component.css']
})
export class NotifyCardComponent {

  @Input() public notifications: INotification[];

  constructor(
    public dataService: DataService,
    public router: Router,
    private bottomSheetRef: MatBottomSheetRef<NotifyCardComponent>
  ) {
    if (dataService.notifications) {
      this.notifications = dataService.notifications;
    }
  }

  /** Get unread notifications */
  getUnread() {
    return this.notifications.filter(n => n.unread);
  }

  /** Follow and mark a notification read */
  followNotification(notification: INotification) {
    /* Mark as read */
    this.dataService.FireGET(API.NotificationRead, { id: notification.id }).subscribe();
    notification.unread = false;

    /* Open page */
    if (notification.actor_type === ACTOR_TYPE_EVENT) {
      this.router.navigate(['event', notification.actor.str_id]);
    }

    /* Close notifications */
    this.bottomSheetRef.dismiss();
  }

}
