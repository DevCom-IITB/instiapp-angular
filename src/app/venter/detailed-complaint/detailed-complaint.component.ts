import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IComplaint, IComplaintComment, IPostComment } from '../../interfaces';
import { DataService } from '../../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../../api';
import { MatDialog } from '@angular/material';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';
import { VenterDataService } from '../venter-data.service';

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
  public selectedindex = 0;
  public editedComment: IPostComment;

  constructor(public dataService: DataService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    public editCommentDialog: MatDialog,
    public venterDataService: VenterDataService,
  ) { }

  ngOnInit() {
    this.comment = {} as IPostComment;
    this.editedComment = {} as IPostComment;
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
      this.dataService.FireGET<IComplaint>(API.Complaint,
        { complaintId: this.complaintId }).subscribe(result => {
        this.detailedComplaint = result;
        this.venterDataService.getDetailedComplaintInfo(this.detailedComplaint);
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
    this.dataService.FirePOST<IComplaintComment>(API.CommentPost,
      this.comment, { complaintId: this.detailedComplaint.id }).subscribe(() => {
        this.refresh();
        this.comment.text = '';
      });
  }

  onClickEvent(event) {
    event.stopPropagation();
  }

  upVoteComplaint(has_upvoted: boolean) {
    this.venterDataService.upVoteComplaint(has_upvoted, this.detailedComplaint.id);
    this.refresh();
  }

  subscribeToComplaint(complaint_subscribed: number) {
    this.venterDataService.subscribeToComplaint(complaint_subscribed, this.detailedComplaint.id);
    this.refresh();
  }

  deleteComment(commentId: string) {
    this.dataService.FireDELETE<IComplaintComment>(API.CommentEdit,
      { commentId: commentId }).subscribe(() => {
      this.refresh();
      this.venterDataService.getSnackbar('Your comment has been deleted', null);
    }, (error) => {
      this.venterDataService.getSnackbar('Delete Failed', error);
    });
  }

  openDialog(commentId: string, comment: string) {
    const dialogRef = this.editCommentDialog.open(EditCommentComponent, {
      width: '50%',
      data: { commentId: commentId, comment: comment }
    });

    dialogRef.afterClosed().subscribe(result => {
      comment = result;
      this.editComment(commentId, comment);
    });
  }

editComment(commentId: string, comment: string) {
  this.editedComment.text = comment;
  this.dataService.FirePUT<IComplaintComment>(API.CommentEdit,
    this.editedComment, { commentId: commentId }).subscribe(() => {
      this.refresh();
      this.editedComment.text = '';
    });
}
}


