import { Component, OnInit, Input } from '@angular/core';
import { IOfferedAchievement, IBody } from '../../../interfaces';

@Component({
  selector: 'app-achievement-offer-make',
  templateUrl: './achievement-offer-make.component.html',
  styleUrls: ['./achievement-offer-make.component.css']
})
export class AchievementOfferMakeComponent implements OnInit {

  @Input() offer: IOfferedAchievement;
  @Input() bodies = [] as IBody[];

  constructor() { }

  ngOnInit() {
  }

}
