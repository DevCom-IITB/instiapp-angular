import { Component, Input, OnInit } from '@angular/core';
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

  }

  populateDummyGroupData(): void{
    this.dataService.FireGET<ICommunity[]>(API.Communities).subscribe(result => {
      this.group = result[0];
      this.dataService.setTitle(this.group.name);
    },(e) => {
      this.error = e.status;
    })

    
    // this.group = {
    //   id: "group_id",
    //   name: "rando_group",
    //   followers_count: 314,
    //   about: "A random about of a random group",
    //   logo_image: "https://img-getpocket.cdn.mozilla.net/404x202/filters:format(jpeg):quality(60):no_upscale():strip_exif()/https%3A%2F%2Fs3.amazonaws.com%2Fpocket-curatedcorpusapi-prod-images%2F7eb841f1-1ddc-4cc8-bbc4-6cb78a89a6f2.jpeg",
    //   cover_image: "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F95fd02e5-250c-45a0-adfb-1221d0f80740%2Ffavicon.png?table=space&id=25aa4783-06bb-4449-8a72-9a6f50212add&width=40&userId=f0291cd6-27fa-41df-a2db-ae0e4cd99c32&cache=v2",
    //   description: "A random description of a random group",
    //   created_at: new Date(2017, 9, 29),
    //   is_user_following: (Math.random() > 0.5),
    //   str_id: "group_str_id",
    // } as ICommunity;
  }

  populateDummyData(): void{
    this.populateDummyGroupData();
    this.posts = new Array<ICommunityPost>();

    let dummy_content_size = this.dummy_text.length;

    let posting_user = {
      name: "Dheer Banker",
    } as IUserProfile;

    for(let i=0;i<20;i++){
      let tempPost = {
        id: "some_unique_id",
        strId: "temporary_id",
        comments:[],
        content: this.dummy_text.slice(0,Math.floor(Math.random()*dummy_content_size)),
        commentsCount: Math.floor(Math.random()*1000),
        postedBy: posting_user,
        timeOfCreation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
        reactionCount: Array.from({length:4}, ()=>Math.floor(Math.random()*20)),
      } as ICommunityPost;

      this.posts.push(tempPost);
    }
  }

}
