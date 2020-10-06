import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-epa02-6',
  templateUrl: './epa02-6.component.html'
})
export class Epa026Component implements OnInit {

  private hdrId: string;
  private dtlId: string;
  taxStampNo: string = "";
  factoryStampNo: string = "";
  leftformVo: INV_HDR;
  rightformVo: INV_HDR;

  constructor(
    private authService: AuthService,
    private ajaxService: AjaxService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('EXP-02600');

    // hdrId=1;dtlId=1

    this.route.paramMap.subscribe(v => {
      this.hdrId = v.get("hdrId");
      this.dtlId = v.get("dtlId");
    });

    this.leftformVo = {
      checkingResult: "N",
      checkPointDest: "",
      dateOut: "",
      exciseDest: "",
      exciseSrc: "",
      exportName: "",
      goodsNum: "",
      invType: "",
      productName: "",
      refNo: "",
      remark: "",
      route: "",
      transportName: ""
    };

    this.rightformVo = {
      checkingResult: "N",
      checkPointDest: "",
      dateOut: "",
      exciseDest: "",
      exciseSrc: "",
      exportName: "",
      goodsNum: "",
      invType: "",
      productName: "",
      refNo: "",
      remark: "",
      route: "",
      transportName: ""
    }

    this.ajax.post("epa/epa021/getInvDetailReport", { hdrId: this.hdrId, dtlId: this.dtlId }, (res) => {
      let data = res.json();
      console.log(data);

     
      this.leftformVo.exportName = data.leftFrom.exportName;
      this.leftformVo.exciseSrc = data.leftFrom.checkPointDest;
      this.leftformVo.checkPointDest = data.leftFrom.checkPointDest;
      this.leftformVo.exciseDest = data.leftFrom.checkPointDest;
      this.leftformVo.dateOut = data.leftFrom.dateOut;

      this.leftformVo.productName = data.leftFrom.productName;
      this.leftformVo.goodsNum = data.leftFrom.goodsNum;
      this.leftformVo.transportName = data.leftFrom.transportName;
      this.leftformVo.route = data.leftFrom.route;


      this.rightformVo.exportName = data.rightForm.exportName;
      this.rightformVo.exciseSrc = data.rightForm.checkPointDest;
      this.rightformVo.checkPointDest = data.rightForm.checkPointDest;
      this.rightformVo.exciseDest = data.rightForm.checkPointDest;
      this.rightformVo.dateOut = data.rightForm.dateOut;

      this.rightformVo.productName = data.rightForm.productName;
      this.rightformVo.goodsNum = data.rightForm.goodsNum;
      this.rightformVo.transportName = data.rightForm.transportName;
      this.rightformVo.route = data.rightForm.route;

      this.leftformVo.remark = data.rightForm.remark;
      this.leftformVo.checkingResult = data.rightForm.checkingResult;



    });



  }

  ngAfterViewInit(): void {
  }


  onClickBack(){
    // /epa01/2;viewId=1
    this.router.navigate(["/epa02/5", {viewId: this.hdrId }])
  }


}


interface INV_HDR {
  exportName: string,
  exciseSrc: string,
  checkPointDest: string,
  exciseDest: string,
  dateOut: string,
  productName: string,
  goodsNum: string,
  transportName: string,
  route: string,
  checkingResult: string,
  remark: string,
  refNo: string,
  invType: string,
}

// rightformVo
