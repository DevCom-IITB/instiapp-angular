import { Component, OnInit, Input } from '@angular/core';
import { IGroup, IUserProfile } from '../../interfaces';

@Component({
  selector: 'app-insight-disscussion-forum',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css']
})
export class DiscussionsComponent implements OnInit {
  @Input() public groups: IGroup[];
  @Input() public user: IUserProfile[];
  constructor() { }

  ngOnInit(){
    this.user[0].name='Insight';
    this.groups[0].id = '1';
    this.groups[0].title='Insight Discussion Forum';
    this.groups[0].body='Followers - 3000';
    this.groups[0].created_by = this.user[0];

    this.user[1].name='DevCom';
    this.groups[1].id = '2';
    this.groups[1].title='Devcom Discussion Forum';
    this.groups[1].body='Followers - 4000';
    this.groups[1].created_by = this.user[1];
  }

  getBodies() {
     return this.groups;
  }

}
