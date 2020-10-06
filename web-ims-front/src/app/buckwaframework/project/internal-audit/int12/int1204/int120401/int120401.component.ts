import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Int120401Service } from './int120401.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { UserModel } from 'models/user.model';

declare var $: any;

@Component({
    selector: 'app-int120401',
    templateUrl: './int120401.component.html',
    styleUrls: ['./int120401.component.css'],
    providers: [Int120401Service]
})
export class Int120401Component implements OnInit, AfterViewInit {
    breadcrumb: BreadCrumb[] = [
        { label: 'ตรวจสอบภายใน', route: '#' },
        { label: 'บันทึกข้อมูล', route: '#' },
        { label: 'ข้อมูลค่าใช้จ่าย', route: '#' },
    ];
    yearList: any;
    model: FormSearch;
    data: Data;
    chartOfAccList: any
    formSave: FormGroup
    userProfile: UserModel
    sector: any;
    sectorList: any;
    araeList: any;
    sectorSelect: string;
    areaSelect: string;
    constructor(
        private int120401Service: Int120401Service,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private iaService: IaService,
        private fb: FormBuilder,
    ) {
        this.userProfile = this.authService.getUserDetails();
        this.model = new FormSearch();
        this.data = new Data();
        this.formSave = this.fb.group({
            accountId: [''],
            accountName: [''],
            year: []
        })

    }

    ngOnInit() {

        // this.authService.reRenderVersionProgram('INT-120401');
        $('#year').dropdown();
        this.iaService.setData(null);
        this.int120401Service.setSearchFlag(this.route.snapshot.queryParams['searchFlag'] || '' || undefined);

        // this.year();
        this.getData()
        this.getSector()
        const area = this.route.snapshot.queryParams['area']
        if (area) {
            this.setFromPath()
        } else {
            this.getChartOfAcc()
        }
    }

    ngAfterViewInit(): void {
        this.getSectorDtl()
        $('.ui.dropdown').dropdown()
        $('.ui.dropdown.ia').css('width', '100%')
        // this.dataTable()
        if (this.userProfile.officeCode.substring(0, 2) !== '00' && this.userProfile.officeCode.substring(0, 2) !== '99') {
            this.formSave.patchValue({
                officeCode: this.userProfile.officeCode.substring(0, 2) + '0000',
                area: this.userProfile.officeCode
            })
        }
        // this.search()
        this.calendar()
    }

    async setFromPath() {
        const areaPath = this.route.snapshot.queryParams['area'];
        let sector = this.route.snapshot.queryParams['sector'];
        sector = sector.substring(0, 2);
        if (sector !== '99') {
            sector += '0000';
        } else if (sector === '99') {
            sector += '9999';
        }
        const year = this.route.snapshot.queryParams['budgetYear'];
        const accId = this.route.snapshot.queryParams['accId'];
        if (sector) {
            this.sectorSelect = sector;
            await this.changeSector(sector);
            $('#sector').dropdown('set selected', sector);
            if (areaPath) {
                // this.formSave.patchValue({ area: areaPath })
                this.areaSelect = areaPath
                $('#area').dropdown('set selected', areaPath);
            }
        }
        this.formSave.patchValue({ year: year, accountId: accId });
        await this.getChartOfAcc(2, accId)
        $('#budgetYear').calendar('set date', year)
        // this.changeChartOfAcc(accId, '1');
    }

    getSector = () => {
        $('#area').dropdown('restore defaults');
        // this.loading = true
        // this.compareForm.patchValue({
        //   sector: null, area: null
        // })
        this.sectorSelect = null
        this.areaSelect = null
        this.int120401Service.sector()
            .then((sectorList) => {
                this.sectorList = sectorList
                // this.loading = false
            })
            .catch(() => {
                // this.loading = false
            });
    }
    changeSector = (e) => {
        // this.loading = true
        this.araeList = null;
        // this.compareForm.patchValue({
        //   area: null
        // })
        if (e != null && e !== '') {
            $('#area').dropdown('restore defaults');
            this.int120401Service.area(this.sectorSelect)
                .then((areaList) => {
                    this.araeList = areaList
                    //   this.loading = false
                })
                .catch(() => {
                    //   this.loading = false
                });
        }
    }

    calendar() {
        $('#budgetYear').calendar({
            type: 'year',
            initialDate: new Date(),
            text: TextDateTH,
            formatter: formatter('ป'),
            onChange: (date, text) => {
                this.formSave.patchValue({
                    year: text
                })
            }
        });
    }

    getData(accountId?, year?) {
        this.int120401Service.getData({
            accountId: accountId,
            year: year
        }).then(then => {
            console.log('then', then);
        });
    }

    changeChartOfAcc(e, flag: string) {
        let data = []
        if ('1' == flag) {
            data = this.chartOfAccList.filter(obj => obj.coaCode == e)
        } else if ('2' == flag) {
            data = this.chartOfAccList.filter(obj => obj.coaName == e)
        }
        if (data.length != 0) {
            this.formSave.patchValue({
                accountId: data[0].coaCode,
                accountName: data[0].coaName
            })
            $('#coaCode').dropdown('set selected', data[0].coaCode)
            $('#coaName').dropdown('set selected', data[0].coaName)
        }
    }

    getChartOfAcc(flag = 1, accId?) {
        this.int120401Service.getChartOfAcc().then((res: any) => {
            this.chartOfAccList = res.data
            if (flag === 2) {
                this.changeChartOfAcc(accId, '1');
            }
        });
    }

    search() {
        let model = new FormSearch
        model.accountId = this.formSave.value.accountId
        model.accountName = this.formSave.value.accountName
        model.year = this.formSave.value.year
        model.searchFlag = 'TRUE';

        const off = this.userProfile.officeCode.substring(0, 2)
        if (off !== '00' && off !== '99') {
            model.officeCode = this.userProfile.officeCode
            model.area = this.userProfile.officeCode
        } else if (off === '00' || off === '99') {
            model.officeCode = this.sectorSelect
            model.area = this.areaSelect
        }
        this.int120401Service.search(model);
    }
    clear() {
        this.formSave.reset()
        $('#coaCode').dropdown('clear')
        $('#coaName').dropdown('clear')
        $('#budgetYear').calendar('clear')
        $('#sector').dropdown('clear')
        $('#area').dropdown('clear')
        this.areaSelect = null
        this.sectorSelect = null
        // this.int120401Service.clearDataTable()
        let model = new FormSearch
        model.accountId = '9999999'
        this.int120401Service.search(model);
        // this.search()
    }

    dataTable = () => {
        this.int120401Service.dataTable();
    }

    year = () => {
        this.int120401Service.year(this.callBackYear);
    }

    callBackYear = (result) => {
        this.yearList = result;
    }

    getSectorDtl() {
        this.int120401Service.getSectorDtl(this.userProfile.officeCode.substring(0, 2)).then((data) => {
            this.sector = data
        })
    }

    goLocation() {
        this.router.navigate(['/int12/04/01/01'], {
            queryParams: {
                area: this.areaSelect,
                officeCode: this.sectorSelect,
                chartOfAcc: this.formSave.value.accountId
            }
        })
    }
}

class FormSearch {
    accountId: string = '';
    accountName: string = '';
    searchFlag: string = '';
    year: string = '';
    officeCode: string = '';
    area: string = '';
}

class Data {
    id: string = '';
    accountId: string = '';
    accountName: string = '';
    serviceReceive: string = '';
    serviceWithdraw: string = '';
    serviceBalance: string = '';
    suppressReceive: string = '';
    suppressWithdraw: string = '';
    suppressBalance: string = '';
    budgetReceive: string = '';
    budgetWithdraw: string = '';
    budgetBalance: string = '';
    sumReceive: string = '';
    sumWithdraw: string = '';
    sumBalance: string = '';
    moneyBudget: string = '';
    moneyOut: string = '';
    averageCost: string = '';
    averageGive: string = '';
    averageFrom: string = '';
    averateComeCost: string = '';
    createdBy: string = '';
    updatedBy: string = '';
    createdDate: string = '';
    updatedDate: string = '';
    note: string = '';
    editStatus: string = '';
}
