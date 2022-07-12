import { Component, OnInit, Input } from '@angular/core';
import { ICommunityPost, IUserProfile } from '../../interfaces';

@Component({
  selector: 'app-communitypost-card',
  templateUrl: './communitypost-card.component.html',
  styleUrls: ['./communitypost-card.component.css']
})
export class CommunityPostCardComponent implements OnInit {

  @Input() public post: ICommunityPost;
  @Input() public show_comment_thread: boolean;

  // @Input() public avatar: string;
  // @Input() public title = '';
  // @Input() public subtitle = '';
  // @Input() public badge: string;
  // @Input() public followers: '';

  public printable_date: String;
  public num_reactions: number = 0;
  
  public pic_offset: number;
  public name_offset: number;

  public post_border_radius: number;
  
  public is_rank_one: boolean;
  public render_images: boolean;

  public show_comment_input: boolean;
  public more_comments: boolean;


  private dummy_text: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  constructor() {
   }

  ngOnInit() {
    this.initialiseVariables();
  }

  initialiseVariables(){
    this.printable_date = this.post.time_of_creation.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    if(this.post.reaction_count == null) this.post.reaction_count = [0,0,0,0,0,0]; // Maybe a different default is preferred?

    this.show_comment_thread = false; // might make the erroneous behaviour of always keeping that at false
    
    this.num_reactions += this.post.reaction_count.reduce((a,b)=>a+b,0)
    
    this.is_rank_one = (this.post.thread_rank == 1);
    
    this.more_comments = this.is_rank_one; // Default should be false, change that after testing

    if (!this.is_rank_one){
      this.pic_offset = -46;
      this.name_offset = -38;
      this.post_border_radius = 0;
    } else{
      this.pic_offset = 0;
      this.name_offset = 0;
      this.post_border_radius = 15;
    }

    this.render_images = (this.post.image_url?.length > 0);

    this.show_comment_input = this.is_rank_one && this.show_comment_thread;
  }

  onViewMoreClicked(): void{
    this.loadMoreComments();
  }

  onCommentButtonClicked(): void{
    this.show_comment_input = !this.show_comment_input;
    this.show_comment_thread = this.show_comment_input;

    if(this.show_comment_thread && this.more_comments && this.post.comments.length == 0){
      this.loadMoreComments();
    }
  }

  loadMoreComments(): void{
    if(!this.more_comments) return;

    this.loadDummyComments();
  }
  loadDummyComments(){ // Only for testing/demo purposes. Delete when API connection done.

    let posting_user = {
      name: "Melon Musk ",
      profile_pic: "https://d1z88p83zuviay.cloudfront.net/ProductVariantThumbnailImages/e18724f0-fa0e-4d68-a1b1-15aa47d3b950_425x425.jpg",
    } as IUserProfile;    

    let dummy_content_size = Math.floor(this.dummy_text.length/2);

    let posts_left = this.post.comments_count - this.post.comments.length;

    for(let i=0; i<Math.min(posts_left,4); i++){
      let temp_post = {
        id: "some_unique_id",
        str_id: "temporary_id",
        thread_rank: this.post.thread_rank+1,
        comments: [],
        content: this.dummy_text.slice(0,Math.floor(Math.random()*dummy_content_size)),
        comments_count: Math.floor(Math.random()*100),
        posted_by: posting_user,
        time_of_creation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
      } as ICommunityPost;

      this.post.comments.push(temp_post);
    }

    this.more_comments = (this.post.comments.length<this.post.comments_count);
  }

  onReplyClicked(): void{
    this.show_comment_input = !this.show_comment_input;
  }
}
