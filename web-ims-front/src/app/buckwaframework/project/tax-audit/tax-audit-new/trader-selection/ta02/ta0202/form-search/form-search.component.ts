import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from 'helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.css']
})
export class FormSearchComponent implements OnInit {

  @Input() header: string = 'Header';
  @Input() formSearch: FormGroup;
  @Output() search: EventEmitter<FormGroup> = new EventEmitter();
  @Output() clear: EventEmitter<boolean> = new EventEmitter();
  @Output() uploadTemplate: EventEmitter<boolean> = new EventEmitter();
  @Input() linkPageBack: string = '/tax-audit-new/ta02/02/01'

  formGroup: FormGroup;
  checkSearchFlag: boolean = false;
  newRegId: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

    })

    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calendar()
    }, 200);

  }

  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          startDate: text
        })
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          endDate: text
        })
      }
    });
  }

  onSearch() {
    this.checkSearchFlag = true;
    this.search.emit(this.formGroup.value);
  }

  onUploadTemplate() {
    this.uploadTemplate.emit(true);
  }

  onClear = () => {
    this.checkSearchFlag = false;
    this.formGroup.reset()
    console.log(this.formGroup.value);
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.clear.emit(true);

  }
  onBackPages = () => {
    this.router.navigate(["/tax-audit-new/ta02/02/01"], {
      queryParams: {
        newRegId: this.newRegId
      }
    });
  }

  invalidSearchFormControl(control: string) {
    return this.formGroup.get(control).invalid && (this.formGroup.get(control).touched || this.checkSearchFlag);
  }

}
