import { Component, OnInit, Input, ChangeDetectorRef, Inject } from '@angular/core';
import { DataService } from '../../../data.service';
import { ICommunityPost, IBody, IInterest, IUserProfile, IEvent, ICommunity } from '../../../interfaces';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClosePopupComponent } from './close-popup/close-popup.component';

import { API } from '../../../../api';
import { ILocation } from 'instimapweb';
import { Router } from '@angular/router';

const DEFAULT_USERNAME = 'Anonymous';
const DEFAULT_PROFILE_PIC = 'assets/useravatar.svg';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  public current_user: IUserProfile = {} as IUserProfile;

  content_border = 'none';
  public networkBusy = false;
  anonymous: boolean = false;

  public images: string[];
  public searchQ: string;
  public searchI: string;
  public users: IUserProfile[];

  public addpost: ICommunityPost = {} as ICommunityPost;
  @Input() bodies = [] as IBody[];
  @Input() interests = [] as IInterest[];
  @Input() location: ILocation;

  public tagged: any[] = [];
  public taggedI: any[] = [];
  public tagged_bodies = [] as IBody[];
  public tagged_events = [] as IEvent[];
  public tagged_users = [] as IUserProfile[];
  public tagged_interests = [] as IInterest[];
  public tag_users: IUserProfile[];
  public tag_events: IEvent[];
  public tag_bodies: IBody[];
  public community: ICommunity;
  public interest = {} as IInterest;


  constructor(
    public dataService: DataService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddPostComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public router: Router,

    @Inject(MAT_DIALOG_DATA) public data: { community: ICommunity, post: ICommunityPost },


  ) {
    this.community = data.community;
    if (data.post) {
      this.addpost = data.post;
      console.log(this.addpost);
      this.images = this.addpost.image_url;
      this.tagged = [...this.addpost.tag_body, ...this.addpost.tag_user]
      this.tagged_interests = this.addpost.interests;

    }
  }

  ngOnInit(): void {
    console.log(this.addpost);

    // this.dataService.setTitle("Create post")
    // this.populateDummyData();
    this.getUser();
    this.images = [];
    if (!this.data.post) {
      this.addpost = {
        reactions_count: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
        comments_count: 0,
        thread_rank: 1,
        posted_by: this.current_user,
        community: this.community,
        parent: null,
        image_url: [],
      } as ICommunityPost;
    }
  }

  getUser() {
    this.current_user.name = DEFAULT_USERNAME;
    this.current_user.profile_pic = DEFAULT_PROFILE_PIC;

    this.dataService.GetFillCurrentUser().subscribe(user => {
      // this.userName = user.name;
      // this.ldap = user.roll_no;
      // this.profilePic = user.profile_pic;

      this.current_user = user;
    });
  }



  search(query: string,): void {
    if (query.length >= 3) {
      this.dataService.FireGET<any>(API.Search, { query: query }).subscribe(result => {
        /* Check if the search query changed in the meanwhile */
        if (this.searchQ !== query) { return; }

        /* Update all data */
        this.tag_bodies = result.bodies;
        this.tag_users = result.users;
        this.tag_events = result.events;
      });
    }
  }


  setInterest(event: any): void {

    this.interest = {} as IInterest;
    if (event.option) {
      console.log(event.option.value.title)
      this.interest.title = event.option.value.title;
      this.interest.id = event.option.value.id;

      console.log(this.interest.title)

      if (this.searchTagInTaggedI(this.interest) === -1) {
        console.log("pushing");

        this.tagged_interests.push(this.interest);
      }
    }

  }

  addTag(taggable: any, name: string, type: string) {
    let tag_to_push = {
      id: taggable.id,
      name: name,
      data: taggable,
      type: type,
    };
    if (type === "body") {
      if (this.searchTagInTagged(tag_to_push) === -1) {
        this.tagged_bodies.push(taggable);
      }
    }
    if (type === "user") {
      if (this.searchTagInTagged(tag_to_push) === -1) {
        this.tagged_users.push(taggable);
      }
    }

    if (this.searchTagInTagged(tag_to_push) === -1)
      this.tagged.push(tag_to_push);
  }
  removeTag(target_tag: any) {
    let target_index = this.searchTagInTaggedI(target_tag);

    if (target_index !== -1) this.tagged_interests.splice(target_index, 1);
  }

  removeImage(target_image: string) {
    let target_index = this.searchImageInImages(target_image);

    if (target_index !== -1) {
      this.addpost.image_url.splice(target_index, 1);
      this.images.splice(target_index, 1);
    }
    console.log(this.images);
    console.log(this.addpost.image_url);

  }
  searchImageInImages(target_image: string) {
    let target_index = -1;
    for (let i = 0; i < this.images.length; i++) {
      if (target_image === this.images[i]) target_index = i;
    }

    return target_index;
  }
  searchTagInTagged(tag: any): number {
    let target_index = -1;
    for (let i = 0; i < this.tagged.length; i++) {
      if (tag.id === this.tagged[i].id && tag.type === this.tagged[i].type) target_index = i;
    }

    return target_index;
  }
  searchTagInTaggedI(tag: any): number {
    let target_index = -1;
    for (let i = 0; i < this.tagged_interests.length; i++) {
      if (tag.id === this.tagged_interests[i].id) target_index = i;
    }

    return target_index;
  }
  clearTagInput() {
    this.searchQ = "";
  }

  /** Tries to mark the network as busy */
  MarkNetworkBusy(): Boolean {
    if (this.networkBusy) { return false; }
    this.networkBusy = true;
    return true;
  }

  toggleAnon(){
   this.anonymous = !this.anonymous;
  }

  uploadImage(files: FileList) {
    if (!this.MarkNetworkBusy()) { return; }

    this.dataService.UploadImage(files[0]).subscribe(result => {


      // result.picture
      this.addpost.image_url.push(result.picture);
      this.images.push(result.picture);
      this.networkBusy = false;


    }, (error) => {
      this.networkBusy = false;
      this.snackBar.open(`Upload Failed - ${error.message}`, 'Dismiss', {
        duration: 2000,


      });
      console.log("nhi ho paya");
    });
  }




  onPost() {
    this.populateNewPostData();
    if(this.anonymous) this.addpost.posted_by.anonymous = true;

    this.addpost.tag_body = this.tagged_bodies;
    this.addpost.tag_user = this.tagged_users;

    console.log(this.addpost.image_url);
    console.log(this.addpost);

    this.addpost.interests = this.tagged_interests;

    console.log(this.addpost);
    if (!this.data.post) {
      this.dataService.FirePOST<ICommunityPost>(API.CommunityAddPost, this.addpost).subscribe(() => {
        this.addpost = {} as ICommunityPost;
      });
    } else {
      this.dataService.FirePUT<ICommunityPost>(API.CommunityPost, this.addpost, { uuid: this.addpost.id }).subscribe(() => {
        this.addpost = {} as ICommunityPost;
      });
    }

    this.dialogRef.close();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "30%";
    dialogConfig.height = "20%";
    dialogConfig.position = { top: '200px' };
    dialogConfig.panelClass = 'custom-container';
    this.dialog.open(ClosePopupComponent, dialogConfig);
  }
  populateNewPostData(): void {
    this.addpost.time_of_creation = new Date();
    this.addpost.time_of_modification = this.addpost.time_of_creation;
    this.addpost.user_reaction = -1;
    this.addpost.status = 0;

  }

}
