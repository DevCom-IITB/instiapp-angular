import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { IAchievement, IBody, IEvent, IOfferedAchievement } from '../../../interfaces';
import { API } from '../../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-achievement-new',
  templateUrl: './achievement-new.component.html',
  styleUrls: ['./achievement-new.component.css']
})
export class AchievementNewComponent implements OnInit {

  /** Main object to edit */
  achievement = {} as IAchievement;

  /** ID of offer if present */
  offerId: string;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    /* Set title on mobile */
    if (this.dataService.isMobile()) {
      this.dataService.setTitle('Achievement Request');
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      this.offerId = params['offer'];
      if (this.offerId && this.offerId !== '') {
        this.dataService.FireGET<IOfferedAchievement>(API.AchievementOffer, { id: this.offerId }).subscribe(r => {
          this.achievement.body = r.body;
          this.achievement.event = r.event;
          this.achievement.title = r.title;
          this.achievement.description = r.description;
        });
      }
    });
  }

  /** Set body from an autocomplete event */
  setBody(event: any): void {
    if (event.option) {
      const body: IBody = event.option.value;
      this.achievement.body_detail = body;
      this.achievement.body = body.id;
    }
  }

  /** Set event from an autocomplete event */
  setEvent(event: any): void {
    if (event.option) {
      const ievent: IEvent = event.option.value;
      this.achievement.event_detail = ievent;
      this.achievement.event = ievent.id;
      this.achievement.body = ievent.bodies[0].id;
      this.achievement.body_detail = ievent.bodies[0];
    }
  }

  /** Fire the request */
  go(): void {
    this.dataService.FirePOST<IAchievement>(API.Achievements, this.achievement).subscribe(() => {
      this.snackBar.open('Your request has been recorded', 'Dismiss', { duration: 2000 });
      this.achievement = {} as IAchievement;
      this.router.navigate(['/achievements']);
    }, err => {
      this.snackBar.open(`There was an error: ${err.message}`, 'Dismiss');
    });
  }
}
