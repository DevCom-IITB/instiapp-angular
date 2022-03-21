import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAchievement, IBody } from '../../interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit, OnDestroy {
  /** Main achievements array */
  public achievements: IAchievement[];

  /** Error to show if requests fail */
  public error: number;

  /** Body ID for verifying */
  public bodyId: string;

  /** Message to show when empty */
  public emptyMessage: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set title */
    this.dataService.setTitle('Achievements');

    /* Make the QR button visible if we have camera */
    QrScanner.hasCamera().then(has => {
      this.dataService.showQRButton = has;
    });

    /* Check if we are verifying */
    this.activatedRoute.params.subscribe((params: Params) => {
      this.bodyId = params['body'];
      if (!this.bodyId || this.bodyId === '') {
        this.bodyId = null;
        this.refreshUser();
      } else {
        this.refreshBody(this.bodyId);
      }
    });
  }

  ngOnDestroy() {
    this.dataService.showQRButton = false;
  }

  /** Get achievements for user */
  public refreshUser(): void {
    this.dataService.FireGET<IAchievement[]>(API.Achievements).subscribe(result => {
      this.achievements = result;
      if (result.length === 0) {
        this.emptyMessage = 'No achievements yet\nLet\'s change that!';
      }
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Get achievement requests for body */
  public refreshBody(bodyId: string): void {
    this.dataService.FireGET<IAchievement[]>(API.BodyAchievement, { id: bodyId }).subscribe(result => {
      this.achievements = result;
      if (result.length === 0) {
        this.emptyMessage = 'Nothing to verify here!';
      }
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Delete an achievement */
  public delete(achievement: IAchievement): void {
    const index = this.achievements.indexOf(achievement);
    this.dataService.FireDELETE(API.Achievement, { id: achievement.id }).subscribe(() => {
      this.achievements.splice(index, 1);
    });
  }

  /** Gets a list of bodies for which the user can verify */
  public getVerifiableBodies(): IBody[] {
    return this.dataService.GetBodiesWithPermission('VerA');
  }
}
