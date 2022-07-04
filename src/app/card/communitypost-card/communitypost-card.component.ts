import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-communitypost-card',
  templateUrl: './communitypost-card.component.html',
  styleUrls: ['./communitypost-card.component.css']
})
export class CommunityPostCardComponent implements OnInit {

  @Input() public avatar: string;
  @Input() public title = '';
  @Input() public subtitle = '';
  @Input() public badge: string;
  @Input() public followers: '';

  constructor() { }

  ngOnInit() {
  }

}
