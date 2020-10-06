import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb, License, ResponseData, LicenseAlcohol } from 'models/index';
import * as moment from 'moment';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope0412Vo } from '../ope0412vo.model';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';

declare var $: any;

const URL = {
     GET_FIND: "oa/04/01/06/customers",
     GET_LICENSE: "oa/04/12/find/customerLicense",
     GET_LICENSES: "oa/04/12/find/customerLicenses",
}

@Component({
     selector: 'app-ope04-12-01',
     templateUrl: 'ope041201.component.html',
     styleUrls: ['ope041201.component.css']
})
export class Ope041201Component {
     breadcrumb: BreadCrumb[] = [
          { label: "ตรวจปฏิบัติการ", route: "#" },
          { label: "สุรากลั่นชุมชน", route: "/ope04/" },
          { label: "ข้อมูลผู้ประกอบการสุรากลั่นชุมชน", route: "/ope04/12/" },
          { label: "รายละเอียดผู้ประกอบการสุรากลั่นชุมชน", route: "#" },
     ];
     menuhide: boolean = false;
     munuHide() { this.menuhide = !this.menuhide }
     id: string = "";
     loading: boolean = false;
     form: FormGroup = new FormGroup({});
     formLicense: FormGroup = new FormGroup({});
     details: FormArray = new FormArray([]);
     listLicensesA: License[] = [];
     constructor(
          private fb: FormBuilder,
          private ajax: AjaxService,
          private msg: MessageBarService,
          private route: ActivatedRoute,
          private router: Router
     ) {
          this.form = this.fb.group({
               oldCustomer: ['N', Validators.required],
               name: ['', Validators.required],
               companyName: ['', Validators.required],
               identifyType: ['P', Validators.required],
               identifyNo: ['', Validators.required],
               addressNo: ['', Validators.required],
               district: ['', Validators.required],
               amphoe: ['', Validators.required],
               province: ['', Validators.required],
               postcode: ['', Validators.required],
               telephone: ['', Validators.required],
               warehouseAddress: ['', Validators.required],
               address: ['', Validators.required]
          });
          this.formLicense = this.fb.group({
               oaCuslicenseId: [null, Validators.required],
               oaCustomerId: [null, Validators.required],
               licenseNo: ['', Validators.required],
               licenseDate: [new Date()],
               operateName: [null, Validators.required],
               operateRemark: [null, Validators.required],
               approveName: [null],
               startDate: [new Date(), Validators.required],
               endDate: [new Date(), Validators.required],
               offCode: [null],
               receiveDate: [null, Validators.required],
               receiveNo: [null, Validators.required],
               approve: [null],
               licenseAddress: ['', Validators.required],
               createdFactTime: ['', Validators.required],
               usedDate: ['', Validators.required],
               money: [null, Validators.required],
               details: this.fb.array([]),
          });
          this.details = this.formLicense.get('details') as FormArray;
          this.addLicenseDetail();
     }

     ngOnInit() {
          this.id = this.route.snapshot.queryParams["id"] || "";
          if (this.id) {
               // Query data
               this.loading = true;
               this.getLiciensesA();
               this.ajax.doGet(`${URL.GET_FIND}/${this.id}`).subscribe((response: ResponseData<Ope0412Vo>) => {
                    if (MessageService.MSG.SUCCESS == response.status) {
                         const province: string = response.data.address.split(" ")[3].replace("จ.", "").trim();
                         const amphoe: string = response.data.address.split(" ")[2].replace("อ.", "").trim();
                         const district: string = response.data.address.split(" ")[1].replace("ต.", "").trim();
                         this.form.patchValue({
                              oldCustomer: response.data.oldCustomer,
                              name: response.data.name,
                              companyName: response.data.companyName,
                              identifyType: response.data.identifyType,
                              identifyNo: response.data.identifyNo,
                              addressNo: response.data.address.split(" ")[0].replace("เลขที่", "").trim(),
                              district: district,
                              amphoe: amphoe,
                              province: province,
                              postcode: response.data.address.split(" ")[4].trim(),
                              telephone: response.data.mobile,
                              warehouseAddress: response.data.warehouseAddress,
                              address: response.data.address
                         });
                         setTimeout(() => this.loading = false, 200);
                    } else {
                         this.msg.errorModal(response.message);
                    }
               });
          }
     }

     ngAfterViewInit() {
          $('#receiveDate').calendar({
               type: 'date',
               initialDate: new Date(),
               text: TextDateTH,
               formatter: formatter('วดป'),
               onChange: (date, text) => {
                    this.formLicense.get('receiveDate').patchValue(date);
               }
          });
          $('#usedDate').calendar({
               type: 'date',
               initialDate: new Date(),
               text: TextDateTH,
               formatter: formatter('วดป'),
               onChange: (date, text) => {
                    this.formLicense.get('usedDate').patchValue(date);
               }
          });
     }

     back() {
          this.router.navigate(['/ope04/12/']);
     }

     addLicenseDetail() {
          this.details = this.formLicense.get('details') as FormArray;
          this.details.push(this.fb.group({
               oaCuslicenseDtlId: [null, Validators.required],
               oaCuslicenseId: [null, Validators.required],
               seq: [null, Validators.required],
               name: ['', Validators.required],
               type: ['', Validators.required],
               amount: [null, Validators.required],
               licenNo: ['', Validators.required],
          }));
     }

     getLiciensesA() {
          // TODO
          this.loading = true;
          this.ajax.doGet(`${URL.GET_LICENSES}/${this.id}`).subscribe((response: ResponseData<License[]>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    console.log("getLicienses[A] => ", response.data);
                    this.listLicensesA = response.data;
                    this.loading = false;
                    if (this.listLicensesA.length > 0 && !this.formLicense.get('oaCuslicenseId').value) {
                         this.loadLicense(this.listLicensesA[0].oaCuslicenseId);
                    }
               } else {
                    this.msg.errorModal(response.message);
               }
          });
     }

     loadLicense(id: number) {
          this.loading = true;
          this.ajax.doGet(`${URL.GET_LICENSE}/${id}`).subscribe((response: ResponseData<LicenseAlcohol>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    this.details = this.formLicense.get('details') as FormArray;
                    for (let i = this.details.length; i >= 0; i--) {
                         this.details.removeAt(i);
                    }
                    for (let i = 0; i < response.data.details.length; i++) {
                         if (this.details.at(i)) {
                              this.details.at(i).patchValue(response.data.details[i]);
                         } else {
                              this.addLicenseDetail();
                              this.details.at(i).patchValue(response.data.details[i]);
                         }
                    }
                    this.formLicense.patchValue({
                         oaCuslicenseId: response.data.oaCuslicenseId,
                         oaCustomerId: response.data.oaCustomerId,
                         licenseNo: response.data.licenseNo,
                         licenseDate: response.data.licenseDate,
                         operateName: response.data.operateName,
                         operateRemark: response.data.operateRemark,
                         approveName: response.data.approveName,
                         startDate: response.data.startDate,
                         endDate: response.data.endDate,
                         offCode: response.data.offCode,
                         receiveDate: response.data.receiveDate,
                         receiveNo: response.data.receiveNo,
                         approve: response.data.approve,
                         licenseAddress: response.data.licenseAddress,
                         createdFactTime: response.data.createdFactTime,
                         usedDate: response.data.usedDate,
                         money: new DecimalFormatPipe().transform(response.data.money ? response.data.money.toString() : '0', "###,###"),
                    });
                    if (response.data.receiveDate) {
                         const date: Date = new Date(response.data.receiveDate);
                         $('#receiveDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                    } else {
                         $('#receiveDate').calendar('clear');
                    }
                    if (response.data.usedDate) {
                         const date: Date = new Date(response.data.usedDate);
                         $('#usedDate').calendar('set date', moment(date).add(7, 'hours').toDate());
                    } else {
                         $('#usedDate').calendar('clear');
                    }
                    this.loading = false;
               } else {
                    this.msg.errorModal(response.message);
               }
          });
     }

     edit() {
          this.router.navigate(['/ope04/12/02'], {
               queryParams: {
                    id: this.formLicense.get('oaCuslicenseId').value,
                    customerId: this.id
               }
          })
     }

     addNewLicense() {
          this.router.navigate(['/ope04/12/02'], {
               queryParams: {
                    customerId: this.id
               }
          })
     }

     get sumOfLitre(): number {
          let sum: number = 0;
          this.details = this.formLicense.get('details') as FormArray;
          for (let i = 0; i < this.details.length; i++) {
               if (this.details.at(i).get('amount').value) {
                    sum += parseFloat(this.details.at(i).get('amount').value);
               }
          }
          return sum;
     }
}