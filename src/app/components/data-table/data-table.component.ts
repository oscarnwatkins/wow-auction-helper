import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ColumnDescription } from '../../models/column-description';

@Component({
  selector: 'wah-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input() columns: Array<ColumnDescription>;
  @Input() data: Array<any>;
  pageEvent: PageEvent;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(change) {
    if (change && change.data) {
      // this.pageEvent.length = change.data.currentValue.length;
    }
  }

  getFromValue(): number {
    if (!this.pageEvent || !this.pageEvent.pageSize) {
      return 0;
    }
    return (this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1)) - this.pageEvent.pageSize;
  }

  getToValue(): number {
    if (!this.pageEvent || !this.pageEvent.pageSize) {
      return 10;
    }
    return this.pageEvent.pageSize * (this.pageEvent.pageIndex + 1);
  }
}