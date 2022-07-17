import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { ICommunityPost, IBody, IInterest, IUserProfile, IEvent } from '../../../interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClosePopupComponent } from './close-popup/close-popup.component';
import { API } from '../../../../api';
import { ILocation } from 'instimapweb';

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

  public images: string[];
  public searchQ: string;
  public users: IUserProfile[];
  
  public addpost: ICommunityPost = {} as ICommunityPost;
  @Input() bodies = [] as IBody[];
  @Input() interests = [] as IInterest[];
  @Input() location: ILocation;
  
  public tagged: any[] = [];
  public tag_users: IUserProfile[];
  public tag_events: IEvent[];
  public tag_bodies: IBody[];

  
  constructor(
    public dataService: DataService,
    private dialog : MatDialog,
    public dialogRef : MatDialogRef<AddPostComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,

    
  ) { }

  ngOnInit(): void {
    // this.dataService.setTitle("Create post")
    // this.populateDummyData();
    this.getUser();
    
    
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
    } as ICommunityPost;
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

  populateDummyData(): void{
    this.tagged = new Array<String>();

    // this.tagged.push("ISHA");
    // this.tagged.push("GSCA");
    // this.tagged.push("EESA");
    // this.tagged.push("DevCom");

    this.images = new Array<string>();
    if(this.addpost.image_url){
      // this.images.push("this.addpost.image_url")
      Array.prototype.push.apply(this.images, this.addpost.image_url.split(","));
    }
  }

  search(query: string,): void {
    if(query.length >= 3){
      this.dataService.FireGET<any>(API.Search, {query: query}).subscribe(result => {
        /* Check if the search query changed in the meanwhile */
        if (this.searchQ !== query) { return; }

        /* Update all data */
        this.tag_bodies = result.bodies;
        this.tag_users = result.users;
        this.tag_events = result.events;
      });
    }
  }

  addTag(taggable: any, name: string, type: string){
    let tag_to_push = {
      id: taggable.id,
      name: name,
      data: taggable,
      type: type,
    };

    if(this.searchTagInTagged(tag_to_push) === -1)
      this.tagged.push(tag_to_push);
  }
  removeTag(target_tag: any){
    let target_index = this.searchTagInTagged(target_tag); 

    if(target_index !== -1) this.tagged.splice(target_index,1);
  }
  searchTagInTagged(tag: any): number{
    let target_index = -1;
    for(let i=0; i<this.tagged.length; i++){
      if(tag.id === this.tagged[i].id && tag.type === this.tagged[i].type) target_index = i;
    }

    return target_index;
  }
  clearTagInput(){
    this.searchQ="";
  }


  /** Get bodies after filter */
  getBodies() {
   { return this.bodies; }
  }

  /** Get people after filter */
  getPeople() {
   { return this.users; }
  }

   /** Tries to mark the network as busy */
   MarkNetworkBusy(): Boolean {
    if (this.networkBusy) { return false; }
    this.networkBusy = true;
    return true;
  }

  getImageUrl() {
    if (this.addpost && this.addpost.image_url && this.addpost.image_url !== '') {
      return this.addpost.image_url;
    } 
  }


  uploadImage(files: FileList) {
    if (!this.MarkNetworkBusy()) { return; }

    this.dataService.UploadImage(files[0]).subscribe(result => {
      this.addpost.image_url = result.picture;
      this.networkBusy = false;

    }, (error) => {
      this.networkBusy = false;
      this.snackBar.open(`Upload Failed - ${error.message}`, 'Dismiss', {
        duration: 2000,
      });
    });
  }




  onPost(){
    this.populateNewPostData();

    this.dataService.FirePOST<ICommunityPost>(API.CommunityAddPost, this.addpost).subscribe(() => {
      this.addpost = {} as ICommunityPost;
    });

    this.dialogRef.close();
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "30%";
    dialogConfig.height = "20%";
    dialogConfig.position = {top:'200px' };
    dialogConfig.panelClass= 'custom-container';
    this.dialog.open(ClosePopupComponent, dialogConfig);
  }
  populateNewPostData(): void{
    this.addpost.time_of_creation = new Date();
    this.addpost.time_of_modification = this.addpost.time_of_creation;
    this.addpost.user_reaction = -1;
    this.addpost.status = 0;
  }

}
