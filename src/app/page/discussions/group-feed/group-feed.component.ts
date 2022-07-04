import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { ICommunity, ICommunityPost } from '../../../interfaces';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.css']
})
export class GroupFeedComponent implements OnInit {
  @Input() public groupId: number = -1;
  @Input() public group: ICommunity;

  public posts: ICommunityPost[];

  // private dummyContent: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


  constructor(
    // private activatedRoute: ActivatedRoute,
    public dataService: DataService
  ) { }

  ngOnInit(): void {


  }



}
