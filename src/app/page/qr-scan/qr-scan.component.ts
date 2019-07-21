import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.css']
})
export class QrScanComponent implements OnInit, OnDestroy {

  qrScanner: any;
  @ViewChild('qrVideo', { static: true }) qrel: ElementRef;

  constructor(
    public router: Router,
  ) {
    QrScanner.WORKER_PATH = 'assets/qr-scanner-worker.min.js';
  }

  ngOnInit() {
    this.qrScanner = new QrScanner(this.qrel.nativeElement, result => {
      window['jumpToUrl'](result);
      console.log('detected:', result);
    }, 960);
    this.qrScanner.start();
  }

  ngOnDestroy() {
    this.qrScanner.destroy();
    this.qrScanner = null;
  }
}
