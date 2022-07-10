import { Component, Input, OnInit } from '@angular/core';
import { API } from '../../../../api';
import { DataService } from '../../../data.service';
import { ICommunity, ICommunityPost, IUserProfile } from '../../../interfaces';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  @Input() public post: ICommunityPost;
  @Input() public group: ICommunity;


  private dummy_text: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.populateDummyData();
  }

  populateDummyData(): void {
    this.dataService.FireGET<ICommunity[]>(API.Communities).subscribe(result => {
      this.group = result[0];
      this.dataService.setTitle(this.group.name);
    },(e) => {
      console.log(e);
    })

    let comment_list = this.getDummyCommentList(4);

    let posting_user = {
      name: "Dheer Banker",
      profile_pic: "data:image/jpeg;base64,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",
    } as IUserProfile;

    let dummy_content_size = this.dummy_text.length;

    this.post = {
        id: "id",
        str_id: "str_id",
        thread_rank: 1,
        comments: comment_list,
        content: this.dummy_text.slice(0,Math.floor(Math.random()*dummy_content_size)),
        comments_count: Math.floor(Math.random()*1000),
        posted_by: posting_user,
        time_of_creation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
      } as ICommunityPost;
  }

  getDummyCommentList(depth?: number): ICommunityPost[]{
    if(typeof(depth) === undefined){
      depth = 1;
    }
    if(depth == 0){
      return [];
    }

    let res = new Array<ICommunityPost>();

    let posting_user = {
      name: "Melon Musk ",
      profile_pic: "https://d1z88p83zuviay.cloudfront.net/ProductVariantThumbnailImages/e18724f0-fa0e-4d68-a1b1-15aa47d3b950_425x425.jpg",
    } as IUserProfile;    

    let dummy_content_size = Math.floor(this.dummy_text.length/2);

    for(let i=0; i<4; i++){
      let temp_post = {
        id: "some_unique_id",
        str_id: "temporary_id",
        thread_rank: 2,
        comments:this.getDummyCommentList(depth-1),
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
