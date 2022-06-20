import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../../data.service';
import { IGroup, IPost, IUserProfile } from '../../../interfaces';

@Component({
  selector: 'app-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.css']
})
export class GroupFeedComponent implements OnInit {
  @Input() public groupId: number = -1;
  @Input() public group: IGroup;

  public posts: IPost[];

  private dummyContent: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.setInitialized();

    
    if (this.groupId == -1){
      this.activatedRoute.params.subscribe((params:Params)=>{
        this.groupId = params['id'];
        this.refresh()
      })
    }
    this.dataService.setTitle(`Group ${this.groupId} Feed`)
    
    this.loadDummyGroupData();
    this.loadDummyPosts();    
  }

  loadDummyGroupData(): void{
    const dum_group: IGroup = {
      id:1,
      title:'Insight Discussion Forum',
      body: '4000 Following',
      created_by:undefined,
      image_url: './assets/icons/apple-icon.png'
    }

    this.group = dum_group;
  }
  loadDummyPosts(): void{
    // const dum_user = {
    //   name:"Dheer Banker",
    // } as IUserProfile;

    const dum_user = {
      name: "Dheer Banker",
    } as IUserProfile;

    const dum_post: IPost = {
      id:"p6Af92I",
      author: dum_user,
      post_date: new Date("2022-06-23"),
      content: this.dummyContent,
    }

    this.posts = new Array<IPost>();
    for(let i=0; i<20;i++){
      // this.posts.push(dum_post);
      this.posts.push({
        id:"p6Af92I",
        author: dum_user,
        post_date: new Date("2022-06-23"),
        content: `A lot of content ${Math.floor(Math.random()*100)}`,
      } as IPost);
    }
  }

  refresh(): void{
    //Add code to request from API all the details required to render the page correctly, in case the component was loaded via a URL
  }

}
