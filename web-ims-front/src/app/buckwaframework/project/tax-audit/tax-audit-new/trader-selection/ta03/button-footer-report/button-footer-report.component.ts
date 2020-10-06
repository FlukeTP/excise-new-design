import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-button-footer-report',
  templateUrl: './button-footer-report.component.html',
  styleUrls: ['./button-footer-report.component.css']
})
export class ButtonFooterReportComponent implements OnInit {

  @Input() saveActive: boolean = false;

  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() save2: EventEmitter<any> = new EventEmitter();
  @Output() clear: EventEmitter<any> = new EventEmitter();
  @Output() export: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onSave() {
    this.save.emit(true);
  }
  onSave2() {
    this.save2.emit(true);
  }
  onClear() {
    this.clear.emit(true);
  }
  onExport() {
    this.export.emit(true);
  }

}
