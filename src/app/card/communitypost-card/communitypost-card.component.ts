import { Component, OnInit, Input } from '@angular/core';
import { ICommunityPost } from '../../interfaces';

@Component({
  selector: 'app-communitypost-card',
  templateUrl: './communitypost-card.component.html',
  styleUrls: ['./communitypost-card.component.css']
})
export class CommunityPostCardComponent implements OnInit {

  @Input() public post: ICommunityPost;

  // @Input() public avatar: string;
  // @Input() public title = '';
  // @Input() public subtitle = '';
  // @Input() public badge: string;
  // @Input() public followers: '';

  public printable_date: String;
  public num_reactions: number = 0;

  constructor() { }

  ngOnInit() {
    this.printable_date = this.post.timeOfCreation.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    this.num_reactions += this.post.reactionCount.reduce((a,b)=>a+b,0)
  }

}
