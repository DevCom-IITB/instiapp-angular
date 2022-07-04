import { Component, OnInit, Input } from '@angular/core';
import { ICommunity } from '../../interfaces';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {
  @Input() group: ICommunity;
  @Input() public route: string[];
  constructor(
    public dataService: DataService,
    public router: Router,
  ) { }

  ngOnInit(): void {

    /** Set router link */
    if (!this.route) {
      this.route = ['/group', this.group.id];
    }

  }






}
