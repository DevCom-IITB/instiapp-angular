import { Component, OnInit, Input } from '@angular/core';
import { IOfferedAchievement, IBody } from '../../../interfaces';
import { DataService } from '../../../data.service';

@Component({
    selector: 'app-achievement-offer-make',
    templateUrl: './achievement-offer-make.component.html',
    styleUrls: ['./achievement-offer-make.component.css'],
    standalone: false
})
export class AchievementOfferMakeComponent implements OnInit {
  @Input() offer: IOfferedAchievement;
  @Input() bodies = [] as IBody[];
  offerTypes = [] as any[];

  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.dataService.getAchievementOfferTypes().subscribe((res) => {
      this.offerTypes = res;
    });
  }
}
