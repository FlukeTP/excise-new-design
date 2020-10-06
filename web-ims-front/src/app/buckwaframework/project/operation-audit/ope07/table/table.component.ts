import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HeaderTable, BodyTable } from './table.model';
import { Utils } from 'helpers/utils';
declare var $: any;
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() headerTable: HeaderTable;
  @Input() bodyTable: BodyTable[];
  @Input() recordTotal: number = 0;
  @Input() datas: any[] = [];

  @Input() enableGraph: boolean = false

  @Output() pageChangeOutput: EventEmitter<RequestStartLength> = new EventEmitter();
  @Output() showGraph: EventEmitter<any> = new EventEmitter();

  lenght: number[] = [10, 25, 50, 100];
  pageLenght: number = 10;

  start: number = 0;
  end: number = 0;

  paginationTotal: number = 0;
  pagination: number;
  recordTotalDesc: string = "";
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $("#pageLenght").dropdown().css('min-width', '3em', 'margin-left', '4px', 'margin-right', '4px');
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.recordTotalDesc = Utils.moneyFormatInt(this.recordTotal)
    console.log('changes ==> ', changes)
    if (changes.bodyTable != undefined && changes.bodyTable.currentValue.lenght != 0) {
      //this.recordTotal = changes.recordTotal.currentValue;
      this.datas = changes.bodyTable.currentValue;
    }

    console.log('this.recordTotal', this.recordTotal)
    this.end = this.start + this.pageLenght;
    this.calculatePagination();

    console.log('this.start', this.start)
    console.log('this.end', this.end)
  }

  onChangePageLenght(e) {
    console.log("onChangePageLenght ==> ", e);
    this.pagination = 1;
    this.pageLenght = Number(e.target.value);
    this.onClickPagination();

  }

  calculatePagination() {
    this.paginationTotal = (this.recordTotal / this.pageLenght);
    let paginationTotalStr = this.paginationTotal.toString();
    this.paginationTotal = (paginationTotalStr.split(".").length > 1 ? Math.trunc(this.paginationTotal) + 1 : this.paginationTotal)
  }

  pageChange(e) {
    console.log('pageChange =>', e)
    this.start = e - this.pageLenght;
    this.pagination = this.start / this.pageLenght + 1;

    this.onClickPagination();
  }
  onClickPagination() {
    if (this.datas.length == 0) {
      this.end = 0;
      this.start = 0;

    } else {
      this.start = (this.pageLenght * this.pagination) - this.pageLenght;
      this.end = (this.pageLenght * this.pagination) >= this.recordTotal ? this.recordTotal : (this.pageLenght * this.pagination);
    }
    this.pageChangeOutput.emit({
      start: this.start,
      length: this.pageLenght
    });

    this.end = this.start + this.pageLenght;
  }

  graphOnClick(idxArr) {
    this.showGraph.emit({ idxArr: idxArr })
  }
}
interface RequestStartLength {
  start: number;
  length: number;
}