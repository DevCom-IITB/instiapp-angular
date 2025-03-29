import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAchievement } from '../../../interfaces';
import { DataService } from '../../../data.service';
import { API } from '../../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-achievement-request',
  templateUrl: './achievement-request.component.html',
  styleUrls: ['./achievement-request.component.css']
})
export class AchievementRequestComponent implements OnInit {

  /** Set to true to view user information */
  @Input() public user = false;

  /** Main achievement object */
  @Input() public achievement: IAchievement;

  /** Triggered on deletion */
  @Output() del: EventEmitter<any> = new EventEmitter();

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
  ) { }

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

  /** Get card subtitle */
  public getSubtitle() {
    if (this.user && this.achievement.user) {
      return this.achievement.user.name;
    }
    return this.achievement.body_detail.name;
  }

  /** Get card avatar */
  public getImage() {
    if (this.user && this.achievement.user) {
      return this.achievement.user.profile_pic;
    }
    return this.achievement.body_detail.image_url;
  }

  /** Check if user can verify this achievement */
  public canVerify(): boolean {
    return this.dataService.HasBodyPermission(this.achievement.body, 'VerA');
  }

  /** Verify, dismiss or un-verify an achievement */
  public dismiss(verify: boolean): void {
    const request  = {...this.achievement};
    request.body = this.achievement.body_detail.id;
    request.verified = verify && !request.verified;
    request.dismissed = true;
    this.dataService.FirePUT<IAchievement>(API.Achievement, request, { id: request.id }).subscribe(res => {
      for (const k in res) {
        if (res.hasOwnProperty(k)) {
          this.achievement[k] = res[k];
        }
      }
    }, error => {
      this.snackBar.open(`Upload Failed - ${error.message}`, 'Dismiss', {
        duration: 2000,
      });
    });
  }

  /** Toggle hidden with PATCH */
  public toggleHidden(e: MatSlideToggleChange) {
    e.source.setDisabledState(true);
    this.dataService.FirePATCH(API.Achievement, {
      hidden: e.checked
    }, { id: this.achievement.id }).subscribe(() => {
      e.source.setDisabledState(false);
    }, () => {
      this.snackBar.open('Updating preference failed!', 'Dismiss', {
        duration: 2000,
      });
      e.source.checked = this.achievement.hidden;
      e.source.setDisabledState(false);
    });
  }
}
