import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../helpers';
import { noop } from 'rxjs';
import { API } from '../../../api';

@Component({
  selector: 'external-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class ExternalBlogComponent implements OnInit, OnDestroy {
  public feed;
  loading = false;
  allLoaded = false;
  // blog_url: string;
  error: number;
  query: string = null;

  constructor(
    public dataService: DataService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {      
      this.dataService.setTitle('External Blog');
      this.dataService.FireGET<any[]>(API.external).subscribe(result => {
        this.feed = result;
      }, (e) => {
        this.error = e.status;
      });

    /** Lazy load on scroll to bottom */
    this.dataService.scrollBottomFunction = () => { this.lazyLoad(); };
  }

  ngOnDestroy() {
    this.dataService.scrollBottomFunction = noop;
  }

  openLink(link: string, event: any) {
    if (!event.target.classList || !Array.from(event.target.classList).includes('noprop')) {
      Helpers.openWindow(link);
    }
  }

  /** Handles loading new data when the user reaches end of page */
  lazyLoad(): void {
    if (!this.feed || this.allLoaded || this.loading) { return; }
    Helpers.CheckScrollBottom(() => {
      this.reload();
    });
  }

  /** Reload data */
  reload() {
    this.loading = true;
    this.dataService.FireGET<any[]>(API.external, { from: this.feed.length, num: 10, query: this.query}).subscribe(result => {
      /* We're done infinite scrolling if nothing is returned */
      if (result.length === 0) { this.allLoaded = true; }

      /* Add to current list */
      this.feed = this.feed.concat(result);

      this.loading = false;
    }, () => { this.loading = false; });
  }

  search(e, click = false) {
    /* Reset */
    this.allLoaded = false;
    this.feed = [];

    /* Check if nothing */
    const val: string = click ? e.value : e.target.value;
    if (!val || val.length < 3) {
      this.query = null;
      this.reload();
      return;
    }

    /* Load query data */
    if (!this.feed || this.loading) { return; }
    this.query = val;
    this.reload();
  }

}
