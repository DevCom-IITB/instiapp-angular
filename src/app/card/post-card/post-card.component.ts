import { Component, OnInit, Input } from '@angular/core';
import { ICommunityPost } from '../../interfaces';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: ICommunityPost;
  constructor(
    public dataService: DataService,) {

  }

  ngOnInit(): void {
  }

}