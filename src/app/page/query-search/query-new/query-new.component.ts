
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../../../api';
// import { API } from '../../../../api';

import { DataService } from '../../../data.service';
@Component({
  selector: 'app-query-new',
  templateUrl: './query-new.component.html',
  styleUrls: ['./query-new.component.css']
})
export class QueryNewComponent implements OnInit {

  /** Main object to edit */
  new_query = {
    question: '',
    category: '',
  }
  catagory: string[];
  selectedYears: any[];
  selected: any[];
  years: any[];
  loading: boolean = false;
  filtered = [];
  search_url: string;
  new_query_url: string;
  query: string = '';
  noResults: boolean;
  error: number;
  filter_string: string;
  finalarray: any[];
  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }


  /** Users from offer */
  // users: IUserProfile[];

  /** Secret */
  secret: string;

  /** ID of offer if present */
  offerId: string;
  /** Show the QR code = 1 static = 2 result = 3*/
  showQR = 0;
  resultMessage = 'You have successfully posted the question';

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
  ) { }

  ngOnInit() {
    /* Set title on mobile */
    if (this.dataService.isMobile()) {
      this.dataService.setTitle('FAQs');
    }
    this.years = [
      'Filter/ALL',
      'Acadamic',
      'SMP',
      'Sports',
      'Cultural',
      'Technical'
    ]
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

    this.dataService.FirePOST<any>(API.AddNewQuery, this.new_query).subscribe(result => {
      /* We're done infinite scrolling if nothing is returned */
      if (result.error) {
        this.snackBar.open(result.error, '', { duration: 3000 })
      }
      else {
        this.new_query.question = '';
        this.new_query.category = '';
        this.snackBar.open("Query submitted.", '', { duration: 3000 })
        console.log(this.new_query.category)
      }
    }, (e) => {
      this.snackBar.open(e.message, '', { duration: 3000 })
    });
  }
}