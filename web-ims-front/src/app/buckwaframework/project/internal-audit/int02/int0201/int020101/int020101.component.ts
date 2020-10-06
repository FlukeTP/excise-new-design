import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { BreadCrumb, ResponseData } from 'models/index';
import { Subscription } from 'rxjs';
import { AjaxService, MessageBarService, MessageService } from "../../../../../common/services";
import { Int020101Service } from './int020101.service';
import { Int020101Vo, Int020101YearVo, Int020101NameVo } from './int020101vo.model';
import { Location } from '@angular/common';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Int0201ConfigVo } from '../int0201vo.model';
import { ReturnStatement } from '@angular/compiler';

const URL = {
  DELETE_QTN: "ia/int02/01/01/delete/choices",
  UPDATE_STATUS: "ia/int02/01/01/update/status",
  // Configs
  GET_CONFIG: "ia/int0201/config"
}

declare var $: any;
@Component({
  selector: 'app-int020101',
  templateUrl: './int020101.component.html',
  styleUrls: ['./int020101.component.css'],
  providers: [Int020101Service]
})
export class Int020101Component implements OnInit {
  condListFrist: any
  condList: any
  colorList: any
  breadcrumb: BreadCrumb[];
  objSubQtnIdSide: Subscription = null;
  objSubQtnSides: Subscription = null;
  deleteQtnForm: FormGroup = new FormGroup({});
  submittedDelete = false;

  idHead: string = "";

  qtnSides: Int020101Vo[] = [];
  hiddenChoice: boolean = false;
  chkAll: boolean = true;
  header: string = "";
  // dropdown
  years: Int020101YearVo[] = [];
  names: Int020101NameVo[] = [];
  // form
  form: FormGroup;
  formChild: FormGroup;
  // submitted
  submitted: boolean = false;
  submittedChild: boolean = false;

  //config
  configsSubmitted: boolean = false;
  configs: Int0201ConfigVo = null;
  configsForm: FormGroup = new FormGroup({});

  checkUseQtn: any
  constructor(
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router,
    private messageBar: MessageBarService,
    private fb: FormBuilder,
    private selfService: Int020101Service,
    private location: Location
  ) {
    const budgetYear = MessageService.budgetYear();
    this.form = this.fb.group({
      // Detail Form
      id: [null],
      budgetYear: [budgetYear, Validators.required],
      qtnHeaderName: ['', Validators.required],
      note: [''],
      qtnType: ['A'],
      qtnYear: [''],
      qtnName: [''],
      status: [''],
      toDepartment: [''],
      usagePatterns: [''],
      factorLevel: [''],

      // Base Form
      // isDeleted: ['N', Validators.required],
      // version: [1, Validators.required],
      createdBy: [''],
      createdDate: [null],
      updatedBy: [null],
      updatedDate: [null],
      side: ['']
    });
    this.formChild = this.fb.group({
      // Detail Form
      id: [null],
      idHead: ['', Validators.required],
      sideName: ['', Validators.required],

      // Base Form
      isDeleted: ['N', Validators.required],
      version: [1, Validators.required],
      createdBy: [''],
      createdDate: [null],
      updatedBy: [null],
      updatedDate: [null],
      seq: [null]
    });
    this.objSubQtnSides = this.selfService.qtnSidesObs().subscribe(result => {
      this.qtnSides = result;
    });
    this.objSubQtnIdSide = this.selfService.qtnIdSideObs().subscribe(result => {
      if (result) {
        this.idHead = result.toString();
      }
    });

    this.configsForm = this.fb.group({
      high: ["สูง", Validators.required],
      highColor: ["ส้ม", Validators.required],
      highCondition: [">=|<=", Validators.required],
      highEnd: null,
      highRating: [3, Validators.required],
      highStart: [75, Validators.required],
      id: null,
      idQtnHdr: null,
      low: ["ต่ำ", Validators.required],
      lowColor: ["เขียว", Validators.required],
      lowCondition: [">=|<=", Validators.required],
      lowEnd: null,
      lowRating: [1, Validators.required],
      lowStart: [50, Validators.required],
      medium: ["ปานกลาง", Validators.required],
      mediumColor: ["yellow", Validators.required],
      mediumCondition: [">=|<=", Validators.required],
      mediumEnd: [75, Validators.required],
      mediumRating: [2, Validators.required],
      mediumStart: [50, Validators.required],
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null,
      isDeleted: ['N', Validators.required],
      version: [1, Validators.required],

      verylow: ['', Validators.required],
      verylowStart: ['', Validators.required],
      verylowEnd: [''],
      verylowRating: [, Validators.required],
      verylowColor: [, Validators.required],
      verylowCondition: [, Validators.required],
      veryhigh: ['', Validators.required],
      veryhighStart: ['', Validators.required],
      veryhighEnd: [''],
      veryhighRating: ['', Validators.required],
      veryhighColor: ['', Validators.required],
      veryhighCondition: ['', Validators.required],

      verylowConditionCon: [null, Validators.required],
      lowConditionCon: [null, Validators.required],
      mediumConditionCon: [null, Validators.required],
      highConditionCon: [null, Validators.required],
      veryhighConditionCon: [null, Validators.required],
    });

    this.deleteQtnForm = this.fb.group({
      choices: [null, Validators.required],
    })
  }

  ngOnInit() {
    this.idHead = this.route.snapshot.queryParams['id'] || "";
    this.callDataRisk()
    if (this.idHead) {
      this.callGetCheckUseQtn(this.idHead.toString())
      let promise = new Promise((resolve, reject) => {
        this.form.get('id').patchValue(this.idHead);
        this.selfService.findQtnHead(this.idHead, this.form);
        this.selfService.findQtnSide(this.idHead);
        // resolve();
        setTimeout(function () {
          resolve();
        }, 100);
      });

      promise.then(() => {
        if (this.form.get('status').value === '1' || this.form.get('status').value === '2') {
          this.breadcrumb = [
            { label: "ตรวจสอบภายใน", route: "#" },
            { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
            { label: "แก้ไขแบบสอบถามระบบการควบคุมภายใน", route: "#" },
          ];
          this.header = "แก้ไขแบบสอบถามระบบการควบคุมภายใน ปีงบประมาณ " + this.form.get('budgetYear').value;
        } else {
          this.breadcrumb = [
            { label: "ตรวจสอบภายใน", route: "#" },
            { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
            { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
          ];
          this.header = "แบบสอบถามระบบการควบคุมภายใน ปีงบประมาณ " + this.form.get('budgetYear').value;
        }
      })
      //config
      this.getConfigs();
    } else {
      this.selfService.findByUsername().then(years => {
        this.years = years;
        if (this.years.length == 0) {
          this.hiddenChoice = true;
        } else {
          this.hiddenChoice = false;
        }
      });
      this.breadcrumb = [
        { label: "ตรวจสอบภายใน", route: "#" },
        { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
        { label: "สร้างแบบสอบถามระบบการควบคุมภายใน", route: "#" },
      ];
      this.header = "สร้างแบบสอบถามระบบการควบคุมภายใน ปีงบประมาณ " + this.form.get('budgetYear').value;
    }
  }

  ngAfterViewInit() {
    // Modal
    $("#int020101-create").modal('hide');
    $("#int020101-edit").modal('hide');
    $(".ui.dropdown.ai").dropdown().css("width", "100%");
  }

  ngOnDestroy() {
    this.objSubQtnSides.unsubscribe();
    this.objSubQtnIdSide.unsubscribe();
  }

  callDropdown() {
    setTimeout(() => {
      $(".ui.dropdown.ai").dropdown().css("width", "100%");
    }, 50);
  }

  callDataRisk() {
    this.selfService.getRiskData("IA_RISK_COLOR").then(res => {
      this.colorList = res
    })

    this.selfService.getRiskData("IA_COND_RANGE").then(res => {
      this.condList = res
      this.condListFrist = this.condList.filter(function (value) {
        return value.value2 != 'N'
      })
    })
  }

  callGetCheckUseQtn(id: string) {
    this.selfService.getCheckUseQtn(id).then(res => {
      this.checkUseQtn = res
    })
  }

  changeCondition(e, data) {
    let nameEnd = data.split("Condition")
    nameEnd = nameEnd[0] + 'End' + nameEnd[1]
    switch (e) {
      case "=":
        $(`#${data}Con`).dropdown('set selected', "N");
        $(`.${data}Con`).addClass("disabled");
        $(`.${nameEnd}`).prop("disabled", true);
        break
      case ">":
        $(`#${data}Con`).dropdown('set selected', "N");
        // $(`.${data}Con`).addClass("disabled");
        $(`.${nameEnd}`).prop("disabled", true);
        break
      case ">=":
        $(`#${data}Con`).dropdown('set selected', "<");
        $(`.${data}Con`).removeClass("disabled");
        $(`.${nameEnd}`).prop("disabled", false);
        break
      case "<=":
        $(`#${data}Con`).dropdown('set selected', ">");
        $(`.${data}Con`).removeClass("disabled");
        $(`.${nameEnd}`).prop("disabled", false);
        break
      case "<":
        $(`#${data}Con`).dropdown('set selected', "N");
        // $(`.${data}Con`).addClass("disabled");
        $(`.${nameEnd}`).prop("disabled", true);
        break
    }
  }

  changeConditionCon(e, data) {
    console.log(data, e);

    let nameEnd = data.split("Condition")
    nameEnd = nameEnd[0] + 'End' + nameEnd[1]
    if (e == "N") {
      $(`.${nameEnd}`).prop("disabled", true);
    } else {
      $(`.${nameEnd}`).prop("disabled", false);
    }
  }

  checkAll(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.qtnSides.length; i++) {
        this.qtnSides[i].checked = true;
        $(`#checked${i}`).prop('checked', true);
      }
    } else {
      for (let i = 0; i < this.qtnSides.length; i++) {
        this.qtnSides[i].checked = false;
        $(`#checked${i}`).prop('checked', false);
      }
    }
  }

  checkChange(event, index: number) {
    if (event.target.checked) {
      this.qtnSides[index].checked = true;
      let count = 0;
      for (let i = 0; i < this.qtnSides.length; i++) {
        if (this.qtnSides[i].checked) {
          count++;
        }
      }
      if (count == this.qtnSides.length) {
        this.chkAll = true;
        $('#chkAll').prop('checked', true);
      } else {
        this.chkAll = false;
        $('#chkAll').prop('checked', false);
      }
    } else {
      this.qtnSides[index].checked = false;
      let count = 0;
      for (let i = 0; i < this.qtnSides.length; i++) {
        if (this.qtnSides[i].checked) {
          count++;
        }
      }
      if (count == this.qtnSides.length) {
        this.chkAll = true;
        $('#chkAll').prop('checked', true);
      } else {
        this.chkAll = false;
        $('#chkAll').prop('checked', false);
      }
    }
  }

  // overview() {
  //   this.router.navigate(['int02/01'], {
  //     queryParams: {
  //       id: this.idHead,
  //       updatedBy: this.form.get("updatedBy").value,
  //       updatedDateStr: new DateStringPipe().transform(this.form.get("updatedDate").value, []),
  //       budgetYear: this.form.get("budgetYear").value,
  //       status: this.form.get("status").value
  //     }
  //   });
  // }

  saveAll() {
    this.submitted = true;
    if (this.form.valid) {
      if (this.qtnSides.length > 0) {
        if (this.qtnSides[0].idHead == null) {
          const data: Int020101Vo[] = this.qtnSides.filter(obj => obj.checked == true);
          this.selfService.saveAll(this.form, data);
        } else {
          this.selfService.saveAll(this.form);
        }
        setTimeout(() => {
          this.callGetCheckUseQtn(this.idHead)
        }, 500);
      } else {
        this.selfService.saveAll(this.form);
      }
      this.submitted = false;
    }

  }

  updateAll(flag?: boolean) {
    this.reSeq()
    this.form.patchValue({
      side: this.qtnSides
    })
    this.submitted = true;
    if (this.form.valid) {
      this.selfService.updateAll(this.idHead, this.form, flag);
      this.submittedChild = false;
    }
    // this.getConfigs()
    setTimeout(() => {
      this.ngOnInit()
    }, 200);
    // location.reload()
  }

  save() {
    this.reSeq()
    this.formChild.patchValue({
      seq: this.qtnSides.length + 1
    })
    this.submittedChild = true;
    if (AjaxService.isDebug) {
    }
    if (this.formChild.valid) {
      this.selfService.save(this.formChild);
      this.submittedChild = false;
    }
  }

  update() {
    this.submittedChild = true;
    if (this.formChild.valid) {
      this.selfService.update(this.formChild);
      this.submittedChild = false;
    }
  }

  delete() {
    // id: number
    let id = this.formChild.value.id
    this.messageBar.comfirm(event => {
      if (event) {
        this.selfService.delete(id);
      }
    }, MessageBarService.CONFIRM_DELETE);
  }

  add() {
    $("#int020101-create").modal('show');
    this.formChild.reset();
    this.formChild.get('isDeleted').patchValue('N');
    this.formChild.get('version').patchValue(1);
    this.formChild.get('idHead').patchValue(this.idHead);
  }

  detail(id: number, flagStr?: string) {
    this.router.navigate(['/int02/01/01/01'], {
      queryParams: {
        id: id,
        flagStr: flagStr,
        idHead: this.form.get('id').value
      }
    });
  }
  onDrop(event: CdkDragDrop<Int020101Vo[]>) {

    // first check if it was moved within the same list or moved to a different list
    if (event.previousContainer === event.container) {
      // change the items index if it was moved within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reSeq(); // refresh sequence
      // this.isChanged = true;
    } else {
      // remove item from the previous list and add it to the new array
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.reSeq(); // refresh sequence
      // this.isChanged = true;
    }
  }
  reSeq() {
    for (let i = 0; i < this.qtnSides.length; i++) {
      this.qtnSides[i].seq = i + 1;
    }
  }
  edit(id: number) {
    $("#int020101-edit").modal('show');
    const index: number = this.qtnSides.findIndex(obj => obj.id == id);
    this.formChild.reset();
    this.formChild.get('isDeleted').patchValue('N');
    this.formChild.get('version').patchValue(1);
    this.formChild.get('id').patchValue(id);
    this.formChild.get('idHead').patchValue(this.idHead);
    this.formChild.get('sideName').patchValue(this.qtnSides[index].sideName);
  }

  cancelModal() {
    this.submittedChild = false;
  }

  // Page

  cancel() {
    // this.router.navigate(['/int02/']);
    this.location.back();
  }

  back() {
    this.router.navigate(['/int02/']);
    // this.location.back();
  }

  selectYear() {
    setTimeout(() => {
      $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
      this.selfService.findByYearAndUsername(this.form.get('qtnYear').value || '2561').then(names => {
        this.names = names;
      });
    }, 200);
  }

  viewDetail1() {
    this.ngOnInit()
    $(".ui.dropdown.ai").dropdown().css("width", "100%");
    $('#detail1').modal('show');
  }

  getConfigs() {
    this.ajax.doGet(`${URL.GET_CONFIG}/${this.idHead}`).subscribe((result: ResponseData<Int0201ConfigVo>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        if (result.data) {
          // update form
          console.log("choose");
          if (this.form.value.factorLevel == 5) {
            // if (!this.configsForm.value.verylowCondition || !this.configsForm.value.veryhighCondition) {
            //   console.log("sssssssssssssssssssssssssssssssssssssssssssssssss");
            //   result.data.verylow = 'ต่ำมาก'
            //   result.data.verylowStart = 5
            //   result.data.verylowEnd = null
            //   result.data.verylowRating = 1
            //   result.data.verylowColor = 'เขียวเข้ม'
            //   result.data.verylowCondition = '<|N'
            //   result.data.veryhigh = 'สูงมาก'
            //   result.data.veryhighStart = 85
            //   result.data.veryhighEnd = null
            //   result.data.veryhighRating = 5
            //   result.data.veryhighColor = 'แดง'
            //   result.data.veryhighCondition = '>|N'
            // }
            this.setupConfigs(result);
            console.log("choose 5");
            setTimeout(() => {
              if (!this.configsForm.value.verylowCondition || !this.configsForm.value.veryhighCondition) {
                this.configsForm.patchValue({
                  verylow: 'ต่ำมาก',
                  verylowStart: 5,
                  verylowEnd: null,
                  verylowRating: 1,
                  verylowColor: 'เขียวเข้ม',
                  verylowCondition: '<',
                  verylowConditionCon: 'N',
                  veryhigh: 'สูงมาก',
                  veryhighStart: 85,
                  veryhighEnd: null,
                  veryhighRating: 5,
                  veryhighColor: 'แดง',
                  veryhighCondition: '>',
                  veryhighConditionCon: 'N',
                })
              }
              $('.ui.dropdown.verylowCondition5').removeClass("disabled");
              $('.ui.dropdown.verylowCondition5Con').removeClass("disabled");
              $(`.verylowStart5`).prop("disabled", false);
              $(`.verylowEnd5`).prop("disabled", false);
              $(`.verylowRating5`).prop("disabled", false);
              // $('.verylowColor5').removeClass("disabled");

              $('.ui.dropdown.veryhighCondition5').removeClass("disabled");
              $('.ui.dropdown.veryhighCondition5Con').removeClass("disabled");
              $(`.veryhighStart5`).prop("disabled", false);
              $(`.veryhighEnd5`).prop("disabled", false);
              $(`.veryhighRating5`).prop("disabled", false);
              // $('.veryhighColor5').removeClass("disabled");

              $(".verylowCondition5").dropdown('set selected', this.configsForm.value.verylowCondition)
              $(".lowCondition5").dropdown('set selected', this.configsForm.value.lowCondition)
              $(".mediumCondition5").dropdown('set selected', this.configsForm.value.mediumCondition)
              $(".highCondition5").dropdown('set selected', this.configsForm.value.highCondition)
              $(".veryhighCondition5").dropdown('set selected', this.configsForm.value.veryhighCondition)

              // this.changeCondition(this.configsForm.value.verylowCondition, 'verylowCondition5')
              // this.changeCondition(this.configsForm.value.lowCondition, 'lowCondition5')
              // this.changeCondition(this.configsForm.value.mediumCondition, 'mediumCondition5')
              // this.changeCondition(this.configsForm.value.highCondition, 'highCondition5')
              // this.changeCondition(this.configsForm.value.veryhighCondition, 'veryhighCondition5')

              this.changeConditionCon(this.configsForm.value.verylowConditionCon, 'verylowCondition5')
              this.changeConditionCon(this.configsForm.value.lowConditionCon, 'lowCondition5')
              this.changeConditionCon(this.configsForm.value.mediumConditionCon, 'mediumCondition5')
              this.changeConditionCon(this.configsForm.value.highConditionCon, 'highCondition5')
              this.changeConditionCon(this.configsForm.value.veryhighConditionCon, 'veryhighCondition5')
              
              
              $('.verylowColor5').dropdown('set selected', this.configsForm.value.verylowColor);
              $('.lowColor5').dropdown('set selected', this.configsForm.value.lowColor);
              $('.mediumColor5').dropdown('set selected', this.configsForm.value.mediumColor);
              $('.highColor5').dropdown('set selected', this.configsForm.value.highColor);
              $('.veryhighColor5').dropdown('set selected', this.configsForm.value.veryhighColor);
            }, 200);
          } else if (this.form.value.factorLevel == 3) {
            this.setupConfigs3(result);
            console.log("choose 3");
            $(".lowCondition3").dropdown('set selected', this.configsForm.value.lowCondition)
            $(".mediumCondition3").dropdown('set selected', this.configsForm.value.mediumCondition)
            $(".highCondition3").dropdown('set selected', this.configsForm.value.highCondition)
            // this.changeCondition(this.configsForm.value.lowCondition, 'lowCondition3')
            // this.changeCondition(this.configsForm.value.mediumCondition, 'mediumCondition3')
            // this.changeCondition(this.configsForm.value.highCondition, 'highCondition3')

            this.changeConditionCon(this.configsForm.value.lowConditionCon, 'lowCondition3')
            this.changeConditionCon(this.configsForm.value.mediumConditionCon, 'mediumCondition3')
            this.changeConditionCon(this.configsForm.value.highConditionCon, 'highCondition3')

            $('.lowColor3').dropdown('set selected', this.configsForm.value.lowColor);
            $('.mediumColor3').dropdown('set selected', this.configsForm.value.mediumColor);
            $('.highColor3').dropdown('set selected', this.configsForm.value.highColor);
          }
          
          // if(this.configsForm.value.veryhighConditionCon == 'N'){
          //   console.log("veryhighConditionCon => ",this.configsForm.value.veryhighConditionCon);
          //   setTimeout(() => {
          //     $('#veryhighCondition5Con').dropdown('set selected', 'N');
          //   }, 500);
          // }
        }
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

  saveConfigs() {
    this.configsSubmitted = true;
    console.log("saveConfigs ==>", this.configsForm.value);
    console.log("saveConfigs ==>", this.form.value);
    console.log(this.configsForm.valid);

    console.log(this.configsForm.value);
    // return
    if (this.configsForm.invalid) {
      console.log("กรุณากรอกข้อมูลให้ครบ")
      return
    }
    if (this.configsForm.valid) {
      if (this.configsForm.value.id) {
        // UPDATE

        let verylowCondition = this.configsForm.value.verylowCondition
        let verylowConditionCon = this.configsForm.value.verylowConditionCon
        let lowCondition = this.configsForm.value.lowCondition
        let lowConditionCon = this.configsForm.value.lowConditionCon
        let mediumCondition = this.configsForm.value.mediumCondition
        let mediumConditionCon = this.configsForm.value.mediumConditionCon
        let highCondition = this.configsForm.value.highCondition
        let highConditionCon = this.configsForm.value.highConditionCon
        let veryhighCondition = this.configsForm.value.veryhighCondition
        let veryhighConditionCon = this.configsForm.value.veryhighConditionCon

        this.configsForm.patchValue({
          verylowCondition: `${verylowCondition}|${verylowConditionCon}`,
          lowCondition: `${lowCondition}|${lowConditionCon}`,
          mediumCondition: `${mediumCondition}|${mediumConditionCon}`,
          highCondition: `${highCondition}|${highConditionCon}`,
          veryhighCondition: `${veryhighCondition}|${veryhighConditionCon}`,
        })
        this.ajax.doPut(`${URL.GET_CONFIG}/${this.idHead}`, this.configsForm.value).subscribe((result: ResponseData<Int0201ConfigVo>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // GET DATA HERE
            // update form
            if (this.form.value.factorLevel == 5) {
              this.setupConfigs(result);
            } else if (this.form.value.factorLevel == 3) {
              this.setupConfigs3(result);
            }
            this.messageBar.successModal(result.message);
          } else {
            this.messageBar.errorModal(result.message);
          }
        });
      } else {
        this.configsForm.get('idQtnHdr').patchValue(this.idHead);
        this.ajax.doPost(`${URL.GET_CONFIG}/`, this.configsForm.value).subscribe((result: ResponseData<Int0201ConfigVo>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // GET DATA HERE
            this.messageBar.successModal(result.message);
            // update form
            if (this.form.value.factorLevel == 5) {
              this.setupConfigs(result);
            } else if (this.form.value.factorLevel == 3) {
              this.setupConfigs3(result);
            }
          } else {
            this.messageBar.errorModal(result.message);
          }
        });
      }
    }
    this.configsSubmitted = false;
  }

  setupConfigs3(result: ResponseData<Int0201ConfigVo>) {
    console.log("setupConfigs3");
    this.configsForm = this.fb.group({
      high: [result.data.high, Validators.required],
      highColor: [result.data.highColor, Validators.required],
      highCondition: [result.data.highCondition, Validators.required],
      highEnd: [result.data.highEnd],
      highRating: [result.data.highRating, Validators.required],
      highStart: [result.data.highStart, Validators.required],
      id: [result.data.id, Validators.required],
      idQtnHdr: [result.data.idQtnHdr, Validators.required],
      low: [result.data.low, Validators.required],
      lowColor: [result.data.lowColor, Validators.required],
      lowCondition: [result.data.lowCondition, Validators.required],
      lowEnd: [result.data.lowEnd],
      lowRating: [result.data.lowRating, Validators.required],
      lowStart: [result.data.lowStart, Validators.required],
      medium: [result.data.medium, Validators.required],
      mediumColor: [result.data.mediumColor, Validators.required],
      mediumCondition: [result.data.mediumCondition, Validators.required],
      mediumEnd: [result.data.mediumEnd],
      mediumRating: [result.data.mediumRating, Validators.required],
      mediumStart: [result.data.mediumStart, Validators.required],
      createdBy: result.data.createdBy,
      createdDate: result.data.createdDate,
      updatedBy: result.data.updatedBy,
      updatedDate: result.data.updatedDate,
      isDeleted: [result.data.isDeleted, Validators.required],
      version: [result.data.version, Validators.required],

      verylow: [{ value: null, disabled: true }],
      verylowStart: [{ value: null, disabled: true }],
      verylowEnd: [{ value: null, disabled: true }],
      verylowRating: [{ value: null, disabled: true }],
      verylowColor: null,
      verylowCondition: [{ value: null, disabled: true }],
      veryhigh: [{ value: null, disabled: true }],
      veryhighStart: [{ value: null, disabled: true }],
      veryhighEnd: [{ value: null, disabled: true }],
      veryhighRating: [{ value: null, disabled: true }],
      veryhighColor: null,
      veryhighCondition: [{ value: null, disabled: true }],

      verylowConditionCon: [{ value: null, disabled: true }],
      lowConditionCon: [null, Validators.required],
      mediumConditionCon: [null, Validators.required],
      highConditionCon: [null, Validators.required],
      veryhighConditionCon: [{ value: null, disabled: true }],
    });

    let lowCondition = this.configsForm.value.lowCondition.split("|")
    let mediumCondition = this.configsForm.value.mediumCondition.split("|")
    let highCondition = this.configsForm.value.highCondition.split("|")
    this.configsForm.patchValue({
      lowCondition: lowCondition[0],
      lowConditionCon: lowCondition[1],
      mediumCondition: mediumCondition[0],
      mediumConditionCon: mediumCondition[1],
      highCondition: highCondition[0],
      highConditionCon: highCondition[1],
    })
  }

  setupConfigs(result: ResponseData<Int0201ConfigVo>) {
    console.log("setupConfigs5");
    this.configsForm = this.fb.group({
      high: [result.data.high, Validators.required],
      highColor: [result.data.highColor, Validators.required],
      highCondition: [result.data.highCondition, Validators.required],
      highEnd: [result.data.highEnd],
      highRating: [result.data.highRating, Validators.required],
      highStart: [result.data.highStart, Validators.required],
      id: [result.data.id, Validators.required],
      idQtnHdr: [result.data.idQtnHdr, Validators.required],
      low: [result.data.low, Validators.required],
      lowColor: [result.data.lowColor, Validators.required],
      lowCondition: [result.data.lowCondition, Validators.required],
      lowEnd: [result.data.lowEnd],
      lowRating: [result.data.lowRating, Validators.required],
      lowStart: [result.data.lowStart, Validators.required],
      medium: [result.data.medium, Validators.required],
      mediumColor: [result.data.mediumColor, Validators.required],
      mediumCondition: [result.data.mediumCondition, Validators.required],
      mediumEnd: [result.data.mediumEnd],
      mediumRating: [result.data.mediumRating, Validators.required],
      mediumStart: [result.data.mediumStart, Validators.required],
      createdBy: result.data.createdBy,
      createdDate: result.data.createdDate,
      updatedBy: result.data.updatedBy,
      updatedDate: result.data.updatedDate,
      isDeleted: [result.data.isDeleted, Validators.required],
      version: [result.data.version, Validators.required],

      verylow: [result.data.verylow, Validators.required],
      verylowStart: [result.data.verylowStart, Validators.required],
      verylowEnd: [result.data.verylowEnd],
      verylowRating: [result.data.verylowRating, Validators.required],
      verylowColor: [{ value: result.data.verylowColor, disabled: false }, Validators.required],
      verylowCondition: [result.data.verylowCondition, Validators.required],
      veryhigh: [result.data.veryhigh, Validators.required],
      veryhighStart: [result.data.veryhighStart, Validators.required],
      veryhighEnd: [result.data.veryhighEnd],
      veryhighRating: [result.data.veryhighRating, Validators.required],
      veryhighColor: [{ value: result.data.veryhighColor, disabled: false }, Validators.required],
      veryhighCondition: [result.data.veryhighCondition, Validators.required],

      verylowConditionCon: [null, Validators.required],
      lowConditionCon: [null, Validators.required],
      mediumConditionCon: [null, Validators.required],
      highConditionCon: [null, Validators.required],
      veryhighConditionCon: [null, Validators.required],
    });
    this.configsForm.patchValue({
      verylow: 'ต่ำมาก',
      veryhigh: 'สูงมาก',
      // verylowStart:result.data.verylowStart,
      // verylowEnd:result.data.verylowEnd,
      // verylowRating:result.data.verylowRating,
      // verylowColor:result.data.verylowColor,
      // verylowCondition:result.data.verylowCondition,
      // veryhighStart:result.data.veryhighStart,
      // veryhighEnd:result.data.veryhighEnd,
      // veryhighRating:result.data.veryhighRating,
      // veryhighColor:result.data.veryhighColor,
      // veryhighCondition:result.data.veryhighCondition,
    })

    let lowCondition = this.configsForm.value.lowCondition.split("|")
    let mediumCondition = this.configsForm.value.mediumCondition.split("|")
    let highCondition = this.configsForm.value.highCondition.split("|")
    this.configsForm.patchValue({
      lowCondition: lowCondition[0],
      lowConditionCon: lowCondition[1],
      mediumCondition: mediumCondition[0],
      mediumConditionCon: mediumCondition[1],
      highCondition: highCondition[0],
      highConditionCon: highCondition[1],
      // veryhighCondition: veryhighCondition[0],
      // veryhighConditionCon: veryhighCondition[1],
    })
    if (this.configsForm.value.verylowCondition) {
      let verylowCondition = this.configsForm.value.verylowCondition.split("|")
      this.configsForm.patchValue({
        verylowCondition: verylowCondition[0],
        verylowConditionCon: verylowCondition[1],
      })
    }
    if (this.configsForm.value.veryhighCondition) {
      let veryhighCondition = this.configsForm.value.veryhighCondition.split("|")
      this.configsForm.patchValue({
        veryhighCondition: veryhighCondition[0],
        veryhighConditionCon: veryhighCondition[1],
      })
    }
  }

  selectName() {
    // Query QtnSides in that year
    const id = this.form.get('qtnName').value;
    this.selfService.findQtnSideByName(id);
  }

  cancelQtnModal() {
    $('#deleteQtn').modal('show');
  }

  cancelQtn(e) {
    e.preventDefault();
    this.submittedDelete = true;
    if (this.deleteQtnForm.valid) {
      this.ajax.doDelete(`${URL.DELETE_QTN}/${this.idHead}/${this.deleteQtnForm.get('choices').value}`).subscribe((response: ResponseData<any>) => {
        if (response.status === 'SUCCESS') {
          this.messageBar.successModal(response.message);
          this.router.navigate(["/int02"]);
        } else {
          this.messageBar.errorModal(response.message);
        }
      }), error => {
        this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
      };
      this.submittedDelete = false;
      $('#deleteQtn').modal('hide');
    }
  }

  updateStatus(e, flag: string) {
    e.preventDefault();
    let count = 0;
    let st = "";
    if (this.qtnSides.length > 0) {
      this.qtnSides.forEach(obj => {
        if (obj.quantity == 0) {
          count++;
        }
      });
      if (count > 0) {
        st = "1"
      } else {
        st = "2"
      }
    } else {
      st = "1"
    }

    if (flag === 'C') {
      this.messageBar.comfirm((c) => {
        if (c) {
          /* update data */
          let flag = true;
          this.updateAll(flag);

          /* check string to update status */
          this.ajax.doGet(`${URL.UPDATE_STATUS}/${this.form.get('id').value}/${(parseInt(this.form.get('status').value) + 1).toString()}`).subscribe((response: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == response.status) {
              window.location.reload();
            } else {
              this.messageBar.errorModal(response.message);
            }
          }), error => {
            this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
          };
        }
      }, "ยืนยันการตรวจสอบแบบสอบถาม")
    } else if (flag === 'R') {

      this.ajax.doGet(`${URL.UPDATE_STATUS}/${this.form.get('id').value}/${st}`).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          window.location.reload();
        } else {
          this.messageBar.errorModal(response.message);
        }
      }), error => {
        this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
      };
    } else if (flag === 'CW') {
      this.messageBar.comfirm((c) => {
        if (c) {
          this.ajax.doGet(`${URL.UPDATE_STATUS}/${this.form.get('id').value}/${(parseInt(this.form.get('status').value) - 1).toString()}`).subscribe((response: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == response.status) {
              window.location.reload();
            } else {
              this.messageBar.errorModal(response.message);
            }
          }), error => {
            this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
          };
        }
      }, "ยืนยันการยกเลิกรอส่งแบบสอบถาม")
    }
  }

  toggleDropdown() {
    setTimeout(() => {
      $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
    }, 200);
    // this.form.reset();
    this.qtnSides = [];
  }

  statusBtn(btn: string, status: string) {
    let statusCheck = false;
    if (btn === 'UPDATE' || btn === 'CONFIG' || btn === 'CANCEL' || btn === 'ADD') {
      if (status === '1' || status === '2') {
        return statusCheck = true;
      }
    } else if ('CONFIRM') {
      if (status === '2') {
        return statusCheck = true;
      }
    }
    return statusCheck;
  }

  inputKeypress(control: string, minControl: string = 'lowEnd', maxControl: string = 'lowEnd') {

    let controller: FormControl = this.configsForm.get(control) as FormControl;
    let minForm: FormControl = this.configsForm.get(minControl) as FormControl;
    let maxForm: FormControl = this.configsForm.get(maxControl) as FormControl;
    controller.setValidators([Validators.max(100), Validators.min(0)]);
    this.configsForm.updateValueAndValidity();
  }

  invalidControlConfig(control: string) {
    return this.configsForm.get(control).invalid && this.configsForm.get(control).touched;
  }

  invalidControl(control: string) {
    return this.form.get(control).invalid && (this.form.get(control).touched || this.submitted);
  }

  invalidChildControl(control: string) {
    return this.formChild.get(control).invalid && (this.formChild.get(control).touched || this.submittedChild);
  }

  invalidDeleteQtn(control: string) {
    return this.deleteQtnForm.get(control).invalid && (this.deleteQtnForm.get(control).touched || this.submittedDelete);
  }

}
