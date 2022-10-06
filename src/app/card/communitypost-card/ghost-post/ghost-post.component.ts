import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ghost-post',
  templateUrl: './ghost-post.component.html',
  styleUrls: ['./ghost-post.component.css'],
})
export class GhostPostComponent implements OnInit {
  @Input() public post_content: string;
  @Input() public poster_pic_path: string;

  constructor() {}

  ngOnInit(): void {}
}
