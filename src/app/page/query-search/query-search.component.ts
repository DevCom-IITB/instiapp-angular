import { Component, OnInit } from '@angular/core';
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
  query : string;
  noResults : boolean;
  error : number;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.setTitle('Find Answers');
    this.search_url = API.Query;
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

}
