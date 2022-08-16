
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { API } from '../../../api';
import { environment } from '../../../environments/environment';
import { DataService } from '../../data.service';
import { Helpers } from '../../helpers';
import { ICommunityPost, IUserProfile } from '../../interfaces';
import { AddPostComponent } from '../../page/discussions/add-post/add-post.component';

@Component({
  selector: 'app-communitypost-card',
  templateUrl: './communitypost-card.component.html',
  styleUrls: ['./communitypost-card.component.css']
})
export class CommunityPostCardComponent implements OnInit {

  @Input() public post: ICommunityPost;
  @Input() public show_comment_thread: boolean;
  @Input() public ghost: boolean;
  @Input() public featured: boolean;
  @Input() public is_moderator: boolean;

  public current_user: IUserProfile = {} as IUserProfile;


  /**
   * status codes mapping
   * 0: Pending Approval
   * 1: Approved
   * 2: Rejected
   * 3: Reported
   * 4: Hidden
   */


  public printable_date: String;
  public num_reactions: number = 0;
  public is_pending: boolean;
  public addComment: ICommunityPost = {} as ICommunityPost;

  public add_image_url = "assets/emojis/add_reaction.svg";
  public pic_offset: number;
  public name_offset: number;

  public post_border_radius: number;

  public is_rank_one: boolean;
  public render_images: boolean;

  public show_comment_input: boolean;
  public more_comments: boolean;
  public user_rxn_type: string;

  public posted_by_current_user: boolean;

  public content: string;

  public all_reactions = [
    { id: 0, link: 'assets/emojis/like.png', 'i': 'thumbsup' },
    { id: 1, link: 'assets/emojis/loveeye_emoji.png', 'i': 'heart' },
    { id: 2, link: 'assets/emojis/laugh_emoji.png', 'i': 'laughing' },
    { id: 3, link: 'assets/emojis/wow_emoji.png', 'i': 'open_mouth' },
    { id: 4, link: 'assets/emojis/sad_emoji.png', 'i': 'disappointed' },
    { id: 5, link: 'assets/emojis/angry_emoji.png', 'i': 'angry' },
  ]


  constructor(
    public dataService: DataService,
    public _router: Router,
    private dialog: MatDialog,

    public changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.initialiseVariables();

    // console.log(this.is_moderator);



    if (!this.is_rank_one && this.post.comments_count > 0 && this.post.comments.length <= 0) {
      this.loadMoreComments();
    }
  }


  initialiseVariables() {
    this.printable_date = new Date(this.post.time_of_creation).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    this.user_rxn_type = this.post.user_reaction !== -1 ? this.all_reactions[this.post.user_reaction].link : null;
    this.is_pending = this.post.status == 0;
    this.posted_by_current_user = false;
    let cur_user = this.dataService.getCurrentUser();
    if (cur_user !== undefined)
      this.posted_by_current_user = (this.dataService.getCurrentUser().id === this.post.posted_by.id);

    if (this.post.reactions_count == null) this.post.reactions_count = [0, 0, 0, 0, 0, 0]; // Maybe a different default is preferred?
    if (this.post.status === undefined) this.post.status = 1;

    if (this.show_comment_thread === undefined)
      this.show_comment_thread = false;

    if (this.ghost === undefined)
      this.ghost = false;

    if (this.featured === undefined)
      this.featured = false;

    // this.is_moderator = false;

    // this.is_moderator=true;
    // this.post.status=4;


    if (this.post.content.startsWith("dfgvfdbdb")) {
      console.log("Deleted")
      console.log(this.post.deleted);
    }

    // console.log(this.is_moderator);
    // this.num_reactions += this.post.reactions_count.reduce((a,b)=>a+b,0)
    this.num_reactions = this.post.reactions_count[0] + this.post.reactions_count[1] + this.post.reactions_count[2] + this.post.reactions_count[3] + this.post.reactions_count[4] + this.post.reactions_count[5];
    // console.log(this.post.thread_rank);

    this.is_rank_one = (this.post.thread_rank == 1);

    if (this.post.comments === undefined) this.post.comments = [];

    this.more_comments = (this.post.comments.length < this.post.comments_count);

    this.pic_offset = this.is_rank_one ? 0 : -46;
    this.name_offset = this.is_rank_one ? 0 : -38;
    this.post_border_radius = this.is_rank_one ? 15 : 0;

    // this.render_images = false;
    if (this.post.image_url !== undefined && this.post.image_url !== null)
      this.render_images = (this.post.image_url.length > 0);
    else
      this.render_images = false;

    this.show_comment_input = this.is_rank_one && this.show_comment_thread;


    // this.post.status = 2; //FIXIT: Remove this line after testing
    // console.log(`${this.post.thread_rank} rank: ${this.post.comments_count} comments`)
  }

  onViewMoreClicked(): void {
    this.loadMoreComments();
  }

  onGhostClicked(): void {
    this.show_comment_thread = true;
    this.loadMoreComments();

  }

  onAddReactionClicked(): void { //TODO: Implement this
    console.log(`add reaction button clicked`)
  }
  onReactionClicked(reaction_index: number): void { //TODO: Implement this
    console.log(`reaction with index ${reaction_index} clicked`)
    console.log("this.post.user_reactions" + this.post.user_reaction);
    console.log("reaction_index" + reaction_index);

    if (this.post.user_reaction != reaction_index) {
      this.user_rxn_type = this.all_reactions[reaction_index].link;
      if (this.post.user_reaction == -1) {
        this.num_reactions++
      }
      this.dataService.FireGET(API.CommunityPostReaction, { uuid: this.post.id, reaction: reaction_index }).subscribe(
        () => {
          console.log(`reaction with index ${reaction_index} successfully marked`);
          if (this.post.user_reaction != null) {

            this.post.reactions_count[this.post.user_reaction]--;
          }
          this.post.user_reaction = reaction_index;
          this.post.reactions_count[reaction_index]++;

        },
        error => {
          console.log(`reaction with index ${reaction_index} log failed: ${error}`);
        }
      );
    } else {
      this.user_rxn_type = null;
      this.num_reactions--;
      this.dataService.FireGET(API.CommunityPostReaction, { uuid: this.post.id, reaction: -1 }).subscribe(
        () => {
          console.log(`reaction with index ${reaction_index} successfully UNmarked`)

          this.post.reactions_count[this.post.user_reaction]--;
          this.post.user_reaction = -1;
        },
        error => {
          console.log(`reaction with index ${reaction_index} log failed: ${error}`);
        }
      )
    }
  }

  onCommentButtonClicked(): void {
    this.show_comment_input = !this.show_comment_input;
    this.show_comment_thread = this.show_comment_input;

    if (this.show_comment_thread && this.more_comments && this.post.comments.length == 0) {
      this.loadMoreComments();
    }
  }
  loadMoreComments(): void {
    if (!this.more_comments || this.ghost) return;

    this.dataService.fillGetPost(this.post.id).subscribe(result => {
      this.post = result;
      this.more_comments = (this.post.comments.length < this.post.comments_count);
    })
    // this.loadDummyComments();
  }

  onReplyClicked(): void {
    this.show_comment_input = !this.show_comment_input;
  }

  onShareClicked(): void {
    Helpers.NativeShare(`Post by ${this.post.posted_by.name}`, `Check out this post by ${this.post.posted_by.name} at InstiApp!`, this.getPostUrl());
  }

  onFeaturePinClicked(): void {
    this.dataService.FirePUT<any>(API.CommunityModerationAction, { is_featured: !this.post.featured }, { action: 'feature', uuid: this.post.id }).subscribe(res => {
      // console.log(res.is_featured);
      this.post.featured = res.is_featured;
    }, error => {
      console.log(error);

    });
  }
  onEditClicked(): void {//TODO: Implement this
    // console.log(`current user posted: ${this.posted_by_current_user}; edit post clicked`);
    if (this.posted_by_current_user) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.width = "80%";
      dialogConfig.height = "80%";
      dialogConfig.panelClass = 'custom-container';
      dialogConfig.data = { community: this.post.community, post: this.post };
      this.dialog.open(AddPostComponent, dialogConfig);
    }
  }
  onDeleteClicked(): void {//TODO: Implement this (not done right now because I don't wanna accidentally delete a post made with so much of hardwork :( ) anytime
    // console.log(`current user posted: ${this.posted_by_current_user}; user is moderator: ${this.is_moderator}; delete post clicked`);

    if (this.posted_by_current_user || this.is_moderator) {
      this.dataService.FirePUT<any>(API.CommunityModerationAction, {}, { action: 'delete', uuid: this.post.id }).subscribe(res => {
        console.log(res);
      }, error => {
        console.log(error);

      });
    }
  }

  getPostUrl(): string {
    return `${environment.host}view-post/${this.post.str_id}`;
  }

  // Dummy data generating code below this point: REMOVE on production


  onApproveClicked() {
    this.post.status = 1;
    // this.dataService.FirePUT(API.CommunityModeration, { uuid: this.post.id, status: 1 }).subscribe();
    this.dataService.FirePUT(API.CommunityModeration, { status: 1 }, { uuid: this.post.id }).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);

    });
  }
  onRejectClicked() {
    this.post.status = 2;
    this.dataService.FirePUT(API.CommunityModeration, { status: 2 }, { uuid: this.post.id }).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);

    });
  }


  onCommentSubmit() {
    //add new comment to the post

    this.addComment = {
      reactions_count: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      comments_count: 0,
      thread_rank: this.post.thread_rank + 1,
      posted_by: this.dataService.getCurrentUser(),
      community: this.post.community,
      parent: this.post.id,
      content: this.content,
      status: 1,

      time_of_creation: new Date()
    } as ICommunityPost;

    if (this.addComment.content != "") {

      this.dataService.FirePOST<ICommunityPost>(API.CommunityAddPost, this.addComment).subscribe((result) => {
        this.post.comments.unshift(result);
        this.post.comments_count++;
        this.addComment = {} as ICommunityPost;
      });
      // this.post.comments_count++;
      // this.post.comments.push(this.addComment);
      // this.changeDetectorRef.detectChanges();

      this.content = "";

    }

  }




}
