import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { Helpers } from '../../helpers';
import { noop } from 'rxjs';
import { INewsEntry } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css'],
    standalone: false
})
export class NewsComponent implements OnInit, OnDestroy {
  public feed: INewsEntry[];
  public bodyid: string;

  loading = false;
  allLoaded = false;
  public error;

  constructor(
    public dataService: DataService,
    public activatedRoute: ActivatedRoute,
  ) { }

  public reactions = [
    {id: 0, 'i': 'thumbsup'},
    {id: 1, 'i': 'heart'},
    {id: 2, 'i': 'laughing'},
    {id: 3, 'i': 'open_mouth'},
    {id: 4, 'i': 'disappointed'},
    {id: 5, 'i': 'angry'},
  ];

  ngOnInit() {
    this.dataService.setTitle('News');

    /* Check for body query param */
    const params = this.activatedRoute.snapshot.queryParams;
    this.bodyid = params['body'];

    /* Get news feed */
    this.dataService.FireGET<INewsEntry[]>(API.NewsFeed, { from: 0, num: 10, body: this.bodyid}).subscribe(result => {
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

  /** Open link in new window */
  openLink(link: string, event: any) {
    if (!event.target.classList || !Array.from(event.target.classList).includes('noprop')) {
      Helpers.openWindow(link);
    }
  }

  /** Lazy load 10 more entries */
  lazyLoad(): void {
    if (!this.feed || this.allLoaded || this.loading) { return; }
    Helpers.CheckScrollBottom(() => {
      this.loading = true;
      this.dataService.FireGET<any[]>(API.NewsFeed, { from: this.feed.length, num: 10, body: this.bodyid}).subscribe(result => {
        if (result.length === 0) { this.allLoaded = true; }
        this.feed = this.feed.concat(result);
        this.loading = false;
      }, () => { this.loading = false; });
    });
  }

  /**
   * Get reaction heat from total number of reactions on a news item
   * @param item News item
   */
  getReactColor(item: INewsEntry) {
    const count = Object.values(item.reactions_count).reduce((a, b) => a + b);
    const s = Math.min(count / 10, 1);
    const c = { R: 255, G: 88, B: 36 };
    return `rgb(${Math.floor(c.R * s)}, ${Math.floor(c.G * s)}, ${Math.floor(c.B * s)})`;
  }

  /** Fire a reaction */
  do_reaction(news: INewsEntry, react: number) {
    if (!this.dataService.isLoggedIn()) {
      alert('Please log in to continue!');
      return;
    }

    if (news.user_reaction !== react) {
      this.dataService.MarkUNR(news, react).subscribe(() => {
        news.reactions_count[news.user_reaction]--;
        news.user_reaction = react;
        news.reactions_count[react]++;
      });
    } else {
      this.dataService.MarkUNR(news, -1).subscribe(() => {
        news.reactions_count[news.user_reaction]--;
        news.user_reaction = -1;
      });
    }
  }
}
