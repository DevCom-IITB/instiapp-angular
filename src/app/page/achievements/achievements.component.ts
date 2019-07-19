import { Component, OnInit } from '@angular/core';
import { IAchievement } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { API } from '../../../api';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  /** Main achievements array */
  public achievements: IAchievement[];

  /** Error to show if requests fail */
  public error: number;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set title */
    this.dataService.setTitle('Achievements');

    /* Get achievements for user */
    this.dataService.FireGET<IAchievement[]>(API.Achievements).subscribe(result => {
      this.achievements = result;
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Delete an achievement */
  public delete(achievement: IAchievement) {
    const index = this.achievements.indexOf(achievement);
    this.dataService.FireDELETE(API.Achievement, { id: achievement.id}).subscribe(() => {
      this.achievements.splice(index, 1);
    });
  }
}
