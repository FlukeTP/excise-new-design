import { Injectable } from "@angular/core";
import { Form } from "@angular/forms";
import { AjaxService } from "services/ajax.service";
import { Utils } from "helpers/utils";
import { From } from './form.model';
import { Int0901011Service } from './int090101-1.service';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { IsNaNPipe } from 'app/buckwaframework/common/pipes/isnan.pipe';

declare var $: any;

const URLS = {
    COMPARE: 'ia/int09/01/01/find-compare',
    GET_SECTOR: 'preferences/department/sector-list',
    GET_AREA: 'preferences/department/area-list/'
}
@Injectable()

export class Int0901013Service {

    table: any;
    form: From = new From();
    sectorList: any;
    araeList: any;
    constructor(
        private ajax: AjaxService,
        private messageBar: MessageBarService
    ) { }

    compareService(dataCompare: object) {
        return new Promise((resolve, reject) => {
            this.ajax.doPost(URLS.COMPARE, dataCompare).subscribe((res: ResponseData<any>) => {
                if (MessageService.MSG.SUCCESS === res.status) {
                    // this.messageBar.successModal(res.message)
                    resolve(res.data)
                } else {
                    this.messageBar.errorModal(res.message)
                    reject()
                }
            })
        })
    }

    sector = () => {
        return new Promise((resolve, reject) => {
            this.ajax.doPost(URLS.GET_SECTOR, {}).subscribe((res: ResponseData<any>) => {
                if (MessageService.MSG.SUCCESS === res.status) {
                    // this.messageBar.successModal(res.message)
                    resolve(res.data)
                } else {
                    this.messageBar.errorModal(res.message)
                    reject()
                }
            })
        })
    }

    area = (sector: string) => {
        return new Promise((resolve, reject) => {
            this.ajax.doPost(URLS.GET_AREA + sector, {}).subscribe((res: ResponseData<any>) => {
                if (MessageService.MSG.SUCCESS === res.status) {
                    // this.messageBar.successModal(res.message)
                    resolve(res.data)
                } else {
                    this.messageBar.errorModal(res.message)
                    reject()
                }
            })
        })
    }

    year = (yearCb: Function) => {
        let url = "ia/int0613/year";
        this.ajax.get(url, res => {
            yearCb(res.json());
        });
    }
    search = (int0901011Service: Int0901011Service) => {
        this.form.searchFlag = "TRUE";
        this.form.dataBudget = int0901011Service.getDataBudget();
        this.form.dataLedger = int0901011Service.getDataLedger();

        console.log("Data Service : ", this.form);
        $("#dataTable").DataTable().ajax.reload();

    }
    clear = () => {
        this.form.searchFlag = "FALSE";
    }

    summaryTable(data) {
        let serviceReceive = 0;
        let suppressReceive = 0;
        let budgetReceive = 0;
        let sumReceive = 0;
        let serviceWithdraw = 0;
        let suppressWithdraw = 0;
        let budgetWithdraw = 0;
        let sumWithdraw = 0;
        let experimentalBudget = 0;
        let differenceExperimentalBudget = 0;
        let ledger = 0;
        let differenceLedger = 0;
        let serviceBalance = 0;
        let suppressBalance = 0;
        let budgetBalance = 0;
        let sumBalance = 0;
        let moneyBudget = 0;
        let moneyOut = 0;
        let summary = []
        data.forEach(element => {
            serviceReceive += element.serviceReceive;
            suppressReceive += element.suppressReceive;
            budgetReceive += element.budgetReceive;
            sumReceive += element.sumReceive;
            serviceWithdraw += element.serviceWithdraw;
            suppressWithdraw += element.suppressWithdraw;
            budgetWithdraw += element.budgetWithdraw;
            sumWithdraw += element.sumWithdraw;
            experimentalBudget += element.experimentalBudget;
            differenceExperimentalBudget += element.differenceExperimentalBudget;
            ledger += element.ledger;
            differenceLedger += element.differenceLedger;
            serviceBalance += element.serviceBalance;
            suppressBalance += element.suppressBalance;
            budgetBalance += element.budgetBalance;
            sumBalance += element.sumBalance;
            // averageCost += element.averageCost;
            // averageFrom += element.averageFrom;
            moneyBudget += element.moneyBudget;
            moneyOut += element.moneyOut;
        });
        summary.push(serviceReceive)
        summary.push(suppressReceive)
        summary.push(budgetReceive)
        summary.push(sumReceive)
        summary.push(serviceWithdraw)
        summary.push(suppressWithdraw)
        summary.push(budgetWithdraw)
        summary.push(sumWithdraw)
        summary.push(experimentalBudget)
        summary.push(differenceExperimentalBudget)
        summary.push(ledger)
        summary.push(differenceLedger)
        summary.push(serviceBalance)
        summary.push(suppressBalance)
        summary.push(budgetBalance)
        summary.push(sumBalance)
        summary.push(0)
        summary.push(0)
        summary.push(0)
        summary.push(moneyBudget)
        summary.push(moneyOut)
        return summary;
    }

    dataTableSerive() {
        return $('#dataTable').DataTableTh({
            processing: true,
            serverSide: false,
            paging: true,
            scrollX: false,
            // data: this.datas,
            columns: [
                {
                    className: 'ui center aligned',
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                }, {
                    'data': 'accountId',
                    'className': 'ui center aligned'
                }, {
                    'data': 'accountName',
                    'className': 'ui left aligned',
                }, {
                    'data': 'serviceReceive',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'suppressReceive',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'budgetReceive',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'sumReceive',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'serviceWithdraw',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'suppressWithdraw',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'budgetWithdraw',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'sumWithdraw',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'experimentalBudget',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                },
                {
                    'data': 'differenceExperimentalBudget',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'ledger',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                },
                {
                    'data': 'differenceLedger',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'serviceBalance',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'suppressBalance',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'budgetBalance',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'sumBalance',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'averageCost',
                    'className': 'ui right aligned',
                    'render': (data, row) => {
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'averageGive',
                    'className': 'ui left aligned'
                }, {
                    'data': 'averageFrom',
                    'className': 'ui right aligned',
                    'render': (data, row) => {
                        return this.checkColor(data);
                    }
                },
                {
                    'data': 'moneyBudget',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                }, {
                    'data': 'moneyOut',
                    'className': 'ui right aligned',
                    'render': (data, type, row) => {
                        if (row.accountId == null) {
                            return null
                        }
                        return this.checkColor(data);
                    }
                },
                // {
                //     'data': 'note',
                //     'className': 'ui center aligned',
                //     'render': (data, row) => {
                //         // var btn = '';
                //         // btn += `<button class='ui mini blue button btn - detail'><i class='eye icon'></i>หมายเหตุ</button>`;
                //         if (!data || data === '') {
                //             data = '<span style="text-align: left !important">-</span>'
                //         }

                //         return data;
                //     }
                // }
            ],
            // "footerCallback": function (row, data, start, end, display) {
            //     if (data.length > 0) {
            //         let sumColumn2 = 0;
            //         let sumColumn3 = 0;
            //         let sumColumn4 = 0;
            //         let sumColumn5 = 0;
            //         let sumColumn6 = 0;
            //         let sumColumn7 = 0;
            //         let sumColumn8 = 0;
            //         let sumColumn9 = 0;

            //         /* ____________ summary data ____________ */
            //         for (let rs of data) {
            //             sumColumn2 += parseFloat(new IsNaNPipe().transform(rs.bringForward));
            //             sumColumn3 += parseFloat(new IsNaNPipe().transform(rs.debit));
            //             sumColumn4 += parseFloat(new IsNaNPipe().transform(rs.credit));
            //             sumColumn5 += parseFloat(new IsNaNPipe().transform(rs.carryForward));
            //             sumColumn6 += parseFloat(new IsNaNPipe().transform(rs.debit2));
            //             sumColumn7 += parseFloat(new IsNaNPipe().transform(rs.credit2));
            //             sumColumn8 += parseFloat(new IsNaNPipe().transform(rs.diffDebit));
            //             sumColumn9 += parseFloat(new IsNaNPipe().transform(rs.diffCredit));
            //         }

            //         var api = this.api(), data;
            //         let formatNumber = function (data) {
            //             return '<b>' + $.fn.dataTable.render.number(",", ".", 2, "").display(data) + '</b>';
            //         }

            //         /* ____________ set data on column ____________ */

            //         $(api.column(4).footer()).html(formatNumber(sumColumn4));
            //         $(api.column(5).footer()).html(formatNumber(sumColumn5));
            //         $(api.column(6).footer()).html(formatNumber(sumColumn6));
            //         $(api.column(7).footer()).html(formatNumber(sumColumn7));
            //         $(api.column(8).footer()).html(formatNumber(sumColumn8));
            //         $(api.column(9).footer()).html(formatNumber(sumColumn9));
            //     }
            // }
        })
    }

    checkColor(num: Number) {
        if (num < 0) {
            return `<span style="color:red">${Utils.moneyFormat(num)}</sapn>`
        } else {
            return `<span>${Utils.moneyFormat(num)}</sapn>`
        }
    }
}
