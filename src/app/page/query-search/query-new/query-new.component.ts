import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../data.service';
import { IAchievement, IUserProfile } from '../../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-query-new',
  templateUrl: './query-new.component.html',
  styleUrls: ['./query-new.component.css']
})
export class QueryNewComponent implements OnInit, OnDestroy {

  /** Main object to edit */
  achievement: IAchievement;

  /** Users from offer */
  users: IUserProfile[];

  /** Secret */
  secret: string;

  /** ID of offer if present */
  offerId: string;

  search_url: string;
  new_query_url: string;


  /** Show the QR code = 1 static = 2 result = 3*/
  showQR = 0;
  resultMessage = '';

  /** Otplib */
  otplib: any;

  /** Current TOTP */


  new_query = {
    question: "",
    category: "",
  }

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    /* Set title on mobile */
    if (this.dataService.isMobile()) {
      this.dataService.setTitle('FAQs');
    }
  }



  ngOnDestroy() {
    if (this.totpInterval) {
      clearInterval(this.totpInterval);
    }
  }

  /** Fire the request */


  // /** Make and download CSV data */
  // csv(): void {
  //   if (this.dataService.isSandbox) {
  //     alert('Use https://insti.app in browser to download CSV');
  //     return;
  //   }
  //   const parser = new Parser();
  //   const csv = parser.parse(this.users);
  //   const timeStr = moment(new Date()).format('YYYYMMDD_hhmm');
  //   const filename = `${this.achievement.title.replace(' ', '')}_${timeStr}.csv`;
  //   Helpers.downloadFile(filename, csv, 'text/csv');
  // }

  submitNewQuery() {
    this.dataService.FirePOST<any>(this.new_query_url, this.new_query).subscribe(result => {
      /* We're done infinite scrolling if nothing is returned */
      if (result.error) {
        this.snackBar.open(result.error, '', { duration: 3000 })
      }
      else {
        this.new_query.question = "";
        this.new_query.category = "";
        this.snackBar.open("Some error occured.Please try again :(", '', { duration: 3000 })
      }
    }, (e) => {
      this.snackBar.open(e.message, '', { duration: 3000 })
    });
  }
}
