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
    this.populateDummyGroups();
    // this.user[0].name='Insight';
    // this.groups[0].id = '1';
    // this.groups[0].title='Insight Discussion Forum';
    // this.groups[0].body='Followers - 3000';
    // this.groups[0].created_by = this.user[0];

    // this.user[1].name='DevCom';
    // this.groups[1].id = '2';
    // this.groups[1].title='Devcom Discussion Forum';
    // this.groups[1].body='Followers - 4000';
    // this.groups[1].created_by = this.user[1];
  }

  populateDummyGroups(){
    if (this.groups === undefined){
      this.groups = new Array<IGroup>();
    }
    const dummy_creator = {
      name: "DevCom_Admin",
    } as IUserProfile;

    const group1: IGroup = {
      id:1,
      title:'Insight Discussion Forum',
      body: '4000 Following',
      created_by:dummy_creator
    }
    const group2: IGroup = {
      id:2,
      title:'DevCom Roxx',
      body: '7b Following',
      created_by:dummy_creator
    }

    this.groups.push(group1);
    this.groups.push(group2);
  }

  getBodies() {
     return this.groups;
  }

}
