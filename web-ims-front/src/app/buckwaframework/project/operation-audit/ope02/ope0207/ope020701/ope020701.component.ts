import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb, License, ResponseData } from 'models/index';
import * as moment from 'moment';
import { AjaxService, MessageBarService, MessageService, ProvinceService } from 'services/index';
import { Amphures, Districts, Province, Zipcodes } from 'services/province.service';
import { Ope020701CustomerVo } from './ope020701vo.model';

declare var $: any;

const URL = {
     GET_FIND: "oa/02/07/find/customerLicense",
     POST_SAVE: "oa/02/07/save/customerLicense",
     POST_UPDATE: "oa/02/07/update/customerLicense",
     GET_CUSTOMER: "oa/02/07/find/customer",
     GET_CUSTOMER_LIST: "oa/02/07/find/customers"
}

@Component({
     selector: 'app-ope02-07-01',
     templateUrl: 'ope020701.component.html',
     styleUrls: ['ope020701.component.css']
})
export class Ope020701Component {
     breadcrumb: BreadCrumb[] = [
          { label: "ตรวจปฏิบัติการ", route: "#" },
          { label: "น้ำมันหล่อลื่น", route: "#" },
          { label: "ข้อมูลผู้ได้รับอนุญาต (ผู้ใช้/ตัวแทน) น้ำมันหล่อลื่น", route: "#" },
          { label: "เพิ่มข้อมูลผู้ได้รับอนุญาต (ผู้ใช้/ตัวแทน) น้ำมันหล่อลื่น", route: "#" },
     ];
     // Message
     name_approve: string = "ผู้ขออนุญาต";
     name_license: string = "ข้อมูลใบอนุญาต";
     info_license: string = "มีความประสงค์";
     // Form
     form: FormGroup = new FormGroup({});
     details: FormArray = new FormArray([]);
     deletes: FormArray = new FormArray([]);
     submitted: boolean = false;
     // Query
     id: string = "";
     state: string = "";
     loading: boolean = false;
     // Lists
     provinces: Province[] = [];
     amphures: Amphures[] = [];
     districts: Districts[] = [];
     zipcodes: Zipcodes[] = [];
     customers: Ope020701CustomerVo[] = [];

     constructor(
          private fb: FormBuilder,
          private ajax: AjaxService,
          private msg: MessageBarService,
          private router: Router,
          private route: ActivatedRoute,
          private provinceService: ProvinceService
     ) {
          this.form = this.fb.group({
               oaCuslicenseId: [null],
               name: ['', Validators.required],
               companyName: ['', Validators.required],
               identifyType: ['P', Validators.required],
               identifyNo: ['', Validators.required],
               licenseType: ['B', Validators.required],
               licenseNo: ['', Validators.required],
               licenseDate: [new Date()],
               licenseTypeFor: [null],
               licenseTypeDesp: [null],
               bankGuarantee: ['N', Validators.required],
               bankGuaranteeNo: [null],
               bankGuaranteeDate: [null],
               oldLicenseYear: ['2562'],
               operateName: [null, Validators.required],
               operateRemark: [null, Validators.required],
               startDate: [null, Validators.required],
               endDate: [null, Validators.required],
               offCode: [null],
               receiveDate: [null, Validators.required],
               receiveNo: [null, Validators.required],
               approveName: [null],
               approve: [null],
               oldCustomer: ['N', Validators.required],
               mobile: [null, Validators.required],
               warehouseAddress: ['', Validators.required],
               addressNo: ['', Validators.required],
               district: ['', Validators.required],
               amphoe: ['', Validators.required],
               province: ['', Validators.required],
               postcode: ['', Validators.required],
               details: this.fb.array([]),
               deletes: this.fb.array([]),
               customer: ['']
          });
          this.provinceService.getProvincesJSON().subscribe(data => {
               this.provinces = data;
          });
          this.addLicenseDetail();
     }

     ngOnInit() {
          this.id = this.route.snapshot.queryParams["id"] || "";
          this.state = this.route.snapshot.queryParams["state"] || "";
          if (this.id) {
               // Query data
               this.loading = true;
               this.find();
          }
     }

     ngAfterViewInit() {
          $('#date').calendar({
               type: 'date',
               initialDate: new Date(),
               text: TextDateTH,
               formatter: formatter('วดป'),
               onChange: (date, text) => {
                    this.form.get('bankGuaranteeDate').patchValue(date);
               }
          });
          $('#receiveDate').calendar({
               type: 'date',
               initialDate: new Date(),
               text: TextDateTH,
               formatter: formatter('วดป'),
               onChange: (date, text) => {
                    this.form.get('receiveDate').patchValue(date);
               }
          });
          $('#startDate').calendar({
               type: 'date',
               initialDate: new Date(),
               text: TextDateTH,
               formatter: formatter('วดป'),
               onChange: (date, text) => {
                    this.form.get('startDate').patchValue(date);
               }
          });
          $('#endDate').calendar({
               type: 'date',
               initialDate: new Date(),
               text: TextDateTH,
               formatter: formatter('วดป'),
               onChange: (date, text) => {
                    this.form.get('endDate').patchValue(date);
               }
          });
          $('#province').dropdown().css('width', '100%');
          $('#amphoe').dropdown().css('width', '100%');
          $('#district').dropdown().css('width', '100%');
     }

     addLicenseDetail() {
          this.details = this.form.get('details') as FormArray;
          this.details.push(this.fb.group({
               oaCuslicenseDtlId: [null],
               oaCuslicenseId: [null],
               seq: [null],
               name: ['', Validators.required],
               type: ['', Validators.required],
               amount: [null, Validators.required],
               licenseNo: [this.form.get('licenseNo').value],
          }));
     }

     delLicenseDetail(id: number, index: number) {
          if (id) {
               this.details = this.form.get('details') as FormArray;
               this.deletes = this.form.get('deletes') as FormArray;
               const data: string = this.details.at(index).get('amount').value.replace(/,/g, '');
               this.details.at(index).get('amount').patchValue(parseFloat(data));
               this.deletes.push(this.details.at(index));
               this.details.removeAt(index);
          } else {
               this.details = this.form.get('details') as FormArray;
               this.details.removeAt(index);
          }
     }

     save() {
          let data: License = this.form.value;
          this.submitted = true;
          if (this.form.valid) {
               let data: License = this.form.value;
               if (AjaxService.isDebug) {
                    console.log("SAVE => ", data);
               }
               const { addressNo, district, amphoe, province, postcode } = this.form.value;
               data.address = `เลขที่${addressNo.trim()} ต.${district.trim()} อ.${amphoe.trim()} จ.${province.trim()} ${postcode.trim()}`;
               if (this.form.value.details && this.form.value.details.length > 0) {
                    for (let i = 0; i < this.form.value.details.length; i++) {
                         data.details[i].amount = parseFloat(this.form.value.details[i].amount.toString().replace(/,/g, ''));
                    }
               }
               this.ajax.doPost(URL.POST_SAVE, data).subscribe((response: ResponseData<License>) => {
                    if (MessageService.MSG.SUCCESS == response.status) {
                         this.msg.successModal(response.message, "สำเร็จ", event => {
                              if (event) {
                                   // this.details = this.form.get('details') as FormArray;
                                   // for (let i = 0; i < response.data.details.length; i++) {
                                   //      if (this.details.at(i)) {
                                   //           this.details.at(i).patchValue(response.data.details[i]);
                                   //           this.details.at(i).get('amount').patchValue(new DecimalFormatPipe().transform(response.data.details[i].amount.toString(), "###,###"));
                                   //      } else {
                                   //           this.addLicenseDetail();
                                   //           this.details.at(i).patchValue(response.data.details[i]);
                                   //           this.details.at(i).get('amount').patchValue(new DecimalFormatPipe().transform(response.data.details[i].amount.toString(), "###,###"));
                                   //      }
                                   // }
                                   // const province: string = response.data.address.split(" ")[3].replace("จ.", "").trim();
                                   // const amphoe: string = response.data.address.split(" ")[2].replace("อ.", "").trim();
                                   // const district: string = response.data.address.split(" ")[1].replace("ต.", "").trim();
                                   // this.form.patchValue({
                                   //      oaCuslicenseId: response.data.oaCuslicenseId,
                                   //      name: response.data.name,
                                   //      companyName: response.data.companyName,
                                   //      identifyType: response.data.identifyType,
                                   //      identifyNo: response.data.identifyNo,
                                   //      licenseType: response.data.licenseType,
                                   //      licenseNo: response.data.licenseNo,
                                   //      licenseDate: response.data.licenseDate,
                                   //      licenseTypeFor: response.data.licenseTypeFor,
                                   //      licenseTypeDesp: response.data.licenseTypeDesp,
                                   //      bankGuarantee: response.data.bankGuarantee,
                                   //      bankGuaranteeNo: response.data.bankGuaranteeNo,
                                   //      bankGuaranteeDate: response.data.bankGuaranteeDate,
                                   //      oldLicenseYear: response.data.oldLicenseYear,
                                   //      operateName: response.data.operateName,
                                   //      operateRemark: response.data.operateRemark,
                                   //      startDate: response.data.startDate,
                                   //      endDate: response.data.endDate,
                                   //      offCode: response.data.offCode,
                                   //      receiveDate: response.data.receiveDate,
                                   //      receiveNo: response.data.receiveNo,
                                   //      approveName: response.data.approveName,
                                   //      approve: response.data.approve,
                                   //      oldCustomer: response.data.oldCustomer,
                                   //      mobile: response.data.mobile,
                                   //      warehouseAddress: response.data.warehouseAddress,
                                   //      addressNo: response.data.address.split(" ")[0].replace("เลขที่", "").trim(),
                                   //      district: district,
                                   //      amphoe: amphoe,
                                   //      province: province,
                                   //      postcode: response.data.address.split(" ")[4].trim(),
                                   // });
                                   // if (response.data.bankGuaranteeDate) {
                                   //      const date: Date = new Date(response.data.bankGuaranteeDate);
                                   //      $('#date').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   // } else {
                                   //      $('#date').calendar('clear');
                                   // }
                                   // if (response.data.receiveDate) {
                                   //      const date: Date = new Date(response.data.receiveDate);
                                   //      $('#receiveDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   // } else {
                                   //      $('#receiveDate').calendar('clear');
                                   // }
                                   // if (response.data.startDate) {
                                   //      const date: Date = new Date(response.data.startDate);
                                   //      $('#startDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   // } else {
                                   //      $('#startDate').calendar('clear');
                                   // }
                                   // if (response.data.endDate) {
                                   //      const date: Date = new Date(response.data.endDate);
                                   //      $('#endDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   // } else {
                                   //      $('#endDate').calendar('clear');
                                   // }
                                   // this.breadcrumb[3].label = "แก้ไขข้อมูลผู้ได้รับอนุญาต (ผู้ใช้/ตัวแทน) น้ำมันหล่อลื่น";
                                   // this.id = response.data.oaCuslicenseId.toString();
                                   // this.state = "EDIT";
                                   // setTimeout(() => {
                                   //      this.router.navigate(['/ope02/07/01'], {
                                   //           queryParams: {
                                   //                id: this.id,
                                   //                state: "EDIT"
                                   //           }
                                   //      });
                                   // }, 200);

                                   this.router.navigate(['/ope02/07']);
                              }
                         });
                    } else {
                         this.msg.errorModal(response.message);
                    }
               });
          }
     }

     update() {
          this.submitted = true;
          if (this.form.valid) {
               let data: License = this.form.value;
               if (AjaxService.isDebug) {
                    console.log("UPDATE => ", data);
               }
               const { addressNo, district, amphoe, province, postcode } = this.form.value;
               data.address = `เลขที่${addressNo.trim()} ต.${district.trim()} อ.${amphoe.trim()} จ.${province.trim()} ${postcode.trim()}`;
               if (this.form.value.details && this.form.value.details.length > 0) {
                    for (let i = 0; i < this.form.value.details.length; i++) {
                         data.details[i].amount = parseFloat(this.form.value.details[i].amount.toString().replace(/,/g, ''));
                    }
               }
               this.ajax.doPut(URL.POST_UPDATE, data).subscribe((response: ResponseData<License>) => {
                    if (MessageService.MSG.SUCCESS == response.status) {
                         this.msg.successModal(response.message, "สำเร็จ", event => {
                              if (event) {
                                   this.details = this.form.get('details') as FormArray;
                                   for (let i = 0; i < response.data.details.length; i++) {
                                        if (this.details.at(i)) {
                                             this.details.at(i).patchValue(response.data.details[i]);
                                             this.details.at(i).get('amount').patchValue(new DecimalFormatPipe().transform(response.data.details[i].amount.toString(), "###,###"));
                                        } else {
                                             this.addLicenseDetail();
                                             this.details.at(i).patchValue(response.data.details[i]);
                                             this.details.at(i).get('amount').patchValue(new DecimalFormatPipe().transform(response.data.details[i].amount.toString(), "###,###"));
                                        }
                                   }
                                   const province: string = response.data.address.split(" ")[3].replace("จ.", "").trim();
                                   const amphoe: string = response.data.address.split(" ")[2].replace("อ.", "").trim();
                                   const district: string = response.data.address.split(" ")[1].replace("ต.", "").trim();
                                   this.form.patchValue({
                                        oaCuslicenseId: response.data.oaCuslicenseId,
                                        name: response.data.name,
                                        companyName: response.data.companyName,
                                        identifyType: response.data.identifyType,
                                        identifyNo: response.data.identifyNo,
                                        licenseType: response.data.licenseType,
                                        licenseNo: response.data.licenseNo,
                                        licenseDate: response.data.licenseDate,
                                        licenseTypeFor: response.data.licenseTypeFor,
                                        licenseTypeDesp: response.data.licenseTypeDesp,
                                        bankGuarantee: response.data.bankGuarantee,
                                        bankGuaranteeNo: response.data.bankGuaranteeNo,
                                        bankGuaranteeDate: response.data.bankGuaranteeDate,
                                        oldLicenseYear: response.data.oldLicenseYear,
                                        operateName: response.data.operateName,
                                        operateRemark: response.data.operateRemark,
                                        startDate: response.data.startDate,
                                        endDate: response.data.endDate,
                                        offCode: response.data.offCode,
                                        receiveDate: response.data.receiveDate,
                                        receiveNo: response.data.receiveNo,
                                        approveName: response.data.approveName,
                                        approve: response.data.approve,
                                        oldCustomer: response.data.oldCustomer,
                                        mobile: response.data.mobile,
                                        warehouseAddress: response.data.warehouseAddress,
                                        addressNo: response.data.address.split(" ")[0].replace("เลขที่", "").trim(),
                                        district: district,
                                        amphoe: amphoe,
                                        province: province,
                                        postcode: response.data.address.split(" ")[4].trim(),
                                   });
                                   if (response.data.bankGuaranteeDate) {
                                        const date: Date = new Date(response.data.bankGuaranteeDate);
                                        $('#date').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   } else {
                                        $('#date').calendar('clear');
                                   }
                                   if (response.data.receiveDate) {
                                        const date: Date = new Date(response.data.receiveDate);
                                        $('#receiveDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   } else {
                                        $('#receiveDate').calendar('clear');
                                   }
                                   if (response.data.startDate) {
                                        const date: Date = new Date(response.data.startDate);
                                        $('#startDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   } else {
                                        $('#startDate').calendar('clear');
                                   }
                                   if (response.data.endDate) {
                                        const date: Date = new Date(response.data.endDate);
                                        $('#endDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                                   } else {
                                        $('#endDate').calendar('clear');
                                   }
                                   this.breadcrumb[3].label = "แก้ไขข้อมูลผู้ได้รับอนุญาต (ผู้ใช้/ตัวแทน) น้ำมันหล่อลื่น";
                              }
                         });
                    } else {
                         this.msg.errorModal(response.message);
                    }
               });
          }
     }

     find() {
          this.ajax.doGet(`${URL.GET_FIND}/${this.id}`).subscribe((response: ResponseData<License>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    this.details = this.form.get('details') as FormArray;
                    for (let i = 0; i < response.data.details.length; i++) {
                         if (this.details.at(i)) {
                              this.details.at(i).patchValue(response.data.details[i]);
                              this.details.at(i).get('amount').patchValue(new DecimalFormatPipe().transform(response.data.details[i].amount.toString(), "###,###"));
                         } else {
                              this.addLicenseDetail();
                              this.details.at(i).patchValue(response.data.details[i]);
                              this.details.at(i).get('amount').patchValue(new DecimalFormatPipe().transform(response.data.details[i].amount.toString(), "###,###"));
                         }
                    }
                    const province: string = response.data.address.split(" ")[3].replace("จ.", "").trim();
                    const amphoe: string = response.data.address.split(" ")[2].replace("อ.", "").trim();
                    const district: string = response.data.address.split(" ")[1].replace("ต.", "").trim();
                    this.form.patchValue({
                         oaCuslicenseId: response.data.oaCuslicenseId,
                         name: response.data.name,
                         companyName: response.data.companyName,
                         identifyType: response.data.identifyType,
                         identifyNo: response.data.identifyNo,
                         licenseType: response.data.licenseType,
                         licenseNo: response.data.licenseNo,
                         licenseDate: response.data.licenseDate,
                         licenseTypeFor: response.data.licenseTypeFor,
                         licenseTypeDesp: response.data.licenseTypeDesp,
                         bankGuarantee: response.data.bankGuarantee,
                         bankGuaranteeNo: response.data.bankGuaranteeNo,
                         bankGuaranteeDate: response.data.bankGuaranteeDate,
                         oldLicenseYear: response.data.oldLicenseYear,
                         operateName: response.data.operateName,
                         operateRemark: response.data.operateRemark,
                         startDate: response.data.startDate,
                         endDate: response.data.endDate,
                         offCode: response.data.offCode,
                         receiveDate: response.data.receiveDate,
                         receiveNo: response.data.receiveNo,
                         approveName: response.data.approveName,
                         approve: response.data.approve,
                         oldCustomer: response.data.oldCustomer,
                         mobile: response.data.mobile,
                         warehouseAddress: response.data.warehouseAddress,
                         addressNo: response.data.address.split(" ")[0].replace("เลขที่", "").trim(),
                         district: district,
                         amphoe: amphoe,
                         province: province,
                         postcode: response.data.address.split(" ")[4].trim(),
                    });
                    if (response.data.bankGuaranteeDate) {
                         const date: Date = new Date(response.data.bankGuaranteeDate);
                         $('#date').calendar('set date', moment(date).add(7, 'hours').toDate());
                    } else {
                         $('#date').calendar('clear');
                    }
                    if (response.data.receiveDate) {
                         const date: Date = new Date(response.data.receiveDate);
                         $('#receiveDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                    } else {
                         $('#receiveDate').calendar('clear');
                    }
                    if (response.data.startDate) {
                         const date: Date = new Date(response.data.startDate);
                         $('#startDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                    } else {
                         $('#startDate').calendar('clear');
                    }
                    if (response.data.endDate) {
                         const date: Date = new Date(response.data.endDate);
                         $('#endDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                    } else {
                         $('#endDate').calendar('clear');
                    }
                    if (this.stateView) {
                         this.breadcrumb[3].label = "รายละเอียดข้อมูลผู้ได้รับอนุญาต (ผู้ใช้/ตัวแทน) น้ำมันหล่อลื่น";
                    } else {
                         this.breadcrumb[3].label = "แก้ไขข้อมูลผู้ได้รับอนุญาต (ผู้ใช้/ตัวแทน) น้ำมันหล่อลื่น";
                    }
                    setTimeout(() => {
                         $('#province').dropdown('set selected', province);
                         this.provinceChange();
                         setTimeout(() => {
                              $('#amphoe').dropdown('set selected', amphoe);
                              this.amphoeChange();
                              setTimeout(() => {
                                   $('#district').dropdown('set selected', district);
                                   setTimeout(() => { this.loading = false }, 250);
                              }, 250);
                         }, 250);
                    }, 250);
               } else {
                    this.msg.errorModal(response.message);
               }
               // TIMEOUT LOADING 3 SEC.
               setTimeout(() => { this.loading = false }, 3000);
          });
     }

     onCustomerChange(event) {
          if (event.target.value) {
               this.ajax.doGet(`${URL.GET_CUSTOMER}/${event.target.value}`).subscribe((response: ResponseData<License>) => {
                    if (MessageService.MSG.SUCCESS == response.status) {
                         const province: string = response.data.address.split(" ")[3].replace("จ.", "").trim();
                         const amphoe: string = response.data.address.split(" ")[2].replace("อ.", "").trim();
                         const district: string = response.data.address.split(" ")[1].replace("ต.", "").trim();
                         this.form.patchValue({
                              name: response.data.name,
                              companyName: response.data.companyName,
                              identifyNo: response.data.identifyNo,
                              offCode: response.data.offCode,
                              mobile: response.data.mobile,
                              warehouseAddress: response.data.warehouseAddress,
                              addressNo: response.data.address.split(" ")[0].replace("เลขที่", "").trim(),
                              district: district,
                              amphoe: amphoe,
                              province: province,
                              postcode: response.data.address.split(" ")[4].trim(),
                         });
                         setTimeout(() => {
                              $('#province').dropdown('set selected', province);
                              this.provinceChange();
                              setTimeout(() => {
                                   $('#amphoe').dropdown('set selected', amphoe);
                                   this.amphoeChange();
                                   setTimeout(() => {
                                        $('#district').dropdown('set selected', district);
                                   }, 250);
                              }, 250);
                         }, 250);
                    } else {
                         console.error("Customer => ", "ERROR");
                    }
               });
          }
     }

     findCustomers() {
          this.ajax.doGet(`${URL.GET_CUSTOMER_LIST}`).subscribe((response: ResponseData<Ope020701CustomerVo[]>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    this.customers = response.data;
                    $('#customer').dropdown().css('width', '100%');
               } else {
                    console.error("Customers => ", "ERROR");
               }
          });
     }

     customerChange() {
          if (this.form.get('oldCustomer') && this.form.get('oldCustomer').value == "Y") {
               // รายเก่า
               this.findCustomers();
          } else {
               // รายใหม่

          }
     }

     nospace(e) {
          let theEvent = e || window.event;
          if ((theEvent.keyCode || theEvent.which) == 32) {
               theEvent.returnValue = false;
               if (theEvent.preventDefault) theEvent.preventDefault();
          }
     }

     back() {
          this.router.navigate(['/ope02/07/']);
     }

     invalid(control: string) {
          return (this.submitted || this.form.get(control).touched) && this.form.get(control).invalid;
     }

     invalidChildren(control: string, index: number) {
          this.details = this.form.get("details") as FormArray;
          return this.details.at(index).get(control).invalid && (this.details.at(index).get(control).touched || this.submitted);
     }

     provinceChange() {
          const index: number = this.provinces.findIndex(obj => obj.province_name == this.form.get('province').value);
          if (index != -1) {
               this.amphures = this.provinceService.findByProvince(this.provinces[index].province_id);
          }
          this.form.get('amphoe').reset(); $('#amphoe').dropdown('clear');
          if (this.districts.length > 0) {
               this.form.get('district').reset(); $('#district').dropdown('clear');
          }
          this.form.get('postcode').reset();
          this.districts = [];
     }
     amphoeChange() {
          const index: number = this.amphures.findIndex(obj => obj.amphur_name == this.form.get('amphoe').value);
          if (index != -1) {
               this.districts = this.provinceService.findByAmphure(this.amphures[index].amphur_id);
          }
          this.form.get('district').reset();
          this.form.get('postcode').reset();
          this.zipcodes = [];
          if (this.hasStar('amphoe')) {
               this.form.get('postcode').patchValue('-');
               this.form.get('district').patchValue('-');
               $('.ui.dropdown.district').remove();
          } else {
               setTimeout(() => {
                    $('#district').dropdown().css('width', '100%');
                    $('#district').dropdown('clear');
               }, 200);
          }
     }
     districtChange() {
          const index: number = this.districts.findIndex(obj => obj.district_name == this.form.get('district').value);
          if (index != -1) {
               this.zipcodes = this.provinceService.findByDistrictCode(this.districts[index].district_code);
          }
          this.form.get('postcode').reset();
          if (this.zipcodes.length > 0) {
               this.form.get('postcode').patchValue(this.zipcodes[0].zipcode_name);
          }
     }

     hasStar(control: string) {
          const str: string = this.form.get(control).value;
          if (str) {
               if (str.indexOf('*') != -1) {
                    return true;
               }
          }
          return false;
     }

     changeBank() {
          if (this.form.get('bankGuarantee').value == 'N') {
               this.form.get('bankGuaranteeNo').clearValidators();
               this.form.get('bankGuaranteeDate').clearValidators();
               this.form.get('bankGuaranteeNo').patchValue('');
               this.form.get('bankGuaranteeDate').patchValue('');
               this.form.get('bankGuaranteeNo').updateValueAndValidity();
               this.form.get('bankGuaranteeDate').updateValueAndValidity();
               $('#date').calendar('clear');
          } else {
               this.form.get('bankGuaranteeNo').setValidators([Validators.required]);
               this.form.get('bankGuaranteeDate').setValidators([Validators.required]);
               this.form.get('bankGuaranteeNo').updateValueAndValidity();
               this.form.get('bankGuaranteeDate').updateValueAndValidity();
          }
     }

     onFocus(event, index: number) {
          this.details = this.form.get('details') as FormArray;
          this.details.at(index).get('amount').patchValue(event.target.value.replace(/,/g, ''));
     }

     onBlur(event, index: number) {
          this.details = this.form.get('details') as FormArray;
          this.details.at(index).get('amount').patchValue(new DecimalFormatPipe().transform(event.target.value, "###,###"));
     }

     get sumOfLitre(): string {
          let sum: number = 0;
          this.details = this.form.get('details') as FormArray;
          for (let i = 0; i < this.details.length; i++) {
               if (this.details.at(i).get('amount').value) {
                    sum += parseFloat(this.details.at(i).get('amount').value.toString().replace(/,/g, ''));
               }
          }
          return new DecimalFormatPipe().transform(sum.toString(), "###,###");
     }

     get stateEdit() {
          return this.state && this.state == "EDIT";
     }

     get stateView() {
          return this.state && this.state == "VIEW";
     }

     get isOldCustomer() {
          return this.form.get('oldCustomer') && this.form.get('oldCustomer').value == "Y";
     }

}