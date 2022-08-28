import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { API } from '../../../../api';
import { DataService } from '../../../data.service';
import { ICommunity, ICommunityPost } from '../../../interfaces';
import { MatDialog, MatDialogConfig, } from "@angular/material/dialog";
import { AddPostComponent } from '../add-post/add-post.component';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.css']
})
export class GroupFeedComponent implements OnInit {
  @Input() public groupId: string;
  @Input() public group: ICommunity;




  public posts: ICommunityPost[];

  public is_approval_moderator: boolean;
  public is_comment_moderator: boolean;

  public selected_tab: number;
  public tabs = [
    { id: 0, name: "All", show: true },
    { id: 1, name: "Your Posts", show: false },
    { id: 2, name: "Pending", show: false },
    { id: 3, name: "Reported", show: false },
  ];

  private LOAD_SCROLL_THRESHOLD: number = 0.9;




  constructor(
    // private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    private dialog: MatDialog,
    public activatedRoute: ActivatedRoute,

    public changeDetectorRef: ChangeDetectorRef,
  ) {  
  
  }

  ngOnInit(): void {
    this.selected_tab = 0;


    if (!this.groupId) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];
        this.refresh();
      });
    }
    this.dataService.FillGetCommunity(this.groupId).subscribe(result => {
      //Note: This piece of code shows why the group and group posts should be obtained separately

      this.group = result;
      this.dataService.setTitle(this.group.name);

      this.is_approval_moderator = this.dataService.HasBodyPermission(this.group.body, 'AppP'); //ModC
      this.is_comment_moderator = this.dataService.HasBodyPermission(this.group.body, 'ModC'); //ModC

      this.updateTabs();
    });


  }

  ngOnChanges() {
    this.refresh();
  }

  ngOnDestroy(): void {
    // this.dataService.scrollBottomFunction = noop;
  }

  refresh() {
    this.group = null;
    this.posts = null;


    this.populateGroupAndPosts();
  }
  populateGroupAndPosts(): void {
    switch (this.selected_tab) {
      case 0:

        this.posts = null
        this.dataService.FireGET<any>(API.CommunityAddPost, { status: 1 }).subscribe(result => {
          this.posts = result.data;
        });


        break;

      case 1:
        //populate posts of the current user
        this.posts = null
        this.dataService.FireGET<any>(API.CommunityAddPost).subscribe(result => {
          this.posts = result.data;
        });
        break;
      case 2:
        this.posts = null
        this.dataService.FireGET<any>(API.CommunityAddPost, { status: 0 }).subscribe(result => {
          this.posts = result.data;
        });

        //populate pending posts for the moderator
        break;

    }
  }

  updateTabs(): void {
    if (this.dataService.isLoggedIn()) this.tabs[1].show = true;
    if (this.is_approval_moderator) this.tabs[2].show = true;
    this.dataService.HasBodyPermission
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.panelClass = 'custom-container';
    dialogConfig.data = { community: this.group };
    this.dialog.open(AddPostComponent, dialogConfig);
  }

  //TODO: Apply a debouncer to this for better performance
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight * this.LOAD_SCROLL_THRESHOLD) {
      return;
    }
  }

  onTabClicked(tab_id: number): void {
    console.log(tab_id);

    this.selected_tab = tab_id;
    this.populateGroupAndPosts();

  }

  populateGroupData(): void {
    this.dataService.FireGET<ICommunity[]>(API.Communities).subscribe(result => {
      this.group = result[0];
      this.dataService.setTitle(this.group.name);
    }, (e) => {
      console.log(e)
      // Handle this error
    })



  }




}
