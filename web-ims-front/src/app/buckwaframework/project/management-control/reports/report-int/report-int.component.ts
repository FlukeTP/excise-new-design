import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from '../../../../common/helper/datepicker';
import { AuthService } from 'services/auth.service';

declare var $: any;
@Component({
  selector: 'app-report-int',
  templateUrl: './report-int.component.html',
  styleUrls: ['./report-int.component.css']
})
export class ReportIntComponent implements OnInit {

  year: any;
  toggled: boolean;

  constructor( private authService: AuthService) { }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('REP-04010');

    // calendar
    $('#year').calendar({
      maxDate: new Date(),
      type: 'year',
      text: TextDateTH,
      formatter: formatter('year')
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.year = e.target.year.value;
    e.target.year.value = '';
    this.toggled = true;
  }

  onCancel() {
    this.toggled = false;
  }

}
