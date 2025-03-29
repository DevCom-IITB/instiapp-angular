import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../data.service';
import { IAchievement, IBody, IEvent, IOfferedAchievement, IUserProfile } from '../../../interfaces';
import { API } from '../../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Helpers } from '../../../helpers';
import { Parser } from 'json2csv';
import * as moment from 'moment';
import * as QRCode from 'qrcode-generator';

@Component({
    selector: 'app-achievement-new',
    templateUrl: './achievement-new.component.html',
    styleUrls: ['./achievement-new.component.css'],
    standalone: false
})
export class AchievementNewComponent implements OnInit, OnDestroy {

  /** Main object to edit */
  achievement: IAchievement;

  /** Users from offer */
  users: IUserProfile[];

  /** Secret */
  secret: string;

  /** ID of offer if present */
  offerId: string;

  /** Show the QR code = 1 static = 2 result = 3*/
  showQR = 0;
  resultMessage = '';

  /** Otplib */
  otplib: any;

  /** Current TOTP */
  totp = '000000';
  totpInterval: NodeJS.Timeout;
  totpTime = 0;
  totpQR = '';
  secretQR = '';

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

      /* Check if we have offer ID */
      if (!(this.offerId && this.offerId !== '')) {
        this.achievement = {} as IAchievement;
        return;
      }

      /* Check for secret */
      this.activatedRoute.queryParams.subscribe(qparams => {
        const secret = qparams['s'];
        if (!secret || secret === '') {
          this.loadOffer();
        } else {
          this.showQR = -1;
          this.trySecret(secret);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.totpInterval) {
      clearInterval(this.totpInterval);
    }
  }

  /** Load the offer */
  loadOffer(): void {
    this.dataService.FireGET<IOfferedAchievement>(API.AchievementOffer, { id: this.offerId }).subscribe(r => {
      this.achievement = {
        body: r.body,
        event: r.event,
        title: r.title,
        description: r.description,
        offer: r.id
      } as IAchievement;

      /* Get the users */
      this.users = r.users;

      /* Check if we have the secret */
      if (r.secret && r.secret !== '') {
        this.secret = r.secret;
        this.secretQR = this.makeQR(r.secret);
        this.loadSecret();
      }
    });
  }

  /** Load and setup secret stuff ;) */
  loadSecret() {
    /* Load OTP library */
    const resource = document.createElement('script');
    resource.async = false;
    const script = document.getElementsByTagName('script')[0];
    resource.src = '/assets/otplib-browser.min.js';
    script.parentNode.insertBefore(resource, script);

    const regen = () => {
      const newTotp = this.otplib.authenticator.generate(this.secret);
      if (newTotp !== this.totp) {
        this.totp = newTotp;
        this.totpQR = this.makeQR(newTotp);
      }
      this.totpTime = this.otplib.authenticator.timeUsed() * (10 / 3);
    };

    resource.addEventListener('load', () => {
      this.otplib = window['otplib'];
      regen();
      this.totpInterval = setInterval(() => {
        if (this.showQR === 1) {
          regen();
        }
      }, 500);
    });
  }

  /** Make QR code from data */
  makeQR(secret: string): any {
    const typeNumber = 11;
    const errorCorrectionLevel = 'H';
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    qr.addData(`${location.protocol}//${location.host}${location.pathname}?s=${secret}`);
    qr.make();
    return qr.createDataURL(20);
  }

  /** Tries to use the secret to get an achievement */
  trySecret(secret: string) {
    this.dataService.FirePOST(API.AchievementOffer, {
      secret: secret
    }, { id: this.offerId }).subscribe((res: any) => {
      this.showQR = 3;
      this.resultMessage = res.message;
      this.achievement = {} as IAchievement;
    }, err => {
      this.showQR = 4;
      this.resultMessage = err.message;
      this.achievement = {} as IAchievement;
    });
  }

  /** Set body from an autocomplete event */
  setBody(event: any): void {
    if (event.option) {
      const body: IBody = event.option.value;
      this.achievement.body_detail = body;
      this.achievement.body = body.id;
      this.achievement.isSkill = false;
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
    if (!confirm('Proceed with requesting verification?')) {
      return;
    }

    this.dataService.FirePOST<IAchievement>(API.Achievements, this.achievement).subscribe(() => {
      this.snackBar.open('Your request has been recorded', 'Dismiss', { duration: 2000 });
      this.achievement = {} as IAchievement;
      this.router.navigate(['/achievements']);
    }, err => {
      this.snackBar.open(`There was an error: ${err.message}`, 'Dismiss');
    });
  }

  /** Make and download CSV data */
  csv(): void {
    if (this.dataService.isSandbox) {
      alert('Use https://insti.app in browser to download CSV');
      return;
    }
    const parser = new Parser();
    const csv = parser.parse(this.users);
    const timeStr = moment(new Date()).format('YYYYMMDD_hhmm');
    const filename = `${this.achievement.title.replace(' ', '')}_${timeStr}.csv`;
    Helpers.downloadFile(filename, csv, 'text/csv');
  }
}
