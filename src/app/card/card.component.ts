import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() public avatar: string;
  @Input() public title = '';
  @Input() public subtitle = '';
  @Input() public badge: string;
  @Input() public followers: '';

  constructor() { }

  ngOnInit() {
  }

}
