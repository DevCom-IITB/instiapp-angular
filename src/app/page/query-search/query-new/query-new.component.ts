
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
  };
  catagory: string[];
  selectedYears: any[];
  selected: any[];
  years: any[];
  loading: false;
  filtered = [];
  search_url: string;
  new_query_url: string;
  query: '';
  noResults: boolean;
  error: number;
  filter_string: string;
  finalarray: any[];
  resultMessage = 'You have successfully posted the question';


  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

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
  }
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