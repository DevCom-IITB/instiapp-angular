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

  constructor() {
    this.show_comment_thread = false; // might make the erroneous behaviour of always keeping that at false
   }

  ngOnInit() {
    this.printable_date = this.post.time_of_creation.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    this.num_reactions += this.post.reaction_count.reduce((a,b)=>a+b,0)


  }

}
