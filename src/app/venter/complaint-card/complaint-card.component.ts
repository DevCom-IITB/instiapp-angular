import { Component, OnInit, Input } from '@angular/core';
import { IComplaint } from '../../interfaces';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { VenterDataService } from '../venter-data.service';

@Component({
  selector: 'app-complaint-card',
  templateUrl: './complaint-card.component.html',
  styleUrls: ['./complaint-card.component.css']
})
export class ComplaintCardComponent implements OnInit {

  @Input() complaintList: IComplaint[];
  @Input() myComplaintsList: IComplaint[];
  constructor(
    public dataService: DataService,
    public venterDataService: VenterDataService,
  ) { }

  ngOnInit() {
  }

  refresh() {
    /* Get all the complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.Complaints).subscribe(result => {
      this.complaintList = result;
      this.venterDataService.getComplaintInfo(this.complaintList);
    });
    /* Get the current user complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.MyComplaints).subscribe(result => {
      this.myComplaintsList = result;
      this.venterDataService.getComplaintInfo(this.myComplaintsList);
    });
  }

  onClickEvent(event) {
    event.stopPropagation();
  }

  subscribeToComplaint(complaint_subscribed: number, complaintId: string) {
    this.venterDataService.subscribeToComplaint(complaint_subscribed, complaintId);
    this.refresh();
  }

  upVoteComplaint(has_upvoted: boolean, complaintId: string) {
    this.venterDataService.upVoteComplaint(has_upvoted, complaintId);
    this.refresh();
  }
}
