import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from '../../../../common/services/';

declare var $: any;

@Component({
  selector: 'app-epa01-4-1',
  templateUrl: './epa01-4-1.component.html'
})
export class Epa0141Component implements OnInit {

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
    //this.authService.reRenderVersionProgram('EXP-01200');

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
      refNo: "110102101",
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

    this.ajax.post("epa/epa014/getInvDetailALL", { hdrId: this.hdrId, dtlId: this.dtlId }, (res) => {
      let data = res.json();
      console.log(data);

      this.leftformVo.exportName = data.hdrVo.exportName;
      this.leftformVo.exciseSrc = data.hdrVo.checkPointDest;
      this.leftformVo.checkPointDest = data.hdrVo.checkPointDest;
      this.leftformVo.exciseDest = data.hdrVo.checkPointDest;
      this.leftformVo.dateOut = data.hdrVo.dateOutDisplay;

      this.leftformVo.productName = data.dtlVo.productName;
      this.leftformVo.goodsNum = data.dtlVo.goodsNum;
      this.leftformVo.transportName = data.hdrVo.transportName;
      this.leftformVo.route = data.hdrVo.route;


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


  // onClickSave() {
  //   let p = {
  //     hdrId: this.hdrId, dtlId: this.dtlId,

  //     "leftFrom": this.leftformVo,
  //     "rightForm": this.rightformVo

  //   };

  //   this.messagebar.comfirm((isOk) => {
  //     if (isOk) {
  //       this.ajax.post("epa/epa011/saveInv", p, (res) => {
  //         this.messagebar.successModal("บันทึกข้อมูลทำเสร็จ");
  //         // this.onback();
  //       }, (error) => {
  //         this.messagebar.errorModal("ทำรายการไม่สำเร็จ");
  //       });
  //     }
  //   }, "ยืนยันการทำรายการ");

  // }

  onClickBack(){
    // /epa01/2;viewId=1
    this.router.navigate(["/epa01/4", {viewId: this.hdrId }])
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
