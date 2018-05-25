import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { API } from '../../API';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  public feed;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.FireGET(API.NewsFeed).subscribe(result => {
      this.feed = result;
    });
  }

  openLink(link: string) {
    window.open(link);
  }

}
