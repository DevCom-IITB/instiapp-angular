import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { ICommunityPost, IUserProfile } from '../../../interfaces';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  @Input() public post: ICommunityPost;

  private dummy_text: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.populateDummyData();
  }

  populateDummyData(): void {
    let comment_list = this.getDummyCommentList();

    let posting_user = {
      name: "Dheer Banker",
    } as IUserProfile;

    let dummy_content_size = this.dummy_text.length;

    this.post = {
        id: "id",
        str_id: "str_id",
        thread_rank: 1,
        comments:[],
        content: this.dummy_text.slice(0,Math.floor(Math.random()*dummy_content_size)),
        comments_count: Math.floor(Math.random()*1000),
        posted_by: posting_user,
        time_of_creation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
      } as ICommunityPost;
  }

  getDummyCommentList(): ICommunityPost[]{
    let res = new Array<ICommunityPost>();

    let posting_user = {
      name: "Musk Melon",
    } as IUserProfile;    

    let dummy_content_size = this.dummy_text.length;

    for(let i=0; i<20; i++){
      let temp_post = {
        id: "some_unique_id",
        str_id: "temporary_id",
        thread_rank: 2,
        comments:[],
        content: this.dummy_text.slice(0,Math.floor(Math.random()*dummy_content_size)),
        comments_count: Math.floor(Math.random()*1000),
        posted_by: posting_user,
        time_of_creation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
      } as ICommunityPost;

      res.push(temp_post);
    }

    return res;
  }
}
