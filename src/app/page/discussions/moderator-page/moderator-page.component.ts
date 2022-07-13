import { Component, OnInit, } from '@angular/core';

import { API } from '../../../../api';
import { DataService } from '../../../data.service';
import { ICommunity, ICommunityPost, IUserProfile } from '../../../interfaces';

const TITLE = "Moderator's Page";

@Component({
  selector: 'app-moderator-page',
  templateUrl: './moderator-page.component.html',
  styleUrls: ['./moderator-page.component.css']
})
export class ModeratorPageComponent implements OnInit {
  public groupId: number = -1;
  public group: ICommunity;

  public posts: ICommunityPost[];

  private LOAD_SCROLL_THRESHOLD: number = 0.9;


  private dummy_text: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


  constructor(
    public dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.dataService.setTitle(TITLE);

    this.populateDummyData();
    // this.dataService.scrollBottomFunction = () => {this.loadMoreDummyPosts();}

  }

  ngOnDestroy(): void {
    // this.dataService.scrollBottomFunction = noop;
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


  onScroll(event: any){
    if(event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight*this.LOAD_SCROLL_THRESHOLD){
      this.loadMoreDummyPosts();
    }
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
        reaction_count: Array.from({length:4}, ()=>Math.floor(Math.random()*20)),
      } as ICommunityPost;

      this.posts.push(tempPost);
    }
  
    // console.log(`Loaded 20 more posts`)
  
  }

}
