import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-achievement-new',
  templateUrl: './achievement-new.component.html',
  styleUrls: ['./achievement-new.component.css']
})
export class AchievementNewComponent implements OnInit {

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set title on mobile */
    if (this.dataService.isMobile()) {
      this.dataService.setTitle('Achievement Request');
    }
  }

}
