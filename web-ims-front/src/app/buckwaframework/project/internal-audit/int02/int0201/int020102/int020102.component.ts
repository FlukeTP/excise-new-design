import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Department } from '../int0201vo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { IaQuestionnaireHdr } from '../../int02.models';

declare var $: any;

const URL = {
     POST_SECTOR_LIST: "preferences/department/sector-list",
     POST_AREA_LIST: "preferences/department/area-list",
     SEND_QTN_FORM: "ia/int0201/send-qtn-form",
     QTN_HDR: "ia/int02"
}

@Component({
     selector: 'app-int020102',
     templateUrl: './int020102.component.html',
     styleUrls: ['./int020102.component.css']
})
export class Int020102Component {

     breadcrumb: BreadCrumb[] = [
          { label: "ตรวจสอบภายใน", route: "#" },
          { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
          { label: "รายละเอียดแบบสอบถามระบบการควบคุมภายใน", route: "#" },
          { label: "ดำเนินการส่งแบบสอบถาม", route: "#" },
     ];
     saving: boolean = false;
     form: FormGroup;
     chkAll: boolean = true;
     excises: Department[] = [];
     submitted: boolean = false;
     id: string = "";
     status: String
     state: string = "";
     constructor(
          private ajaxService: AjaxService,
          private fb: FormBuilder,
          private msg: MessageBarService,
          private location: Location,
          private route: ActivatedRoute,
          private router: Router
     ) {
          this.form = this.fb.group({
               startDate: ['', Validators.required],
               endDate: ['', Validators.required],
               status: [''],
               toDepartment: [''],
          });
     }

     ngOnInit() {
          // Get From URL QUERY
          this.id = this.route.snapshot.queryParams["id"] || "";
          if (this.id) {
               this.ajaxService.doGet(`${URL.QTN_HDR}/${this.id}`).subscribe((result: ResponseData<IaQuestionnaireHdr>) => {
                    if (MessageService.MSG.SUCCESS == result.status) {
                         console.log("findQtnHead: ", result);
                         this.form.get('status').patchValue(result.data.status);
                         this.form.get('toDepartment').patchValue(result.data.toDepartment);

                         /* default radio box */
                         this.sectorList(this.form.get('toDepartment').value);
                    } else {
                         this.msg.errorModal(result.message);
                    }
               });
          }
          this.status = this.route.snapshot.queryParams["status"]
          console.log(" ID => ", this.id);
     }

     ngAfterViewInit() {
          $('#date1').calendar({
               endCalendar: $('#date2'),
               type: 'date',
               text: TextDateTH,
               formatter: formatter(),
               onChange: (date, text) => {
                    this.form.get('startDate').patchValue(text);
               }
          }).css('width', '100%');
          $('#date2').calendar({
               startCalendar: $('#date1'),
               type: 'date',
               text: TextDateTH,
               formatter: formatter(),
               onChange: (date, text) => {
                    this.form.get('endDate').patchValue(text);
               }
          }).css('width', '100%');
     }

     checkAll(event) {
          if (event.target.checked) {
               this.chkAll = true;
               console.log(this.excises);
               if (this.state === 'only-area') {
                    for (let i = 0; i < this.excises.length; i++) {
                         this.excises[i].chckAll = true;
                         this.excises[i].checked = false;
                         $(`#chkSectorAll${i}`).prop('checked', true);
                         $(`#chkSector${i}`).prop('checked', false);
                         if (this.excises[i].excises.length > 0) {
                              for (let j = 0; j < this.excises[i].excises.length; j++) {
                                   this.excises[i].excises[j].checked = true;
                                   $(`#chkArea${i}${j}`).prop('checked', true);
                              }
                         }
                    }
               } else {
                    for (let i = 0; i < this.excises.length; i++) {
                         this.excises[i].chckAll = true;
                         this.excises[i].checked = true;
                         $(`#chkSectorAll${i}`).prop('checked', true);
                         $(`#chkSector${i}`).prop('checked', true);
                         if (this.excises[i].excises.length > 0) {
                              for (let j = 0; j < this.excises[i].excises.length; j++) {
                                   this.excises[i].excises[j].checked = true;
                                   $(`#chkArea${i}${j}`).prop('checked', true);
                              }
                         }
                    }
               }
          } else {
               this.chkAll = false;
               for (let i = 0; i < this.excises.length; i++) {
                    this.excises[i].chckAll = false;
                    this.excises[i].checked = false;
                    $(`#chkSectorAll${i}`).prop('checked', false);
                    $(`#chkSector${i}`).prop('checked', false);
                    if (this.excises[i].excises.length > 0) {
                         for (let j = 0; j < this.excises[i].excises.length; j++) {
                              this.excises[i].excises[j].checked = false;
                              $(`#chkArea${i}${j}`).prop('checked', false);
                         }
                    }
               }
          }
     }

     checkSectorAll(event, i: number) {
          if (event.target.checked) {
               this.excises[i].chckAll = true;
               this.excises[i].checked = true;
               $(`#chkSectorAll${i}`).prop('checked', true);
               $(`#chkSector${i}`).prop('checked', true);
               for (let j = 0; j < this.excises[i].excises.length; j++) {
                    this.excises[i].excises[j].checked = true;
                    $(`#chkArea${i}${j}`).prop('checked', true);
               }
               this.chkAll = this.checkAllMatch(this.excises, 'chkAll');
          } else {
               this.excises[i].chckAll = false;
               this.excises[i].checked = false;
               $(`#chkSectorAll${i}`).prop('checked', false);
               $(`#chkSector${i}`).prop('checked', false);
               for (let j = 0; j < this.excises[i].excises.length; j++) {
                    this.excises[i].excises[j].checked = false;
                    $(`#chkArea${i}${j}`).prop('checked', false);
               }
               this.chkAll = this.checkAllMatch(this.excises, 'chkAll');
          }
     }

     checkSector(event, i: number) {
          if (event.target.checked) {
               this.excises[i].checked = true;
               this.excises[i].chckAll = this.checkAllMatch(this.excises[i].excises, 'chkSectorAll');
               if (this.excises[i].chckAll && this.excises[i].checked) {
                    $(`#chkSectorAll${i}`).prop('checked', true);
               } else {
                    $(`#chkSectorAll${i}`).prop('checked', false);
               }
               this.chkAll = this.checkAllMatch(this.excises, 'chkAll');
          } else {
               this.excises[i].checked = false;
               this.excises[i].chckAll = this.checkAllMatch(this.excises[i].excises, 'chkSectorAll');
               if (this.excises[i].chckAll && this.excises[i].checked) {
                    $(`#chkSectorAll${i}`).prop('checked', true);
               } else {
                    $(`#chkSectorAll${i}`).prop('checked', false);
               }
               this.chkAll = this.checkAllMatch(this.excises, 'chkAll');
          }
     }

     checkArea(event, i: number, j: number) {
          if (event.target.checked) {
               this.excises[i].excises[j].checked = true;
               this.excises[i].chckAll = this.checkAllMatch(this.excises[i].excises, 'chkSectorAll');
               if (this.excises[i].chckAll && this.excises[i].checked) {
                    $(`#chkSectorAll${i}`).prop('checked', true);
               } else {
                    $(`#chkSectorAll${i}`).prop('checked', false);
               }
               this.chkAll = this.checkAllMatch(this.excises, 'chkAll', 'chckAll');
          } else {
               this.excises[i].excises[j].checked = false;
               this.excises[i].chckAll = this.checkAllMatch(this.excises[i].excises, 'chkSectorAll');
               if (this.excises[i].chckAll && this.excises[i].checked) {
                    $(`#chkSectorAll${i}`).prop('checked', true);
               } else {
                    $(`#chkSectorAll${i}`).prop('checked', false);
               }
               this.chkAll = this.checkAllMatch(this.excises, 'chkAll', 'chckAll');
          }
     }

     checkAllMatch(data: Department[], name: string, field: string = 'checked') {
          let count: number = 0;
          let flag: boolean = false;
          for (let i = 0; i < data.length; i++) {
               if (data[i][field]) {
                    count++;
               }
          }
          if (count == data.length) {
               flag = true;
               $(`#${name}`).prop('checked', true);
          } else {
               flag = false;
               $(`#${name}`).prop('checked', false);
          }
          return flag;
     }

     onExciseChange(event) {
          const value: string = this.form.get('toDepartment').value;
          switch (value) {
               case "all":
                    this.chkAll = true;
                    this.sectorList(value);
                    setTimeout(() => $('#chkAll').prop('checked', true), 200);
                    // console.log("HELLO WORLD : ALL");
                    break;
               case "only-main":
                    this.chkAll = false;
                    this.sectorList(value);
                    setTimeout(() => $('#chkAll').prop('checked', false), 200);
                    // console.log("HELLO WORLD : ONLY_MAIN");
                    break;
               case "only-sector":
                    this.chkAll = false;
                    this.sectorList(value);
                    setTimeout(() => $('#chkAll').prop('checked', false), 200);
                    // console.log("HELLO WORLD : ONLY_SECTOR");
                    break;
               case "only-area":
                    this.chkAll = false;
                    this.sectorList(value);
                    setTimeout(() => $('#chkAll').prop('checked', false), 200);
                    // console.log("HELLO WORLD : ONLY_AREA");
                    break;
               case "custom":
                    this.chkAll = true;
                    this.sectorList(value);
                    setTimeout(() => $('#chkAll').prop('checked', true), 200);
                    // console.log("HELLO WORLD : CUSTOM");
                    break;
          }
     }

     sectorList(event: string) {
          this.state = event;
          this.ajaxService.doPost(URL.POST_SECTOR_LIST, {}).subscribe((response: ResponseData<Department[]>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    /* divide sector */
                    if (event === 'only-main') {
                         this.excises = response.data.filter(obj => obj.officeCode.substring(0, 2) === "00");
                    } else if (event === 'only-sector' || event === 'only-area') {
                         this.excises = response.data.filter(obj => obj.officeCode.substring(0, 2) !== "00");
                    } else {
                         this.excises = response.data;
                    }

                    this.chkAll = true;
                    for (let i = 0; i < this.excises.length; i++) {
                         this.excises[i].excises = [];
                         if (event == "only-main") {
                              this.excises[i].checked = false;
                              this.excises[i].chckAll = false;
                              setTimeout(() => {
                                   $(`#chkSector${i}`).prop('checked', false);
                                   $(`#chkSectorAll${i}`).prop('checked', false);
                              }, 200);
                              if (this.excises[i].officeCode.substring(0, 2) == "00") {
                                   console.log(this.excises[i].officeCode);
                                   this.excises[i].checked = true;
                                   this.excises[i].chckAll = true;
                                   setTimeout(() => {
                                        $(`#chkSector${i}`).prop('checked', true);
                                        $(`#chkSectorAll${i}`).prop('checked', true);
                                   }, 200);
                              }
                         } else {
                              if (event != "only-sector") {
                                   this.excises[i].chckAll = true;
                                   setTimeout(() => $(`#chkSectorAll${i}`).prop('checked', true), 200);
                              }
                              if (event != "only-area") {
                                   this.excises[i].checked = true;
                                   setTimeout(() => $(`#chkSector${i}`).prop('checked', true), 200);
                              } else {
                                   this.excises[i].checked = false;
                                   setTimeout(() => {
                                        $(`#chkSectorAll${i}`).prop('checked', false);
                                        $(`#chkSector${i}`).prop('checked', false);
                                   }, 200);
                              }
                              if (event == "only-sector" || event == "only-area") {
                                   if (this.excises[i].officeCode.substring(0, 2) == "00") {
                                        this.excises[i].checked = false;
                                        setTimeout(() => $(`#chkSector${i}`).prop('checked', false), 200);
                                   }
                              }
                         }
                         if (event != "only-sector") {
                              this.ajaxService.doPost(`${URL.POST_AREA_LIST}/${this.excises[i].officeCode}`, {}).subscribe((responses: ResponseData<Department[]>) => {
                                   if (MessageService.MSG.SUCCESS == responses.status) {
                                        this.excises[i].excises = responses.data;
                                        /* divide area */
                                        // if (event === 'only-area') {
                                        //      this.excises[i].excises = responses.data.filter(obj => obj.officeCode.substring(0, 2) !== "00")
                                        // } else {
                                        //      this.excises[i].excises = responses.data;
                                        // }

                                        for (let j = 0; j < this.excises[i].excises.length; j++) {
                                             if (event == "only-main") {
                                                  if (this.excises[i].excises[j].officeCode.substring(0, 2) == "00") {
                                                       this.excises[i].excises[j].chckAll = true;
                                                       this.excises[i].excises[j].checked = true;
                                                       setTimeout(() => $(`#chkArea${i}${j}`).prop('checked', true), 200);
                                                  }
                                             } else {
                                                  this.excises[i].excises[j].chckAll = true;
                                                  this.excises[i].excises[j].checked = true;
                                                  if (event == "only-area") {
                                                       if (this.excises[i].excises[j].officeCode.substring(0, 2) == "00") {
                                                            this.excises[i].excises[j].chckAll = false;
                                                            this.excises[i].excises[j].checked = false;
                                                            setTimeout(() => $(`#chkArea${i}${j}`).prop('checked', false), 200);
                                                       }
                                                  }
                                             }
                                             if (event == 'custom') {
                                                  setTimeout(() => {
                                                       $('.ui.checkbox input').removeAttr("disabled");
                                                       $('.ui.checkbox').removeAttr("disabled");
                                                  }, 200);
                                             }
                                        }
                                   } else {
                                        this.msg.errorModal(responses.message);
                                   }
                              });
                         }
                    }
               } else {
                    this.msg.errorModal(response.message);
               }
          });
     }

     save() {
          this.saving = true;
          this.submitted = true;
          console.log("DEPARTMENT => ", this.excises);
          let exciseCodes: string[] = [];
          if (this.excises.length > 0) {
               for (let i = 0; i < this.excises.length; i++) {
                    if (this.excises[i].checked) {
                         exciseCodes.push(this.excises[i].officeCode);
                    }
                    if (this.excises[i].excises && this.excises[i].excises.length > 0) {
                         for (let j = 0; j < this.excises[i].excises.length; j++) {
                              if (this.excises[i].excises[j].checked) {
                                   exciseCodes.push(this.excises[i].excises[j].officeCode);
                              }
                         }
                    }
               }
          }
          if (exciseCodes.length > 0 && this.form.valid) {
               console.log("EXCISE_CODE => ", exciseCodes);
               console.log("FORM => ", this.form.value);
               this.submitted = false;
               /* set request */
               let REQUEST = {};
               REQUEST = {
                    startDateSend: (<HTMLInputElement>document.getElementById("startDateSend")).value,
                    endDateSend: (<HTMLInputElement>document.getElementById("endDateSend")).value,
                    idHead: this.id,
                    exciseCodes: exciseCodes
               };
               this.ajaxService.doPost(URL.SEND_QTN_FORM, REQUEST).subscribe((response: ResponseData<any>) => {
                    if (response.status === 'SUCCESS') {
                         this.msg.successModal("ส่งแบบสอบถามสำเร็จ", "สำเร็จ", event => {
                              if (event) {
                                   this.saving = false;
                                   setTimeout(() => {
                                        this.router.navigate(["/int02/04"]);
                                   }, 200);
                              }
                         });
                    } else {
                         this.saving = false;
                         this.msg.errorModal(response.message);
                    }
               });
          } else {
               if (this.form.invalid) {
                    this.msg.errorModal("กรุณาเลือกวันที่", "เกิดข้อผิดพลาด", () => {
                         // AFTER CLICKED
                    });
                    this.saving = false;
                    return;
               } else if (exciseCodes.length == 0) {
                    this.msg.errorModal("กรุณาเลือกสรรพสามิตอย่างน้อย 1 ที่", "เกิดข้อผิดพลาด", () => {
                         // AFTER CLICKED
                    });
                    this.saving = false;
                    return;
               }
          }
     }

     cancel() {
          this.location.back();
     }

     invalid(control: string) {
          return this.form.get(control).invalid && (this.form.get(control).touched || this.submitted);
     }

     get disabledOn() {
          return this.form.get('toDepartment').value !== 'custom';
     }

}