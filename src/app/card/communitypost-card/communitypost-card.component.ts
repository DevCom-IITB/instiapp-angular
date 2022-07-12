import { Component, OnInit, Input } from '@angular/core';
import { ICommunityPost } from '../../interfaces';

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

  constructor() {
    this.show_comment_thread = false; // might make the erroneous behaviour of always keeping that at false
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

  toggleShowInput(){
    this.show_comment_input = !this.show_comment_input;
  }
}
