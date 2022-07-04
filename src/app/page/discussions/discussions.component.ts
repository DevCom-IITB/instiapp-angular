import { Component, OnInit, Input } from '@angular/core';
import { ICommunity, IUserProfile } from '../../interfaces';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { API } from '../../../api';

const TITLE = 'Discussions';

@Component({
  selector: 'app-insight-disscussion-forum',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css']
})


export class DiscussionsComponent implements OnInit {
  @Input() public groups: ICommunity[];
  @Input() public allgroups: ICommunity[];
  @Input() public user: IUserProfile[];
  public selectedGroup: ICommunity;
  public error: number;


  constructor(
    public dataService: DataService,
    public router: Router,

  ) { }


  ngOnInit() {

    this.dataService.setTitle(TITLE);

    this.dataService.FireGET<ICommunity[]>(API.Communities).subscribe(result => {
      this.groups = result;
      this.allgroups = result;
    }, (e) => {
      this.error = e.status;
    });


  }



  getBodies() {
    return this.groups;
  }

  over(group: ICommunity) {

    // adding route
    if (this.dataService.isMobile()) {
      this.router.navigate(['group', group.id]);
    } else {
      this.selectedGroup = group;
    }
  }

}
