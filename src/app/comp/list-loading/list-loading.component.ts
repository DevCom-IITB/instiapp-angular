import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-list-loading',
    templateUrl: './list-loading.component.html',
    standalone: false
})
export class ListLoadingComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    document.getElementById('instiapp-global-spinner').classList.add('list-spinner');
  }

  ngOnDestroy() {
    document.getElementById('instiapp-global-spinner').classList.remove('list-spinner');
  }
}
