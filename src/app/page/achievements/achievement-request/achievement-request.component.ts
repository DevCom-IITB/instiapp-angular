import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAchievement } from '../../../interfaces';

@Component({
  selector: 'app-achievement-request',
  templateUrl: './achievement-request.component.html',
  styleUrls: ['./achievement-request.component.css']
})
export class AchievementRequestComponent implements OnInit {

  /** Main achievement object */
  @Input() public achievement: IAchievement;

  /** Triggered on deletion */
  @Output() del: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /** Get the status and color of the achievement request */
  public getStatus(): any {
    if (this.achievement.verified) {
      return ['Verified', 'green'];
    }
    if (this.achievement.dismissed) {
      return ['Dismissed', 'red'];
    }
    return ['Pending Verification', 'gray'];
  }

  /** Delete this achievement request */
  public delete() {
    if (confirm(`Are you sure you want to delete achievement ${this.achievement.description} forever?`)) {
      this.del.emit();
    }
  }

}
