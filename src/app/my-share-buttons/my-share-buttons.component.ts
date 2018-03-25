import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-my-share-buttons',
  templateUrl: './my-share-buttons.component.html',
  styleUrls: ['./my-share-buttons.component.css']
})
export class MyShareButtonsComponent implements OnInit {

  @Input() url;

  constructor() { }

  ngOnInit() {
  }

}
