import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../data.service';
import { IAchievement, IBody, IEvent, IOfferedAchievement } from '../../../interfaces';
import { API } from '../../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as QRCode from 'qrcode-generator';

@Component({
  selector: 'app-achievement-new',
  templateUrl: './achievement-new.component.html',
  styleUrls: ['./achievement-new.component.css']
})
export class AchievementNewComponent implements OnInit, OnDestroy {

  /** Main object to edit */
  achievement = {} as IAchievement;

  /** Secret */
  secret: string;

  /** ID of offer if present */
  offerId: string;

  /** Show the QR code = 1 static = 2 */
  showQR = 0;

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
      if (this.offerId && this.offerId !== '') {
        this.dataService.FireGET<IOfferedAchievement>(API.AchievementOffer, { id: this.offerId }).subscribe(r => {
          this.achievement.body = r.body;
          this.achievement.event = r.event;
          this.achievement.title = r.title;
          this.achievement.description = r.description;

          /* Check if we have the secret */
          if (r.secret && r.secret !== '') {
            this.secret = r.secret;
            this.secretQR = this.makeQR(r.secret);

            /* Load OTP library */
            const resource = document.createElement('script');
            resource.async = false;
            const script = document.getElementsByTagName('script')[0];
            resource.src = 'https://unpkg.com/otplib@^10.0.0/otplib-browser.js';
            script.parentNode.insertBefore(resource, script);

            resource.addEventListener('load', () => {
              this.otplib = window['otplib'];
              this.totpInterval = setInterval(() => {
                if (this.showQR === 1) {
                  const newTotp = this.otplib.authenticator.generate(r.secret);
                  if (newTotp !== this.totp) {
                    this.totp = newTotp;
                    this.totpQR = this.makeQR(newTotp);
                  }
                  this.totpTime = this.otplib.authenticator.timeUsed() * (10 / 3);
                }
              }, 500);

              /* this.dataService.FirePOST(API.AchievementOffer, {
                secret:  }, {id: this.offerId}).subscribe((res: any) => {
                  this.snackBar.open(res.message, 'Dismiss', { duration: 2000 });
                }); */
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.totpInterval) {
      clearInterval(this.totpInterval);
    }
  }

  /** Make QR code from data */
  makeQR(data: string): any {
    const typeNumber = 4;
    const errorCorrectionLevel = 'L';
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    qr.addData(data);
    qr.make();
    return qr.createDataURL(20);
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
