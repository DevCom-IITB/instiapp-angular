import { Component, Input } from '@angular/core';
import { IBody } from '../interfaces';

@Component({
  selector: 'app-body-card',
  templateUrl: './body-card.component.html',
  styleUrls: ['./body-card.component.css']
})
export class BodyCardComponent {

  @Input() public body: IBody[];
  @Input() public subtitle: string;

  constructor() { }

}
