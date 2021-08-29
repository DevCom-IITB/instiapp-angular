import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../../api';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-query-search',
  templateUrl: './query-search.component.html',
  styleUrls: ['./query-search.component.css']
})
export class QuerySearchComponent implements OnInit {

  public answers = [];
  loading : boolean = false;
  search_url : string;
  new_query_url :  string;
  query : string = "";
  noResults : boolean;
  error : number;
  new_query = {
    question : "",
    category : "",
  }

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.dataService.setTitle('Find Answers');
    this.search_url = API.Query;
    this.new_query_url = API.AddNewQuery;
    this.search();

  }

  search() {
    this.loading = true;
    this.answers = [];
    this.noResults = false;
    this.error = 0;
    console.log(this.query)
    this.dataService.FireGET<any[]>(this.search_url, { query: this.query}).subscribe(result => {
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

  submitNewQuery(){
    this.dataService.FirePOST<any>(this.new_query_url, this.new_query).subscribe(result => {
      /* We're done infinite scrolling if nothing is returned */
      if (result.error) { 
        this.snackBar.open(result.error,'',{duration : 3000})
      }
      else{
        this.new_query.question = "";
        this.new_query.category = "";
        this.snackBar.open("Some error occured.Please try again :(",'',{duration : 3000})
      }
    }, (e) => {
      this.snackBar.open(e.message,'',{duration : 3000})
    });
  }

}
