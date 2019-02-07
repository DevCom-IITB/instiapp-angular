import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IComplaint, IComplaintComment, IPostComment } from '../../interfaces';
import { DataService } from '../../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../../api';
import * as moment from 'moment';


@Component({
  selector: 'app-detailed-complaint',
  templateUrl: './detailed-complaint.component.html',
  styleUrls: ['./detailed-complaint.component.css']
})
export class DetailedComplaintComponent implements OnInit {
  detailedComplaint: IComplaint;
  public complaintId: string;
  public comment: IPostComment;
  public userid: string;
  public SubscribeToComplaint: string;
  public statusColor: string;
  public complaintReportedTime: string;
  public selectedindex = 0;

  constructor(public dataService: DataService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    ) {}

  ngOnInit() {
    this.comment = {} as IPostComment;
    /* Get profile if the user is logged in */
    if (this.dataService.isLoggedIn()) {
      this.getUser();
    }
    this.dataService.setTitle('Complaints/Suggestions');
    this.activatedRoute.params.subscribe((params: Params) => {
      this.complaintId = params['id'];
      this.refresh();
    });
  }

  getUser() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.userid = user.id;
    });
  }

  /** Loads the data */
  refresh() {
    if (this.complaintId) {
      this.dataService.FireGET<IComplaint>(API.Complaint, { complaintId: this.complaintId }).subscribe(result => {
        this.detailedComplaint = result;
        console.log(this.detailedComplaint);
      this.complaintReportedTime = moment(this.detailedComplaint.report_date).format('MMMM Do YYYY');
        if (this.detailedComplaint.status === 'Reported') {
          this.statusColor = 'red';
        } else if (this.detailedComplaint.status === 'Resolved') {
          this.statusColor = 'green';
        } else if (this.detailedComplaint.status === 'In progress') {
          this.statusColor = 'yellow';
        }
      }, (error) => {
        if (error.status === 404) {
          alert('Complaint not found');
        }
      });
    }
  }

  selectImage(index: number) {
    this.selectedindex = index;
  }

  postComment() {
    console.log(this.comment.text);
    console.log(this.comment);
    this.dataService.FirePOST<IComplaintComment>(API.CommentPost,
      this.comment, { complaintId: this.detailedComplaint.id }).subscribe(result => {
        this.refresh();
        console.log(result);
        this.comment.text = '';
    });
  }

  upVoteComplaint(has_upvoted: boolean) {
    let complaint_upvoted: number;
    if (has_upvoted === true) {
      complaint_upvoted = 1;
    }
    else {
      complaint_upvoted = 0;
    }
    this.dataService.FireGET<IComplaint>(API.UpVote,
      { complaintId: this.detailedComplaint.id, action: complaint_upvoted === 0 ? 1 : 0 })
      .subscribe(result => {
        this.refresh();
        console.log(result);
        if (complaint_upvoted === 1) {
          this.snackBar.open('Your upvote has been removed', 'Dismiss', {
            duration: 2000,
          });
        }
        else {
          this.snackBar.open('You have upvoted this complaint', 'Dismiss', {
            duration: 2000,
          });
        }
    }, (error) => {
      this.snackBar.open(`Upvote Removal Failed - ${error.message}`, 'Dismiss', {
        duration: 2000,
      });
    });
  }

  subscribe(complaint_subscribed: number) {
    this.dataService.FireGET<IComplaint>(API.SubscribeToComplaint,
      { complaintId: this.detailedComplaint.id, action: complaint_subscribed === 0 ? 1 : 0 })
      .subscribe(result => {
        this.refresh();
        console.log(result);
        if (complaint_subscribed === 1) {
          this.snackBar.open('You are unsubscribed from this complaint', 'Dismiss', {
            duration: 2000,
          });
        } else {
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
}


