import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Utils } from 'helpers/utils';
import { forEach } from '@angular/router/src/utils/collection';
import { DecimalFormat } from 'helpers/decimalformat';
declare var $: any;
@Injectable()
export class ResultAnalysisSerivce {
    table1: any;
    table2: any;
    table3: any;
    table4: any;
    table5: any;
    constructor(
        private ajax: AjaxService
    ) { }

    findDataFromExciseId = (exciseId): Promise<any> => {
        let url = "ta/analysis/findByExciseId";
        return new Promise((resolve, reject) => {
            this.ajax.post(url, JSON.stringify(exciseId), res => {
                resolve(res.json())
            })
        });
    }

    initDatatable1 = (exciseId) => {
        this.table1 = $("#table1").DataTable({
            "serverSide": false,
            "searching": false,
            "ordering": false,
            "processing": true,
            "scrollX": true,
            "language": {
                "info": "แสดงจาก_START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ",
                "paginate": {
                    "first": "หน้าแรก",
                    "last": "หน้าสุดท้าย",
                    "next": "ถัดไป",
                    "previous": "ก่อนหน้า"
                },
                "lengthMenu": "แสดง _MENU_ รายการ",
                "loadingRecords": "กำลังดาวน์โหลด...",
                "processing": "กำลังประมวลผล...",
                "search": "ค้นหาทั้งหมด",
                "infoEmpty": "แสดงจาก 0 ถึง 0 จากทั้งหมด 0 รายการ",
                "emptyTable": "ไม่พบข้อมูล",
            },
            "ajax": {
                "url": '/ims-webapp/api/ta/resultAnalysis/findProdcutsTax',
                "contentType": "application/json",
                "type": "POST",
                "data": (d) => {
                    return JSON.stringify($.extend({}, d, {
                        "exciseId": exciseId
                    }));
                },
            },
            "columns": [
                {
                    "data": "order"
                }, {
                    "data": "dataTax0307",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned",
                }, {
                    "data": "budget",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned"
                }, {
                    "data": "difference",
                    "render": (data, row) => {
                        var span = ``;
                        if (data == 0) {
                            span = `<div class="ui green horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        } else {
                            span = `<div class="ui red horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        }
                        return span;
                    },
                    "className": "ui right aligned"
                }
            ],
            "footerCallback": function (row, data, start, end, display) {                
                var sumColumn1 = 0;
                var sumColumn2 = 0;
                var sumColumn3 = 0;
                for (let rs of data) {
                    sumColumn1 += parseFloat(rs.dataTax0307);
                    sumColumn2 += parseFloat(rs.budget);
                }
                sumColumn3 = sumColumn1 - sumColumn2;
                var api = this.api(), data;

                // format money
                var formatsumColumn1 = '<b>' + Utils.moneyFormatDecimal(sumColumn1) + '</b>';
                var formatsumColumn2 = '<b>' + Utils.moneyFormatDecimal(sumColumn2) + '</b>';
                var formatsumColumn3 = '<b>' + Utils.moneyFormatDecimal(sumColumn3) + '</b>';

                $(api.column(1).footer()).html(formatsumColumn1);
                $(api.column(2).footer()).html(formatsumColumn2);
                $(api.column(3).footer()).html(formatsumColumn3);

            }
        });
    }

    initDatatable2 = (exciseId) => {
        this.table2 = $("#table2").DataTable({
            "serverSide": false,
            "searching": false,
            "ordering": false,
            "processing": true,
            "scrollX": true,
            "language": {
                "info": "แสดงจาก_START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ",
                "paginate": {
                    "first": "หน้าแรก",
                    "last": "หน้าสุดท้าย",
                    "next": "ถัดไป",
                    "previous": "ก่อนหน้า"
                },
                "lengthMenu": "แสดง _MENU_ รายการ",
                "loadingRecords": "กำลังดาวน์โหลด...",
                "processing": "กำลังประมวลผล...",
                "search": "ค้นหาทั้งหมด",
                "infoEmpty": "แสดงจาก 0 ถึง 0 จากทั้งหมด 0 รายการ",
                "emptyTable": "ไม่พบข้อมูล",
            },
            "ajax": {
                "url": '/ims-webapp/api/ta/resultAnalysis/findPrice',
                "contentType": "application/json",
                "type": "POST",
                "data": (d) => {
                    return JSON.stringify($.extend({}, d, {
                        "exciseId": exciseId
                    }));
                },
            },
            "columns": [
                {
                    "data": "order"
                }, {
                    "data": "dataTax0307",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned",
                }, {
                    "data": "budget",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned"
                }, {
                    "data": "difference",
                    "render": (data, row) => {
                        var span = ``;
                        if (data == 0) {
                            span = `<div class="ui green horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        } else {
                            span = `<div class="ui red horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        }
                        return span;
                    },
                    "className": "ui right aligned"
                }
            ],
            "footerCallback": function (row, data, start, end, display) {
                
                var sumColumn1 = 0;
                var sumColumn2 = 0;
                var sumColumn3 = 0;
                for (let rs of data) {
                    sumColumn1 += parseFloat(rs.dataTax0307);
                    sumColumn2 += parseFloat(rs.budget);
                }
                sumColumn3 = sumColumn1 - sumColumn2;
                var api = this.api(), data;

                // format money
                var formatsumColumn1 = '<b>' + Utils.moneyFormatDecimal(sumColumn1) + '</b>';
                var formatsumColumn2 = '<b>' + Utils.moneyFormatDecimal(sumColumn2) + '</b>';
                var formatsumColumn3 = '<b>' + Utils.moneyFormatDecimal(sumColumn3) + '</b>';

                $(api.column(1).footer()).html(formatsumColumn1);
                $(api.column(2).footer()).html(formatsumColumn2);
                $(api.column(3).footer()).html(formatsumColumn3);

            }
        });
    }
    initDatatable3 = (exciseId) => {
        this.table3 = $("#table3").DataTable({
            "serverSide": false,
            "searching": false,
            "ordering": false,
            "processing": true,
            "scrollX": true,
            "language": {
                "info": "แสดงจาก_START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ",
                "paginate": {
                    "first": "หน้าแรก",
                    "last": "หน้าสุดท้าย",
                    "next": "ถัดไป",
                    "previous": "ก่อนหน้า"
                },
                "lengthMenu": "แสดง _MENU_ รายการ",
                "loadingRecords": "กำลังดาวน์โหลด...",
                "processing": "กำลังประมวลผล...",
                "search": "ค้นหาทั้งหมด",
                "infoEmpty": "แสดงจาก 0 ถึง 0 จากทั้งหมด 0 รายการ",
                "emptyTable": "ไม่พบข้อมูล",
            },
            "ajax": {
                "url": '/ims-webapp/api/ta/resultAnalysis/findValueProductTax',
                "contentType": "application/json",
                "type": "POST",
                "data": (d) => {
                    return JSON.stringify($.extend({}, d, {
                        "exciseId": exciseId
                    }));
                },
            },
            "columns": [
                {
                    "data": "order"
                }, {
                    "data": "dataTax0307",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned",
                }, {
                    "data": "budget",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned"
                }, {
                    "data": "difference",
                    "render": (data, row) => {
                        var span = ``;
                        if (data == 0) {
                            span = `<div class="ui green horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        } else {
                            span = `<div class="ui red horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        }
                        return span;
                    },
                    "className": "ui right aligned"
                }
            ],
            "footerCallback": function (row, data, start, end, display) {
                
                var sumColumn1 = 0;
                var sumColumn2 = 0;
                var sumColumn3 = 0;
                for (let rs of data) {
                    sumColumn1 += parseFloat(rs.dataTax0307);
                    sumColumn2 += parseFloat(rs.budget);
                }
                sumColumn3 = sumColumn1 - sumColumn2;
                var api = this.api(), data;

                // format money
                var formatsumColumn1 = '<b>' + Utils.moneyFormatDecimal(sumColumn1) + '</b>';
                var formatsumColumn2 = '<b>' + Utils.moneyFormatDecimal(sumColumn2) + '</b>';
                var formatsumColumn3 = '<b>' + Utils.moneyFormatDecimal(sumColumn3) + '</b>';

                $(api.column(1).footer()).html(formatsumColumn1);
                $(api.column(2).footer()).html(formatsumColumn2);
                $(api.column(3).footer()).html(formatsumColumn3);

            }
        });
    }
    initDatatable4 = (exciseId) => {
        this.table4 = $("#table4").DataTable({
            "serverSide": false,
            "searching": false,
            "ordering": false,
            "processing": true,
            "scrollX": true,
            "language": {
                "info": "แสดงจาก_START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ",
                "paginate": {
                    "first": "หน้าแรก",
                    "last": "หน้าสุดท้าย",
                    "next": "ถัดไป",
                    "previous": "ก่อนหน้า"
                },
                "lengthMenu": "แสดง _MENU_ รายการ",
                "loadingRecords": "กำลังดาวน์โหลด...",
                "processing": "กำลังประมวลผล...",
                "search": "ค้นหาทั้งหมด",
                "infoEmpty": "แสดงจาก 0 ถึง 0 จากทั้งหมด 0 รายการ",
                "emptyTable": "ไม่พบข้อมูล",
            },
            "ajax": {
                "url": '/ims-webapp/api/ta/resultAnalysis/findTaxRate',
                "contentType": "application/json",
                "type": "POST",
                "data": (d) => {
                    return JSON.stringify($.extend({}, d, {
                        "exciseId": exciseId
                    }));
                },
            },
            "columns": [
                {
                    "data": "order"
                }, {
                    "data": "dataTax0307",
                    "render": (data, row) => {
                        return data + "%";
                    },
                    "className": "ui right aligned",
                }, {
                    "data": "budget",
                    "render": (data, row) => {
                        return data + "%";
                    },
                    "className": "ui right aligned"
                }, {
                    "data": "difference",
                    "render": (data, row) => {
                        var span = ``;
                        if (data == 0) {
                            span = `<div class="ui green horizontal label">` + data + "%" + `</div>`;
                        } else {
                            span = `<div class="ui red horizontal label">` + data + "%" + `</div>`;
                        }
                        return span;
                    },
                    "className": "ui right aligned"
                }
            ],
            "footerCallback": function (row, data, start, end, display) {             
                var sumColumn1 = 0;
                var sumColumn2 = 0;
                var sumColumn3 = 0;
                for (let rs of data) {
                    sumColumn1 += parseFloat(rs.dataTax0307);
                    sumColumn2 += parseFloat(rs.budget);
                }
                sumColumn3 = sumColumn1 - sumColumn2;
                var api = this.api(), data;

                // format money
                var formatsumColumn1 = '<b>' + sumColumn1 + '%</b>';
                var formatsumColumn2 = '<b>' + sumColumn2 + '%</b>';
                var formatsumColumn3 = '<b>' + sumColumn3 + '%</b>';

                $(api.column(1).footer()).html(formatsumColumn1);
                $(api.column(2).footer()).html(formatsumColumn2);
                $(api.column(3).footer()).html(formatsumColumn3);

            }
        });
    }
    initDatatable5 = (exciseId) => {
        this.table5 = $("#table5").DataTable({
            "serverSide": false,
            "searching": false,
            "ordering": false,
            "processing": true,
            "scrollX": true,
            "language": {
                "info": "แสดงจาก_START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ",
                "paginate": {
                    "first": "หน้าแรก",
                    "last": "หน้าสุดท้าย",
                    "next": "ถัดไป",
                    "previous": "ก่อนหน้า"
                },
                "lengthMenu": "แสดง _MENU_ รายการ",
                "loadingRecords": "กำลังดาวน์โหลด...",
                "processing": "กำลังประมวลผล...",
                "search": "ค้นหาทั้งหมด",
                "infoEmpty": "แสดงจาก 0 ถึง 0 จากทั้งหมด 0 รายการ",
                "emptyTable": "ไม่พบข้อมูล",
            },
            "ajax": {
                "url": '/ims-webapp/api/ta/resultAnalysis/findSubmitPayment',
                "contentType": "application/json",
                "type": "POST",
                "data": (d) => {
                    return JSON.stringify($.extend({}, d, {
                        "exciseId": exciseId
                    }));
                },
            },
            "columns": [
                {
                    "data": "order"
                }, {
                    "data": "dataTax0307",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned",
                }, {
                    "data": "budget",
                    "render": (data, row) => {
                        return Utils.moneyFormat(data);
                    },
                    "className": "ui right aligned"
                }, {
                    "data": "difference",
                    "render": (data, row) => {
                        var span = ``;
                        if (data == 0) {
                            span = `<div class="ui green horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        } else {
                            span = `<div class="ui red horizontal label">` + Utils.moneyFormat(data) + `</div>`;
                        }
                        return span;
                    },
                    "className": "ui right aligned"
                }
            ],
            "footerCallback": function (row, data, start, end, display) {                
                var sumColumn1 = 0;
                var sumColumn2 = 0;
                var sumColumn3 = 0;
                for (let rs of data) {
                    sumColumn1 += parseFloat(rs.dataTax0307);
                    sumColumn2 += parseFloat(rs.budget);
                }
                sumColumn3 = sumColumn1 - sumColumn2;
                var api = this.api(), data;

                // format money
                var formatsumColumn1 = '<b>' + Utils.moneyFormatDecimal(sumColumn1) + '</b>';
                var formatsumColumn2 = '<b>' + Utils.moneyFormatDecimal(sumColumn2) + '</b>';
                var formatsumColumn3 = '<b>' + Utils.moneyFormatDecimal(sumColumn3) + '</b>';

                $(api.column(1).footer()).html(formatsumColumn1);
                $(api.column(2).footer()).html(formatsumColumn2);
                $(api.column(3).footer()).html(formatsumColumn3);

            }
        });
    }
}