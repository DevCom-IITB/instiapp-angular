import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { IBody, ICommunity, ICommunityPost } from '../../interfaces';
import { DataService } from '../../data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { API } from '../../../api';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css'],
})
export class GroupDetailsComponent implements OnChanges, OnInit {
  @Input() public groupId: string;
  @Input() public noCenter = false;
  @Output() public load = new EventEmitter<boolean>();

  public group: ICommunity;
  public group_body: IBody;

  public featured_posts: ICommunityPost[];

  public error: number;
  @Input() public desktopMode = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public router: Router
  ) {}

  /** Refresh the component whenever passed groupId changes */
  ngOnChanges() {
    this.refresh();
  }

  /** Check if called with a url and update */
  ngOnInit() {
    if (!this.groupId) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];
      });
    } else {
      this.desktopMode = true;
    }

    this.refresh();
  }

  refresh() {
    this.group = null;
    this.dataService.FillGetCommunity(this.groupId).subscribe(
      (result) => {
        this.group = result;
        this.featured_posts = result.featured_posts;

        /* Do not change title in split mode */
        if (!this.desktopMode) {
          this.dataService.setTitle(result.name);
        }
      },
      (e) => {
        this.load.emit(false);
        this.error = e.status;
      }
    );

    this.dataService
      .FireGET<IBody>(API.Body, { uuid: this.group.body })
      .subscribe(
        (result) => {
          this.group_body = result;
        },
        (e) => {
          this.error = e.status;
        }
      );
  }

  onJoinClicked(): void {
    this.followBody(this.group_body);
  }
  followBody(body: IBody) {
    if (!this.dataService.isLoggedIn()) {
      alert('Login first!');
      return;
    }
    /* Fire new API! */
    this.dataService
      .FireGET(API.BodyFollow, {
        uuid: body.id,
        action: body.user_follows ? 0 : 1,
      })
      .subscribe(() => {
        this.group.is_user_following = !this.group.is_user_following;
        this.group.followers_count += this.group.is_user_following ? 1 : -1;
      });
  }
}
