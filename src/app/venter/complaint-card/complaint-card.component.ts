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

  @Input() complaint: IComplaint;
  constructor(
    public dataService: DataService,
    public venterDataService: VenterDataService,
  ) { }

  ngOnInit() {
  }

  refresh() {
    /* Get complaint from server*/
    this.dataService.FireGET<IComplaint>(API.Complaint, { complaintId: this.complaint.id }).subscribe(result => {
      this.complaint = result;
      this.venterDataService.getDetailedComplaintInfo(this.complaint);
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
