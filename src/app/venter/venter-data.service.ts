import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { IComplaint } from '../interfaces';
import { MatSnackBar } from '@angular/material';
import { DataService } from '../data.service';
import { API } from '../../api';

@Injectable()
export class VenterDataService {

  constructor(
    public snackBar: MatSnackBar,
    public dataService: DataService,
  ) { }

  getComplaintInfo(complaintList: IComplaint[]) {
    complaintList.forEach(element => {
      this.getStatusColor(element);
      this.getComplaintReportedTime(element);
    });
  }

  getDetailedComplaintInfo(complaint: IComplaint) {
    this.getStatusColor(complaint);
    this.getComplaintReportedTime(complaint);
    this.getCommentReportedTime(complaint);
  }

  getStatusColor(complaint: IComplaint) {
    switch (complaint.status.toLowerCase()) {
      case 'reported': {
        complaint.status_color = 'red';
         break;
      }
      case 'resolved': {
        complaint.status_color = 'green';
         break;
      }
      case 'in progress': {
        complaint.status_color = 'yellow';
        break;
     }
      default: {
        complaint.status_color = 'red';
         break;
      }
   }
  }

  getComplaintReportedTime(complaint: IComplaint) {
    complaint.reported_date = moment(complaint.report_date).format('MMMM Do YYYY');
  }

  getCommentReportedTime(complaint: IComplaint) {
    complaint.comments.forEach(element => {
      element.reported_date = moment(element.time).format('MMMM Do YYYY');
    });
  }

  getSnackbar(text: string, error: any) {
    if (error === null) {
      this.snackBar.open(text, 'Dismiss', {
        duration: 2000,
      });
    } else {
      this.snackBar.open(text + ` - ${error.message}`, 'Dismiss', {
        duration: 2000,
      });
    }
  }

  subscribeToComplaint(complaint_subscribed: number, complaintId: string) {
    this.dataService.FireGET<IComplaint>(API.SubscribeToComplaint,
        { complaintId: complaintId, action: complaint_subscribed === 0 ? 1 : 0 }).subscribe(() => {
          if (complaint_subscribed === 1) {
            this.getSnackbar('You are unsubscribed from this complaint', null);
            this.snackBar.open('', 'Dismiss', {
            duration: 2000,
          });
        } else {
          this.getSnackbar('You are subscribed to this complaint', null);
        }
    }, (error) => {
      this.getSnackbar('Subscription Failed', error);
    });
  }

  upVoteComplaint(has_upvoted: boolean, complaintId: string) {
    let complaint_upvoted: number;
    if (has_upvoted === true) {
      complaint_upvoted = 1;
    } else {
      complaint_upvoted = 0;
    }
    this.dataService.FireGET<IComplaint>(API.UpVote,
      { complaintId: complaintId, action: complaint_upvoted === 0 ? 1 : 0 })
      .subscribe(() => {
        if (complaint_upvoted === 1) {
          this.getSnackbar('Your upvote has been removed', null);
        } else {
          this.getSnackbar('You have upvoted this complaint', null);
        }
      }, (error) => {
        this.getSnackbar('Upvote Removal Failed', error);
      });
  }
}
