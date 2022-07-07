import { Component, Input, OnInit } from '@angular/core';
import { noop } from 'rxjs';
import { API } from '../../../../api';
import { DataService } from '../../../data.service';
import { ICommunity, ICommunityPost, IUserProfile } from '../../../interfaces';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.css']
})
export class GroupFeedComponent implements OnInit {
  @Input() public groupId: number = -1;
  @Input() public group: ICommunity;

  public posts: ICommunityPost[];

  private error;

  private dummy_text: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  // private dummyContent: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


  constructor(
    // private activatedRoute: ActivatedRoute,
    public dataService: DataService
  ) { }

  ngOnInit(): void {

    this.populateDummyData();
    this.dataService.scrollBottomFunction = () => {this.loadMoreDummyPosts();}

  }

  ngOnDestroy(): void {
    this.dataService.scrollBottomFunction = noop;
  }

  populateDummyGroupData(): void{
    this.dataService.FireGET<ICommunity[]>(API.Communities).subscribe(result => {
      this.group = result[0];
      this.dataService.setTitle(this.group.name);
    },(e) => {
      this.error = e.status;
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
        comments:[],
        content: this.dummy_text.slice(0,Math.floor(Math.random()*dummy_content_size)),
        comments_count: Math.floor(Math.random()*1000),
        posted_by: posting_user,
        time_of_creation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
        reaction_count: Array.from({length:4}, ()=>Math.floor(Math.random()*20)),
      } as ICommunityPost;

      this.posts.push(tempPost);
    }
  
    // console.log(`Loaded 20 more posts`)
  }

}
