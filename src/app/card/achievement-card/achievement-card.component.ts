import { Component, OnInit, Input } from '@angular/core';
import { IAchievement } from '../../interfaces';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.css']
})
export class AchievementCardComponent implements OnInit {

  @Input() public achievement: IAchievement;
  @Input() public route: string[];

  public subtitle: string;
  public avatar: string;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    if (!this.achievement) {
      return;
    }

    /* Setup variables */
    if (this.achievement.event_detail) {
      this.subtitle = this.achievement.event_detail.name;
      this.avatar = this.achievement.event_detail.image_url;
      if (!this.route) {
        this.route = ['/event', this.achievement.event_detail.str_id];
      }
    } else {
      this.subtitle = this.achievement.body_detail.name;
    }

    /* Try to set to body image */
    if (!this.avatar || this.avatar === '') {
      this.avatar  = this.achievement.body_detail.image_url;
    }

    /* Set fallback image explicitly */
    if (!this.avatar || this.avatar === '') {
      this.avatar  = 'assets/lotus_placeholder.png';
    }

    /* Resize imze */
    this.avatar = this.dataService.getResized(this.avatar, 150);

    /* Set router link */
    if (!this.route) {
      this.route = ['/org', this.achievement.body_detail.str_id];
    }
  }

}
