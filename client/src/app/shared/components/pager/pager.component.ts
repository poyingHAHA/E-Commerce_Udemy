import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

  @Input() totalCount: number;
  @Input() pageSize: number;
  @Output() pageChanged = new EventEmitter<number>(); // and then we can specify the type of thing that we're going to omit from this particular event. And it's gonna be a number

  constructor() { }

  ngOnInit(): void {
  }

  onPagerChange(event: any){
    this.pageChanged.emit(event.page)
  }

}
