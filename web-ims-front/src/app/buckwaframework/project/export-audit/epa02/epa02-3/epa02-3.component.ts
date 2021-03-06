import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from '../../../../common/services/';

declare var $: any;

@Component({
  selector: 'app-epa02-3',
  templateUrl: './epa02-3.component.html'
})
export class Epa023Component implements OnInit {

  private hdrId: string;
  private dtlId: string;

  leftformVo: INV_HDR;
  rightformVo: INV_HDR;
  taxStampNo: string = "";
  factoryStampNo: string = "";
  constructor(
    private authService: AuthService,
    private ajaxService: AjaxService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router,
    private messagebar: MessageBarService
  ) { }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('EXP-02300');

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

    this.ajax.post("epa/epa021/getInvDetail", { hdrId: this.hdrId, dtlId: this.dtlId }, (res) => {
      let data = res.json();
      console.log(data);

      this.leftformVo.refNo = data.leftFrom.refNo;
      this.leftformVo.exportName = data.leftFrom.exportName;
      this.leftformVo.exciseSrc = data.leftFrom.checkPointDest;
      this.leftformVo.checkPointDest = data.leftFrom.checkPointDest;
      this.leftformVo.exciseDest = data.leftFrom.checkPointDest;
      this.leftformVo.dateOut = data.leftFrom.dateOut;

      this.leftformVo.productName = data.leftFrom.productName;
      this.leftformVo.goodsNum = data.leftFrom.goodsNum;
      this.leftformVo.transportName = data.leftFrom.transportName;
      this.leftformVo.route = data.leftFrom.route;


      this.rightformVo = Object.assign({}, this.leftformVo);


    });



  }

  ngAfterViewInit(): void {
  }


 onClickSave() {
    let p = {
      hdrId: this.hdrId, dtlId: this.dtlId,

      "leftFrom": this.leftformVo,
      "rightForm": this.rightformVo

    };

    this.messagebar.comfirm((isOk) => {
      if (isOk) {
        this.ajax.post("epa/epa021/saveInv", p, (res) => {
          this.messagebar.successModal("บันทึกข้อมูลทำเสร็จ");
          this.onClickBack();
        }, (error) => {
          this.messagebar.errorModal("ทำรายการไม่สำเร็จ");
        });
      }
    }, "ยืนยันการทำรายการ");

  }

  onClickBack(){
    // /epa01/2;viewId=1
    this.router.navigate(["/epa02/2", {viewId: this.hdrId }])
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
