import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Utils } from 'helpers/utils';
import { ResponseData } from 'models/response-data.model';
import { FormControl } from '@angular/forms';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';
import { MessageService } from 'services/message.service';

const URL = {
  FIND_QTN_SIDE: "ia/int020201/find-qtnside-by-id",
  FIND_QTN_SIDEDTL: "ia/int020201/find-qtnside-dtl-by-id",
  CONFIRM_QTN_FORM: "ia/int020201/update-qtnmade-confirm",
  FIND_QTN_MADE_HDR: "ia/int020201/find/qtn-made-hdr",
  UPDATE_CONCLUDE: "ia/int020201/update-conclude",
  COUNT_CHECK_QTN: "ia/int020201/find/count-check-qtn",
  UPDATE_STATUS: "ia/int020201/update/status"
}

declare var $: any;
@Component({
  selector: 'app-int020201',
  templateUrl: './int020201.component.html',
  styleUrls: ['./int020201.component.css']
})
export class Int020201Component implements OnInit {
  conclude = new FormControl('');
  menuhide: boolean = false;
  munuHide() {
    if (this.menuhide) {
      this.menuhide = false;
    } else {
      this.menuhide = true;
    }
  }
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตอบแบบสอบถามระบบการควบคุมภายใน", route: "#" },
    { label: "รายละเอียดตอบแบบสอบถามระบบการควบคุมภายใน", route: "#" }
  ];

  sides: any;
  defaultDetail: any = [];
  _idHead: number = null;
  _updatedBy: string = "";
  _updatedDateStr: string = "";
  _budgetYear: string = "";
  _back: string = "";
  _idMadeHdr: number = null;
  details: any = [];
  defaultSides: any = [];
  status: string;
  qtnHdrName: string
  request: any = [];
  statusCount: number;
  countCheckQtn: boolean = false;

  //loading
  loadingInit: boolean = true;

  constructor(
    private router: Router,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private msg: MessageBarService

  ) {
  }

  ngOnInit() {
    this.conclude.setValue("aaaaa")
    $('.ui.dropdown').dropdown();
    $(".ui.dropdown.ai").dropdown().css("width", "100%");
    this._idHead = this.route.snapshot.queryParams['idHdr'];
    this._idMadeHdr = this.route.snapshot.queryParams['idMadeHdr'];
    this._budgetYear = this.route.snapshot.queryParams['budgetYear'];
    this._back = this.route.snapshot.queryParams['back'];
    if (Utils.isNotNull(this._idHead) && Utils.isNotNull(this._idMadeHdr)) {
      this.dataInit(this._idHead, this._idMadeHdr);
    }
  }

  back() {
    if (this._back) {
      this.router.navigate(['int02/03/01'], {
        queryParams: {
          id: this._idHead,
          budgetYear: this._budgetYear
        }
      });

    } else {
      this.router.navigate(['int02/02']);

    }

  }

  dataInit = (idSide: number, idMadeHdr: number) => {
    //find count qtn to check button
    this.ajax.doGet(`${URL.COUNT_CHECK_QTN}/${idSide}`).subscribe((response: ResponseData<any>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.countCheckQtn = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });

    //find Qtn-Hdr and status
    this.ajax.doGet(`${URL.FIND_QTN_MADE_HDR}/${idMadeHdr}`).subscribe((response: ResponseData<any>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.status = response.data.status;
        this.qtnHdrName = response.data.qtnHeaderName
        this._updatedBy = Utils.isNotNull(response.data.updatedBy) ? response.data.updatedBy : response.data.createdBy;
        this._updatedDateStr = Utils.isNotNull(response.data.updatedDate) ? response.data.updatedDate : response.data.createdDate;
        this.conclude.patchValue(response.data.conclude)
      } else {
        this.msg.errorModal(response.message);
        this.cancelLoading();
      }
    }, error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });

    //find Qtn-side
    this.ajax.doPost(URL.FIND_QTN_SIDE, { idSide: idSide, idMadeHdr: idMadeHdr }).subscribe((response: ResponseData<any>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.sides = [];
        this.defaultSides = response.data;
        this.sides = this.defaultSides;

        let _data = [];
        this.sides.forEach(obj => {
          _data.push({ idSide: obj.id, sideName: obj.sideName, idMadeHdr: idMadeHdr });
        });
        //find Qtn-side-dtl
        this.ajax.doPost(URL.FIND_QTN_SIDEDTL, { header: _data }).subscribe((response: ResponseData<any>) => {
          if (response.status === MessageService.MSG.SUCCESS) {
            this.defaultDetail = response.data.header;
            this.details = this.defaultDetail;

            /* hidden side menu */
            if (response.data.header.length == 0) {
              this.menuhide = true;
            }

            /* check status send qtn */
            this.statusCount = 0;
            this.defaultDetail.forEach(qtn => {
              if (!qtn.statusSides) {
                this.statusCount += 1;
              }
            });

            /* stop loading*/
            this.cancelLoading();
          } else {
            this.msg.errorModal(response.message);
            this.cancelLoading();
          }
        }, error => {
          this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
          this.cancelLoading();
        });
      } else {
        this.msg.errorModal(response.message);
        this.cancelLoading();
      }
    }, error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
      this.cancelLoading();
    });
  }

  cancelLoading() {
    setTimeout(() => {
      this.loadingInit = false;
    }, 200);
  }

  handleSave(e) {
    e.preventDefault();
    let _idMadeHdr = null;
    let _flagConfirm = false;

    /* loop find data request */
    if (this.details.length > 0) {
      _idMadeHdr = this.details[0].idMadeHdr
    }

    /* set request */
    let REQUEST = {};
    REQUEST = {
      // qtnMadeList: dataForm,
      qtnMadeList: this.request,
      status: this.status,
      idMadeHdr: _idMadeHdr,
      flagConfirm: _flagConfirm
    };

    this.ajax.doPost(URL.CONFIRM_QTN_FORM, REQUEST).subscribe((response: ResponseData<any>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.msg.successModal(response.message, "สำเร็จ", event => {
          if (event) {
            this.saveConclude()
            window.location.reload();
          }
        });
      } else {
        this.msg.successModal(response.message);
      }
    }), error => {
      this.msg.successModal("กรุณาติดต่อผู้ดูแลระบบ");
    };

  }

  saveConclude() {
    let REQUEST = {
      idMadeHdr: this._idMadeHdr,
      conclude: this.conclude.value
    }
    this.ajax.doPut(URL.UPDATE_CONCLUDE, REQUEST).subscribe((response: ResponseData<any>) => {

    }), error => {
      this.msg.successModal("กรุณาติดต่อผู้ดูแลระบบ");
    };

  }

  clickRadios(level: number, id: number, checkFlag: string = "", i?: number, j?: number, k?: number, l?: number) {
    const params = { level, id, checkFlag, i, j, k, l }

    if (this.request.length > 0) {
      let index = this.request.findIndex(obj => obj.id == id);
      if (index == -1) {
        this.checkLevelRadios(params);
      } else {
        /* change flag */
        this.request[index].checkFlag = checkFlag;
        if (params.level == 1) {
          /* update loop detail */
          this.details[i].sides[j].checkFlag = params.checkFlag;
        } else if (params.level == 2) {
          /* update loop detail */
          this.details[i].sides[j].children[k].checkFlag = params.checkFlag;
        } else {
          /* update loop details */
          this.details[i].sides[j].children[k].children[l].checkFlag = params.checkFlag;
        }
      }
    } else {
      this.checkLevelRadios(params);
    }
  }

  checkLevelRadios(params) {
    const { i, j, k, l } = params;

    if (params.level == 1) {
      this.request.push({
        id: params.id,
        note: this.details[i].sides[j].note,
        checkFlag: params.checkFlag
      });
      /* update loop detail */
      this.details[i].sides[j].checkFlag = params.checkFlag;
    } else if (params.level == 2) {
      this.request.push({
        id: params.id,
        note: this.details[i].sides[j].children[k].note,
        checkFlag: params.checkFlag
      });
      /* update loop detail */
      this.details[i].sides[j].children[k].checkFlag = params.checkFlag;
    } else {
      this.request.push({
        id: params.id,
        note: this.details[i].sides[j].children[k].children[l].note,
        checkFlag: params.checkFlag
      });
      /* update loop details */
      this.details[i].sides[j].children[k].children[l].checkFlag = params.checkFlag;
    }
  }

  keyupComment(level: number, id: number, i?: number, j?: number, k?: number, l?: number) {
    if (this.request.length > 0) {
      let index = this.request.findIndex(obj => obj.id == id);
      /* find no data */
      if (index == -1) {
        this.checkLevelComment(level, id, i, j, k, l);
      } else {
        /* have data */
        if (level == 1) {
          /* update loop detail */
          this.request[index].note = this.details[i].sides[j].note;
        } else if (level == 2) {
          /* update loop detail */
          this.request[index].note = this.details[i].sides[j].children[k].note;
        } else {
          /* update loop details */
          this.request[index].note = this.details[i].sides[j].children[k].children[l].note;
        }
      }
    } else {
      /* empty of array */
      this.checkLevelComment(level, id, i, j, k, l);
    }
  }

  checkLevelComment(level: number, id: number, i?: number, j?: number, k?: number, l?: number) {
    if (level == 1) {
      this.request.push({
        id: id,
        note: this.details[i].sides[j].note,
        checkFlag: this.details[i].sides[j].checkFlag
      });
    } else if (level == 2) {
      this.request.push({
        id: id,
        note: this.details[i].sides[j].children[k].note,
        checkFlag: this.details[i].sides[j].children[k].checkFlag
      });
    } else {
      this.request.push({
        id: id,
        note: this.details[i].sides[j].children[k].children[l].note,
        checkFlag: this.details[i].sides[j].children[k].children[l].checkFlag
      });
    }
  }

  sendQtnCheck(e) {
    e.preventDefault();

    let dataForm = [];
    let _idMadeHdr = null;
    let _flagConfirm = true;

    /* loop find data request */
    if (this.details.length > 0) {

      this.details.forEach(data => {
        if (data.sides.length > 0) {
          data.sides.forEach(hdr => {
            _idMadeHdr = hdr.idMadeHdr;
            /* Radio-Checkbox: checked OR uncehecked */
            let radiosHeader = document.getElementsByName("header" + hdr.id);
            /* hdr have children */
            if (radiosHeader.length > 0) {
              radiosHeader.forEach(ele => {
                if ((<HTMLInputElement>ele).checked) {
                  dataForm.push({
                    id: hdr.id,
                    note: (<HTMLInputElement>document.getElementById("noteHeader" + hdr.id)).value,
                    checkFlag: (<HTMLInputElement>ele).value
                  });
                }
              });
            }
            // else {
            //   /* hdr not children */
            //   dataForm.push({
            //     id: hdr.id,
            //     note: (<HTMLInputElement>document.getElementById("noteHeader" + hdr.id)).value
            //   });
            // }

            /* check children of header */
            if (hdr.children.length > 0) {
              hdr.children.forEach(dtl => {
                let radiosDetail = document.getElementsByName("detail" + dtl.id);
                /* dtl have children */
                if (radiosDetail.length > 0) {
                  radiosDetail.forEach(ele => {
                    if ((<HTMLInputElement>ele).checked) {
                      dataForm.push({
                        id: dtl.id,
                        note: (<HTMLInputElement>document.getElementById("noteDtl" + dtl.id)).value,
                        checkFlag: (<HTMLInputElement>ele).value
                      });
                    }
                  });
                }
                // else {
                //   /* dtl not children */
                //   dataForm.push({
                //     id: dtl.id,
                //     note: (<HTMLInputElement>document.getElementById("noteDtl" + dtl.id)).value
                //   });
                // }


                if (dtl.children.length > 0) {
                  dtl.children.forEach(dtls => {
                    let radiosDetails = document.getElementsByName("details" + dtls.id);
                    radiosDetails.forEach(ele => {
                      if ((<HTMLInputElement>ele).checked) {
                        dataForm.push({
                          id: dtls.id,
                          note: (<HTMLInputElement>document.getElementById("noteDtls" + dtls.id)).value,
                          checkFlag: (<HTMLInputElement>ele).value
                        });
                      }
                    });
                  });
                }
              });
            }
          });
        }
      });
    }
    /* set request */
    let REQUEST = {};
    REQUEST = {
      qtnMadeList: dataForm,
      status: this.status,
      idMadeHdr: _idMadeHdr,
      flagConfirm: _flagConfirm
    };

    /* confirm */
    this.msg.comfirm((c) => {
      if (c) {
        this.ajax.doPost(URL.CONFIRM_QTN_FORM, REQUEST).subscribe((response: ResponseData<any>) => {
          if (response.status === MessageService.MSG.SUCCESS) {
            setTimeout(() => {
              this.router.navigate(["/int02/02"]);
            }, 200);
          } else {
            this.msg.successModal(response.message);
          }
        }), error => {
          this.msg.successModal("กรุณาติดต่อผู้ดูแลระบบ");
        };
      }
    }, "ยืนยันการส่งแบบสอบถาม");
  }

  showDtl(order: any) {
    this.details = [];
    if (order === 'ALL') {
      this.sides = this.defaultSides;
      this.details = this.defaultDetail;
    } else {
      this.sides = this.defaultSides[order].sideName;
      this.details.push(this.defaultDetail[order]);
    }
  }

  cancelReplyQtn(e) {
    e.preventDefault();
    this.msg.comfirm((c) => {
      if (c) {
        this.ajax.doPut(`${URL.UPDATE_STATUS}/${this._idMadeHdr}`, { status: this.status }).subscribe((response: ResponseData<any>) => {
          if (response.status === MessageService.MSG.SUCCESS) {
            window.location.reload();
          } else {
            this.msg.successModal(response.message);
          }
        }), error => {
          this.msg.successModal("กรุณาติดต่อผู้ดูแลระบบ");
        };
      }
    }, "ยกเลิกการตอบแบบสอบถาม");
  }

}
