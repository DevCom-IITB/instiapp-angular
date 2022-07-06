import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-desktop-split-dynamic',
  templateUrl: './desktop-split-dynamic.component.html',
  styleUrls: ['./desktop-split-dynamic.component.css']
})
export class DesktopSplitDynamicComponent implements OnInit {

  /** 0 = no hiding
   *  1 = hide center
   *  2 = hide right
   */
  @Input() public hideOnMobile = 2;
  @Input() public isGroup = false;
  @Input() public center_width_percentage;

  /** True for right border on center element */
  @Input() public centerRightBorder = false;

  /** True for left border on right element */
  @Input() public rightLeftBorder = true;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit(){
    if(this.center_width_percentage === undefined)
      this.center_width_percentage=50;
    if (this.center_width_percentage < 0 || this.center_width_percentage > 100) 
      this.center_width_percentage=50;
  }

}
