import { Component, OnInit, OnDestroy } from '@angular/core';
import { IBodyRole, IBody, IEvent, IEventContainer } from '../interfaces';
import { DataService } from '../data.service';
import { API } from '../../api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit, OnDestroy {
  public error: number;
  public containers: IEventContainer[];
  public hasRole = false;
  public subscription: Subscription;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.FireGET(API.UserMeRoles).subscribe(result => {
      const roles = result as IBodyRole[];
      this.hasRole = roles.length > 0;
      this.containers = this.MakeContainers(roles, this.dataService.getFollowedEvents());

      /* Update followed events */
      this.subscription = this.dataService.loggedInObservable.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.containers = this.MakeContainers(roles, this.dataService.getFollowedEvents());
        }
      });
      this.dataService.updateUser();
    }, (e) => {
      this.error = e.status;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /** Make containers from followed and roles */
  MakeContainers(roles: IBodyRole[], followedEvents: IEvent[]): IEventContainer[] {
    const result: IEventContainer[] = [];

    /** Followed in first box */
    result.push({
      title: 'Upcoming',
      events: followedEvents.splice(0, 8).sort((a, b) => b.weight - a.weight)
    });

    /* For each role */
    for (const role of roles) {
      result.push({
        events: role.events,
        title: role.body_detail.name
      });
    }
    return result;
  }

}
