import { Component, Input, OnInit } from '@angular/core';
import { API } from '../../../../api';
import { DataService } from '../../../data.service';
import { ICommunity, ICommunityPost, IUserProfile } from '../../../interfaces';
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

  public tabs=[
    { id:0, name:"All", show: true },
    { id:1, name:"Your Posts", show: false },
    { id:2, name:"Pending", show: false },
  ];

  private LOAD_SCROLL_THRESHOLD: number = 0.9;

  private dummy_text: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";



  constructor(
    // private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    private dialog : MatDialog,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (!this.groupId) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];
        this.refresh();
      });

      this.is_approval_moderator = this.dataService.HasBodyPermission(this.group.body.id, 'AppP');
    }

  }

  ngOnChanges(){
    this.refresh();
  }

  ngOnDestroy(): void {
    // this.dataService.scrollBottomFunction = noop;
  }

  refresh(){
    this.group = null;
    this.posts = null;

    this.updateTabs();

    this.populateGroupAndPosts(); 
  }
  populateGroupAndPosts(): void{
    this.dataService.FillGetCommunity(this.groupId).subscribe(result => {
      this.group = result;
      this.posts = this.group.posts;

      // this.dataService.setTitle(this.group.name);
    });
  }

  updateTabs(): void{
    if(this.dataService.isLoggedIn()) this.tabs[1].show=true;
    if(this.is_approval_moderator) this.tabs[2].show=true;
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.panelClass= 'custom-container';
    this.dialog.open(AddPostComponent,dialogConfig);
  }
  
  //TODO: Apply a debouncer to this for better performance
  onScroll(event: any){
    if(event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight*this.LOAD_SCROLL_THRESHOLD){
      this.loadMoreDummyPosts();
    }
  }
  
  populateDummyGroupData(): void{
    this.dataService.FireGET<ICommunity[]>(API.Communities).subscribe(result => {
      this.group = result[0];
      this.dataService.setTitle(this.group.name);
    },(e) => {
      console.log(e)
      // Handle this error
    })
  
  }
  
  populateDummyData(): void{
    this.populateDummyGroupData();
    this.posts = new Array<ICommunityPost>();
  
    this.loadMoreDummyPosts();
  }
  loadMoreDummyPosts(): void {
    let dummy_content_size = this.dummy_text.length;
    
    let posting_user = {
      name: "Dheer Banker",
    } as IUserProfile;
    
    for(let i=0;i<20;i++){
      let tempPost = {
        id: "some_unique_id",
        str_id: "temporary_id",
        thread_rank: 1,
        comments:[],
        content: this.dummy_text.slice(0,Math.floor(Math.random()*dummy_content_size)),
        comments_count: Math.floor(Math.random()*1000),
        posted_by: posting_user,
        time_of_creation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
        reactions_count: Array.from({length:6}, ()=>Math.floor(Math.random()*20)),
      } as ICommunityPost;
      
      this.posts.push(tempPost);
    }
  }
  
}
