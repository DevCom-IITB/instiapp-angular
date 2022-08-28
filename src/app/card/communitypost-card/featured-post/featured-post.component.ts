import { Component, Input, OnInit } from '@angular/core';
import { ICommunityPost } from '../../../interfaces';

@Component({
  selector: 'app-featured-post',
  templateUrl: './featured-post.component.html',
  styleUrls: ['./featured-post.component.css']
})
export class FeaturedPostComponent implements OnInit {

  @Input() public post: ICommunityPost;

  public render_images: boolean;
  public printable_date: string;

  constructor() { }

  ngOnInit(): void {
    this.setDefaults();
  }

  setDefaults(): void{
    this.printable_date = new Date(this.post.time_of_creation).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (this.post.image_url !== undefined && this.post.image_url !== null)
      this.render_images = (this.post.image_url.length > 0);
    else
      this.render_images = false;
  }

}
