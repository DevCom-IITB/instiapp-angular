import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  public feed;

  constructor(
    public dataService: DataService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['blog']) {
        this.dataService.FireGET(
          this.dataService.DecodeObject(params['blog'])).subscribe(result => {

          this.feed = result;
        });
      }
    });
  }

  openLink(link: string) {
    window.open(link);
  }

}
