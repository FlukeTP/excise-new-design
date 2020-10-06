import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatter, TextDateTH, Utils } from 'helpers/index';
import { BreadCrumb, ResponseData } from 'models/index';
import { MessageService } from 'services/index';
import { AjaxService } from "../../../../common/services/ajax.service";
import { MessageBarService } from "../../../../common/services/message-bar.service";
import { Int0201ConfigVo } from './int0201vo.model';

const URL = {
  FIND_QTN_SIDE: "ia/int0201/find-qtnside-by-id",
  FIND_QTN_SIDEDTL: "ia/int0201/find-qtnside-dtl-by-id",
  SEND_QTN_FORM: "ia/int0201/send-qtn-form",
  FIND_QTN_HDR: "ia/int0201/find/qtn-hdr",
  UPDATE_STATUS: "ia/int0201/update/status",
  CANCEL_SEND: "ia/int02/cancel-send-qtn",
  CANCELED_QTN: "ia/int0201/canceled-qtn",
  // Configs
  GET_CONFIG: "ia/int0201/config"
}

declare var $: any;
@Component({
  selector: 'app-int02-1',
  templateUrl: './int0201.component.html',
  styleUrls: ['./int0201.component.css'],
})
export class Int0201Component implements OnInit {
  menuhide: boolean = false;
  pending: boolean = false;
  munuHide() {
    if (this.menuhide) {
      this.menuhide = false;
    } else {
      this.menuhide = true;
    }
  }
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
    { label: "รายละเอียดแบบสอบถามระบบการควบคุมภายใน", route: "#" }
  ];

  configsSubmitted: boolean = false;
  configs: Int0201ConfigVo = null;
  configsForm: FormGroup = new FormGroup({});

  @Input() riskId: any;
  @Input() riskType: any;
  @Input() page: any;
  @Output() out: EventEmitter<number> = new EventEmitter<number>();
  @Output() has: EventEmitter<boolean> = new EventEmitter<boolean>();

  sides: any;
  defaultDetail: any = [];
  _idHead: number = null;
  _updatedBy: string = "";
  _updatedDate: string = "";
  _budgetYear: string = "";
  details: any = [];
  defaultSides: any = [];
  checkIndex: boolean = false;
  status: any;
  qtnHdrName: string;

  //loading
  loadingInit: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
    this.configsForm = this.formBuilder.group({
      high: ["สูง", Validators.required],
      highColor: ["red", Validators.required],
      highCondition: [">", Validators.required],
      highEnd: null,
      highRating: [3, Validators.required],
      highStart: [75, Validators.required],
      id: null,
      idQtnHdr: null,
      low: ["ต่ำ", Validators.required],
      lowColor: ["green", Validators.required],
      lowCondition: ["<", Validators.required],
      lowEnd: null,
      lowRating: [1, Validators.required],
      lowStart: [50, Validators.required],
      medium: ["ปานกลาง", Validators.required],
      mediumColor: ["yellow", Validators.required],
      mediumCondition: ["<>", Validators.required],
      mediumEnd: [75, Validators.required],
      mediumRating: [2, Validators.required],
      mediumStart: [50, Validators.required],
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null,
      isDeleted: ['N', Validators.required],
      version: [1, Validators.required],
    });
  }

  ngOnInit() {
    this._idHead = this.route.snapshot.queryParams['id'];
    this._budgetYear = this.route.snapshot.queryParams['budgetYear'];

    if (Utils.isNotNull(this._idHead)) {
      this.dataInit(this._idHead);
      this.getConfigs();
    }
  }

  ngAfterViewInit() {
    $('.ui.dropdown').dropdown();
    $(".ui.dropdown.ai").dropdown().css("width", "100%");
  }

  back() {
    this.router.navigate(['int02/04']);
  }

  getConfigs() {
    this.ajax.doGet(`${URL.GET_CONFIG}/${this._idHead}`).subscribe((result: ResponseData<Int0201ConfigVo>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        if (result.data) {
          // update form
          this.setupConfigs(result);
        }
      } else {
        this.msg.errorModal(result.message);
      }
    });
  }

  canceledQtn() {
    this.msg.comfirm((res) => {
      if (res) {
        $('.ui.sidebar').sidebar({
          context: '.ui.grid.pushable'
        })
          .sidebar('setting', 'transition', 'push')
          .sidebar('setting', 'dimPage', false)
          .sidebar('hide');
        this.ajax.doPut(`${URL.CANCELED_QTN}/${this._idHead}`, {}).subscribe((response: ResponseData<any>) => {
          // console.log(response);
          if (MessageService.MSG.SUCCESS == response.status) {
            this.dataInit(this._idHead);
            this.getConfigs();
            this.msg.successModal(response.data);
          } else {
            this.msg.errorModal(response.message);
          }
        });
      }
    }, "ยืนยันการยกเลิกแบบสอบถาม")
  }

  saveConfigs() {
    console.log("saveConfigs => ", this.configsForm.value);
    this.configsSubmitted = true;
    if (this.configsForm.valid) {
      if (this.configsForm.value.id) {
        // UPDATE
        this.ajax.doPut(`${URL.GET_CONFIG}/${this._idHead}`, this.configsForm.value).subscribe((result: ResponseData<Int0201ConfigVo>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // GET DATA HERE
            // update form
            this.setupConfigs(result);
            this.msg.successModal(result.message);
          } else {
            this.msg.errorModal(result.message);
          }
        });
      } else {
        this.configsForm.get('idQtnHdr').patchValue(this._idHead);
        this.ajax.doPost(`${URL.GET_CONFIG}/`, this.configsForm.value).subscribe((result: ResponseData<Int0201ConfigVo>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // GET DATA HERE
            this.msg.successModal(result.message);
            // update form
            this.setupConfigs(result);
          } else {
            this.msg.errorModal(result.message);
          }
        });
      }
    }
    this.configsSubmitted = false;
  }

  setupConfigs(result: ResponseData<Int0201ConfigVo>) {
    this.configsForm = this.formBuilder.group({
      high: [result.data.high, Validators.required],
      highColor: [result.data.highColor, Validators.required],
      highCondition: [result.data.highCondition, Validators.required],
      highEnd: null,
      highRating: [result.data.highRating, Validators.required],
      highStart: [result.data.highStart, Validators.required],
      id: [result.data.id, Validators.required],
      idQtnHdr: [result.data.idQtnHdr, Validators.required],
      low: [result.data.low, Validators.required],
      lowColor: [result.data.lowColor, Validators.required],
      lowCondition: [result.data.lowCondition, Validators.required],
      lowEnd: null,
      lowRating: [result.data.lowRating, Validators.required],
      lowStart: [result.data.lowStart, Validators.required],
      medium: [result.data.medium, Validators.required],
      mediumColor: [result.data.mediumColor, Validators.required],
      mediumCondition: [result.data.mediumCondition, Validators.required],
      mediumEnd: [result.data.mediumEnd, Validators.required],
      mediumRating: [result.data.mediumRating, Validators.required],
      mediumStart: [result.data.mediumStart, Validators.required],
      createdBy: result.data.createdBy,
      createdDate: result.data.createdDate,
      updatedBy: result.data.updatedBy,
      updatedDate: result.data.updatedDate,
      isDeleted: [result.data.isDeleted, Validators.required],
      version: [result.data.version, Validators.required],
    });
  }

  dataInit = (id: number) => {
    //find Qtn-Hdr
    this.ajax.doGet(`${URL.FIND_QTN_HDR}/${id}`).subscribe((response: ResponseData<any>) => {
      if (response.status === 'SUCCESS') {
        this.status = response.data.status;
        this.qtnHdrName = response.data.qtnHeaderName
        this._updatedBy = response.data.updatedBy ? response.data.updatedBy : response.data.createdBy;
        this._updatedDate = response.data.updatedDate ? response.data.updatedDate : response.data.createdDate;
        console.log("response: ", response.data);
      } else {
        this.msg.errorModal(response.message);
        this.cancelLoading();
      }
    }, error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });

    //find Qtn-side
    this.ajax.doPost(URL.FIND_QTN_SIDE, { id: id }).subscribe((response: ResponseData<any>) => {
      if (response.status === 'SUCCESS') {
        this.sides = [];
        this.defaultSides = response.data;
        this.sides = this.defaultSides;

        let _data = [];
        this.sides.forEach(obj => {
          _data.push({ id: obj.id, sideName: obj.sideName });
        });
        //find Qtn-side-dtl
        this.ajax.doPost(URL.FIND_QTN_SIDEDTL, { request: _data }).subscribe((response: ResponseData<any>) => {
          if (response.status === 'SUCCESS') {
            this.defaultDetail = response.data.data;
            this.details = this.defaultDetail;
            /* hidden side menu */
            if (response.data.data.length == 0) {
              this.menuhide = true;
            }
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

  cancelQtn(e) {
    e.preventDefault();
    this.msg.comfirm((c) => {
      if (c) {
        this.loadingInit = true;
        this.ajax.doPut(`${URL.CANCEL_SEND}/${this._idHead}`, null).subscribe((response: ResponseData<any>) => {
          if (response.status === 'SUCCESS') {
            this.loadingInit = false;
            this.msg.successModal("ยกเลิกแบบสอบถามสำเร็จ");
            this.router.navigate(["/int02"]);
          } else {
            this.loadingInit = false;
            this.msg.errorModal(response.message);
          }
        }), error => {
          this.loadingInit = false;
          this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
        };
      }
    }, "ยืนยันการยกเลิกแบบสอบถาม")
  }

  handleSendQtn(e) {
    e.preventDefault();
    this.pending = true;
    if (Utils.isNotNull($('#startDateSend').val()) && Utils.isNotNull($('#endDateSend').val())) {
      this.closeModal();
      let _dtl = [];

      /* loop find data side detail */
      if (this.details.length > 0) {
        this.details.forEach(data => {
          if (data.length > 0) {
            data.forEach(hdr => {
              _dtl.push({ idSideDtl: hdr.id, qtnLevel: hdr.qtnLevel });
              if (hdr.children.length > 0) {
                hdr.children.forEach(dtl => {
                  _dtl.push({ idSideDtl: dtl.id, qtnLevel: dtl.qtnLevel });
                  if (dtl.children.length > 0) {
                    dtl.children.forEach(dtls => {
                      _dtl.push({ idSideDtl: dtls.id, qtnLevel: dtls.qtnLevel });
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
        startDateSend: (<HTMLInputElement>document.getElementById("startDateSend")).value,
        endDateSend: (<HTMLInputElement>document.getElementById("endDateSend")).value,
        qtnMadeList: _dtl,
        idHead: this._idHead,
        status: this.status
      };

      this.ajax.doPost(URL.SEND_QTN_FORM, REQUEST).subscribe((response: ResponseData<any>) => {
        if (response.status === 'SUCCESS') {
          this.msg.successModal("ส่งแบบสอบถามสำเร็จ");
          setTimeout(() => {
            this.pending = false;
            this.router.navigate(["/int02"]);
          }, 400);
        } else {
          this.msg.successModal(response.message);
        }
      }), error => {
        this.msg.successModal("กรุณาติดต่อผู้ดูแลระบบ");
      };
    } else {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
    }

  }

  closeModal() {
    $('#detail').modal('hide');
  }

  viewDetail1() {
    $('#detail1').modal('show');
  }

  showDtl(order: any) {
    this.details = [];
    if (order === 'ALL') {
      this.checkIndex = false;
      this.sides = this.defaultSides;
      this.details = this.defaultDetail;
    } else {
      this.checkIndex = true;
      this.sides = this.defaultSides[order].sideName;
      let _dtl = this.defaultDetail[order];
      this.details.push(_dtl);
    }
  }

  sendQtnForm() {
    $('#detail').modal('show');
    $('#date1').calendar({
      endCalendar: $('#date2'),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        // this.sendQtnForm.get('startDate').patchValue(text);
      }
    });

    $('#date2').calendar({
      startCalendar: $('#date1'),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        // this.sendQtnForm.get('endDate').patchValue(text);
      }
    });
  }

  updateStatus(e, flagStr?: string) {
    this.ajax.doPost(URL.UPDATE_STATUS, { id: this._idHead, status: this.status, flagStr: flagStr }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.msg.successModal(response.message, "สำเร็จ", event => {
          if (event) {
            window.location.reload();
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  viewDetail() {
    console.log(this.status);

    if (this.status === 'SUCCESS_HDR') {
      this.msg.comfirm((c) => {
        if (c) {
          this.router.navigate(['/int02/01/02'], {
            queryParams: {
              id: this._idHead,
              status: this.status
            }
          });
          // this.sendQtnForm();
        }
      }, "แบบสอบถามนี้เคยมีการส่งไปแล้ว หากมีการส่งแบบสอบถามใหม่แบบสอบถามเดิมจะถูกลบ ต้องการส่งแบบสอบถามใหม่หรือไม่");
    } else {
      this.router.navigate(['/int02/01/02'], {
        queryParams: {
          id: this._idHead,
          status: this.status
        }
      });
      // this.sendQtnForm();
      // }
    }
  }

  moveTo() {
    this.router.navigate(['/int02/01/01'], {
      queryParams: {
        id: this._idHead
      }
    });
  }

  detail(id: number) {
    this.router.navigate(['/int02/01/01/01'], {
      queryParams: {
        id: id
      }
    });
  }

  isEmpty(value) {
    return value == null || value == undefined || value == '';
  }

  inputKeypress(control: string, minControl: string = 'lowEnd', maxControl: string = 'lowEnd') {
    const controller: FormControl = this.configsForm.get(control) as FormControl;
    const minForm: FormControl = this.configsForm.get(minControl) as FormControl;
    const maxForm: FormControl = this.configsForm.get(maxControl) as FormControl;
    controller.setValidators([Validators.max(100), Validators.min(0)]);
    this.configsForm.updateValueAndValidity();
  }

  invalidControl(control: string) {
    return this.configsForm.get(control).invalid && this.configsForm.get(control).touched;
  }

}
