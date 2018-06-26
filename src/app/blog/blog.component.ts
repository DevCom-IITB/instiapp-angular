import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Helpers } from '../helpers';
import { noop } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {
  public feed;
  loading = false;
  allLoaded = false;
  blog_url: string;
  error: number;

  constructor(
    public dataService: DataService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['blog']) {
        this.blog_url = this.dataService.DecodeObject(params['blog']);
        this.dataService.FireGET<any[]>(this.blog_url).subscribe(result => {
          this.feed = result;
        }, (e) => {
          this.error = e.status;
        });
      }
    });

    /** Lazy load on scroll to bottom */
    this.dataService.scrollBottomFunction = () => { this.lazyLoad(); };
  }

  ngOnDestroy() {
    this.dataService.scrollBottomFunction = noop;
  }

  openLink(link: string) {
    window.open(link);
  }

  /** Handles loading new data when the user reaches end of page */
  lazyLoad(): void {
    if (!this.feed || this.allLoaded || this.loading) { return; }
    Helpers.CheckScrollBottom(() => {
      this.loading = true;
      this.dataService.FireGET<any[]>(this.blog_url, { from: this.feed.length, num: 10}).subscribe(result => {
        if (result.length === 0) { this.allLoaded = true; }
        this.feed = this.feed.concat(result);
        this.loading = false;
      }, () => { this.loading = false; });
    });
  }

}
