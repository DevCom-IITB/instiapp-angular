import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-ghost-post',
    templateUrl: './ghost-post.component.html',
    styleUrls: ['./ghost-post.component.css'],
    standalone: false
})
export class GhostPostComponent implements OnInit {
  @Input() public post_content: string;
  @Input() public poster_pic_path: string;

  @Input() public pic_offset_px = -46;

  constructor() { }

  ngOnInit(): void {
    this.setDefaults();
  }

  setDefaults(): void {
    if (this.pic_offset_px === undefined) { this.pic_offset_px = -46; }
  }
}
