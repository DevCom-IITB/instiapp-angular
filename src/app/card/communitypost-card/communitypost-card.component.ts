import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Helpers } from '../../helpers';
import { ICommunityPost, IUserProfile } from '../../interfaces';

@Component({
  selector: 'app-communitypost-card',
  templateUrl: './communitypost-card.component.html',
  styleUrls: ['./communitypost-card.component.css']
})
export class CommunityPostCardComponent implements OnInit {

  @Input() public post: ICommunityPost;
  @Input() public show_comment_thread: boolean;
  @Input() public ghost: boolean;

  // @Input() public avatar: string;
  // @Input() public title = '';
  // @Input() public subtitle = '';
  // @Input() public badge: string;
  // @Input() public followers: '';


  public is_moderator: boolean;

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

    if(!this.is_rank_one && this.post.comments_count > 0 && this.post.comments.length <= 0){
      this.loadMoreComments();
    }

    // console.log(`isGhost (${this.ghost}) : rank ${this.post.thread_rank}: ${this.post.comments.length} comments loaded`)
  }

  initialiseVariables(){
    this.printable_date = this.post.time_of_creation.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    if(this.post.reaction_count == null) this.post.reaction_count = [0,0,0,0,0,0]; // Maybe a different default is preferred?

    if(this.show_comment_thread === undefined)
      this.show_comment_thread = false;

    if(this.ghost === undefined)
      this.ghost = false;
    
    this.is_moderator = true; //Note: Change this to true only for testing purposes

    this.num_reactions += this.post.reaction_count.reduce((a,b)=>a+b,0)
    
    this.is_rank_one = (this.post.thread_rank == 1);
    
    this.more_comments = (this.post.comments.length < this.post.comments_count);

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
    // console.log(`${this.post.thread_rank} rank: ${this.post.comments_count} comments`)
  }

  onViewMoreClicked(): void{
    this.loadMoreComments();
  }

  onGhostClicked(): void{
    this.show_comment_thread = true;
  }

  onAddReactionClicked(): void{
    console.log(`add reaction button clicked`)
  }
  onReactionClicked(reaction_index: number): void{
    console.log(`reaction with index ${reaction_index} clicked`)
  }

  onCommentButtonClicked(): void{
    this.show_comment_input = !this.show_comment_input;
    this.show_comment_thread = this.show_comment_input;

    if(this.show_comment_thread && this.more_comments && this.post.comments.length == 0){
      this.loadMoreComments();
    }
  }
  loadMoreComments(): void{
    if(!this.more_comments || this.ghost) return;

    this.loadDummyComments();
  }
  
  onReplyClicked(): void{
    this.show_comment_input = !this.show_comment_input;
  }
  
  onShareClicked(): void{
    Helpers.NativeShare(`Post by ${this.post.posted_by.name}`, `Check out this post by ${this.post.posted_by.name} at InstiApp!`, this.getPostUrl());
  }
  
  onFeaturePinClicked(): void{
    console.log(`user is moderator: ${this.is_moderator}; feature pin option selected`);
  }

  getPostUrl(): string{
    return  `${environment.host}org/${this.post.str_id}`;
  }

// Dummy data generating code below this point: REMOVE on production


  loadDummyComments(){ // Only for testing/demo purposes. Delete when API connection done.

    let posting_user = {
      name: "Melon Musk ",
      // profile_pic: "https://d1z88p83zuviay.cloudfront.net/ProductVariantThumbnailImages/e18724f0-fa0e-4d68-a1b1-15aa47d3b950_425x425.jpg",
      profile_pic: "https://img-getpocket.cdn.mozilla.net/404x202/filters:format(jpeg):quality(60):no_upscale():strip_exif()/https%3A%2F%2Fs3.amazonaws.com%2Fpocket-curatedcorpusapi-prod-images%2Fe61c1b7e-11b4-492b-83b5-48adb8761c20.jpeg",
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
        // comments_count: 12,
        posted_by: posting_user,
        time_of_creation: new Date(2010+Math.floor(Math.random()*20), 1+Math.floor(Math.random()*12),1+Math.floor(Math.random()*28)),
      } as ICommunityPost;

      this.post.comments.push(temp_post);
    }

    this.more_comments = (this.post.comments.length<this.post.comments_count);
  }
}
