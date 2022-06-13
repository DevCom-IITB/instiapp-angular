import { Component, OnInit, Input } from '@angular/core';
import { IGroup } from '../../interfaces';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {
   @Input() group: IGroup;
  constructor() { }

  ngOnInit(): void {
  }

}
