import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sort-direction',
  templateUrl: './sort-direction.component.html',
  styleUrls: ['./sort-direction.component.scss']
})
export class SortDirectionComponent implements OnInit {

  @Input() filed: string;
  @Input() headers: number[];
  @Input() headerIndex: number;
  @Output() onClickEvent = new EventEmitter<{field: string, direction: number}>();

  constructor() { }

  ngOnInit() {

  }

  onClick() {
    const dir = this.headers[this.headerIndex];
    for(let i = 0; i < this.headers.length; i++) {
      this.headers[i] = 0;
    }
    switch (dir) {
      case -1: {
        this.headers[this.headerIndex] = 1;
        break;
      }
      case 0: {
        this.headers[this.headerIndex] = 1;
        break;
      }
      case 1: {
        this.headers[this.headerIndex] = -1;
        break;
      }
    }

    this.onClickEvent.emit({field: this.filed, direction: this.headers[this.headerIndex]});
  }
}
