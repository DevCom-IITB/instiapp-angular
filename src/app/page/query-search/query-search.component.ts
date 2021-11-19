import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../../api';
import { DataService } from '../../data.service';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-query-search',
  templateUrl: './query-search.component.html',
  styleUrls: ['./query-search.component.css']

})
export class QuerySearchComponent implements OnInit {

  public answers = [];
  finalarray: String[];
  filters = new FormControl();
  selectedYears: any[];
  selected: any[];
  years: any[];
  loading: boolean = false;
  filtered = [];
  search_url: string;
  new_query_url: string;
  query: string = "";
  noResults: boolean;
  error: number;
  filter_string: string;
  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  new_query = {
    question: "",
    category: "",
  }

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.dataService.setTitle('Find Answers');
    this.search_url = API.Query;
    this.new_query_url = API.AddNewQuery;

    this.years = [

      { id: 1, viewValue: "Acadamic" },
      { id: 2, viewValue: "SMP" },
      { id: 3, viewValue: "Sports" },
      { id: 4, viewValue: "Cultural" },
      { id: 5, viewValue: "Technical" }
    ]
    this.search();
  }

  search() {


    this.loading = true;
    this.answers = [];
    this.noResults = false;
    this.error = 0;
    this.finalarray = this.selectedYears.map(function (id) {
      return id.id;
    });

    this.filter_string = this.finalarray.toString();
    console.log(this.filter_string)
    // this.filtered needs to be sent to api to filter out queries.. it contains all the filter option selected by the user

    console.log(this.finalarray) // printing filtered array

    this.dataService.FireGET<any[]>(this.search_url, { query: this.query, filter: this.finalarray }).subscribe(result => {
      /* We're done infinite scrolling if nothing is returned */
      if (result.length === 0) { this.noResults = true; }

      /* Add to current list */
      this.answers = result;

      this.loading = false;
    }, (e) => {
      this.loading = false;
      this.error = e.status;
    });
  }

  deselectAll(select: MatSelect) {
    this.selectedYears = [];
    select.value = [];
  }

  submitNewQuery() {
    this.dataService.FirePOST<any>(API.AddNewQuery, this.new_query).subscribe(result => {
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



