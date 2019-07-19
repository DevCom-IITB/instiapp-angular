import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { IAchievement, IBody } from '../../../interfaces';
import { API } from '../../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-achievement-new',
  templateUrl: './achievement-new.component.html',
  styleUrls: ['./achievement-new.component.css']
})
export class AchievementNewComponent implements OnInit {

  /** Main object to edit */
  achievement = {} as IAchievement;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    /* Set title on mobile */
    if (this.dataService.isMobile()) {
      this.dataService.setTitle('Achievement Request');
    }
  }

  /** Set body from an autocomplete event */
  setBody(event: any): void {
    if(event.option) {
      const body: IBody = event.option.value;
      this.achievement.body_detail = body;
      this.achievement.body = body.id;
    }
  }

  /** Fire the request */
  go(): void {
    this.dataService.FirePOST<IAchievement>(API.Achievements, this.achievement).subscribe(() => {
      this.snackBar.open('Your request has been recorded', 'Dismiss', { duration: 2000 })
      this.achievement = {} as IAchievement;
    }, err => {
      this.snackBar.open(`There was an error: ${err.message}`, 'Dismiss')
    });
  }
}
