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
  @Input() public subtitle: string;
  @Input() public route: string[];

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    if (!this.achievement) {
      return;
    }

    /* Set fallback image explicitly */
    if (this.achievement.body_detail && (!this.achievement.body_detail.image_url)) {
      this.achievement.body_detail.image_url = 'assets/lotus_placeholder.png';
    }

    /** Set router link */
    if (!this.route) {
      this.route = ['/org', this.achievement.body_detail.str_id];
    }
  }

}
