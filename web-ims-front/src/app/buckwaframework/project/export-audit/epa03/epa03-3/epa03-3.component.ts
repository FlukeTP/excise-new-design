import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-epa03-3',
  templateUrl: './epa03-3.component.html',
  styleUrls: ['./epa03-3.component.css']
})
export class Epa033Component implements OnInit {

  exciseId: string = "";
  exciseName: string = "";
  searchFlag: string = "FALSE";
  
  constructor(
    private authService: AuthService,
    private ajaxService: AjaxService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('EXP-03300');
    this.searchFlag = this.route.snapshot.queryParams["searchFlag"];
  }

  onClickBack() {
    this.router.navigate(["/epa03/2"], {
      queryParams: {
        exciseId: this.exciseId,
        exciseName: this.exciseName,
        searchFlag: "TRUE"
      }
    });
  }

}
