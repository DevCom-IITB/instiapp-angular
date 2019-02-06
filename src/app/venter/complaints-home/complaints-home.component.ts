import { Component, OnInit } from '@angular/core';
import { IComplaint } from '../../interfaces';
import { DataService } from '../../data.service';
import { API } from '../../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-complaints-home',
  templateUrl: './complaints-home.component.html',
  styleUrls: ['./complaints-home.component.css'],
})
export class ComplaintsHomeComponent implements OnInit {

  public complaints = {} as IComplaint[];
  public myComplaints = {} as IComplaint[];
  public userid: string;
  public complaintstatusColor: string[] = [];
  public myComplaintstatusColor: string[] = [];
  public reportedTime: string[] = [];
  public myComplaintsFlag: boolean;
  public complaintsFlag: boolean;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.complaints = [];
    this.myComplaints = [];
    /* Get profile if the user is logged in */
    if (this.dataService.isLoggedIn()) {
      this.getUser();
    }
    /* Set title */
    this.dataService.setTitle('Complaints & Suggestions');
    this.refresh();

    /* Get all the complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.Complaints).subscribe(result => {
      this.complaints = result;
      if (this.complaints.length === 0) {
        this.complaintsFlag = true;
      }
      let i = 0;
      result.forEach(element => {
        this.reportedTime[i] = moment(element.report_date).format('MMMM Do YYYY');
        i = i+1;
        if (element.status.toLowerCase() === 'reported') {
          this.complaintstatusColor.push('red');
        }
        else if (element.status.toLowerCase() === 'resolved') {
          this.complaintstatusColor.push('green');
        }
        else if (element.status.toLowerCase() === 'in progress') {
          this.complaintstatusColor.push('yellow');
        }
      });
    });
    /* Get the current user complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.MyComplaints).subscribe(result => {
      this.myComplaints = result;
      if (this.myComplaints.length === 0) {
        this.myComplaintsFlag = true;
      }
      result.forEach(element => {
        if (element.status.toLowerCase() === 'reported') {
          this.myComplaintstatusColor.push('red');
        }
        else if (element.status.toLowerCase() === 'resolved') {
          this.myComplaintstatusColor.push('green');
        }
        else if (element.status.toLowerCase() === 'in progress') {
          this.myComplaintstatusColor.push('yellow');
        }
      });
    });
  }

  getUser() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.userid = user.id;
    });
  }

  refresh() {
    /* Get all the complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.Complaints).subscribe(result => {
      this.complaints = result;
    });
    /* Get the current user complaints from server*/
    this.dataService.FireGET<IComplaint[]>(API.MyComplaints).subscribe(result => {
      this.myComplaints = result;
    });
  }

  onClickEvent(event) {
    event.stopPropagation();
 }

  subscribe(complaint_subscribed: number, complaintId: string) {
    this.dataService.FireGET<IComplaint>(API.SubscribeToComplaint,
        { complaintId: complaintId, action: complaint_subscribed === 0 ? 1 : 0 }).subscribe(result => {
          this.refresh();
          console.log(result);
          if (complaint_subscribed === 1) {
            this.snackBar.open('You are unsubscribed from this complaint', 'Dismiss', {
            duration: 2000,
          });
        }
        else {
          this.snackBar.open('You are subscribed to this complaint', 'Dismiss', {
            duration: 2000,
          });
        }
    }, (error) => {
      this.snackBar.open(`Subscription Failed - ${error.message}`, 'Dismiss', {
        duration: 2000,
      });
    });
  }

  upVote(has_upvoted: boolean, complaintId: string) {
    let complaint_upvoted: number;
    if (has_upvoted === true) {
      complaint_upvoted = 1;
    }
    else {
      complaint_upvoted = 0;
    }
    this.dataService.FireGET<IComplaint>(API.UpVote, 
      { complaintId: complaintId, action: complaint_upvoted === 0 ? 1 : 0 })
      .subscribe(result => {
        this.refresh();
        console.log(result);
        if (complaint_upvoted === 1) {
          this.snackBar.open('You have upvoted this complaint', 'Dismiss', {
            duration: 2000,
          });
        }
        else {
          this.snackBar.open('Your upvote has been removed', 'Dismiss', {
            duration: 2000,
          });
        }
    }, (error) => {
      this.snackBar.open(`Upvote Failed - ${error.message}`, 'Dismiss', {
        duration: 2000,
      });
    });
  }
}
