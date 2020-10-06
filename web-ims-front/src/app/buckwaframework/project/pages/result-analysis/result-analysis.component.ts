import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IaService } from 'services/ia.service';
import { ResultAnalysisForm } from 'projects/pages/result-analysis/result-analysis-form.model';
import { ResultAnalysisSerivce } from 'projects/pages/result-analysis/result-analysis.service';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
    selector: 'result-analysis',
    templateUrl: 'result-analysis.component.html',
    styles: [`
        
    `],
    providers: [ResultAnalysisSerivce]
})
export class ResultAnalysisPage implements OnInit {

    breadcrumb: BreadCrumb[] = [
        { label: "ตรวจสอบภาษี", route: "#" },
        { label: "การตรวจสอบภาษี", route: "#" },
        { label: "การวิเคราะห์ข้อมูลเบื้องต้น", route: "/analysis" },
        { label: "ผลการวิเคราะห์ข้อมูลเบื้องต้น", route: "#" },
    ];

    private category: String;
    private coordinate: String;
    form: ResultAnalysisForm = new ResultAnalysisForm();
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modalService: IaService,
        private resultAnalysisSerivce: ResultAnalysisSerivce
    ) {

    }

    ngOnInit() {

        this.setDataService();
    }

    ngAfterViewInit() {

    }

    setDataService() {

        let model = this.modalService.getData();
        if (model == null) {
            this.router.navigate(['/analysis']);
            return false;
        }
        console.log(model);

        this.resultAnalysisSerivce.findDataFromExciseId(model.exciseId).then(res => {

            console.log(res);
            //set data in service
            this.form.exciseId = model.exciseId;
            this.form.userNumber = res.analysNumber;
            this.form.dateFrom = model.dateFrom;
            this.form.dateTo = model.dateTo;
            this.form.entrepreneur = res.companyName; // query
            this.form.type = model.type;
            this.form.factory = res.factoryName; // query
            this.form.coordinates = model.coordinates;
            this.form.address = res.factoryAddress; //query
            this.form.analysisBy = res.createdBy; //query
            this.form.sector = res.exciseOwnerArea1 //query

            this.initDatatable1(model.exciseId);
            this.initDatatable2(model.exciseId);
            this.initDatatable3(model.exciseId);
            this.initDatatable4(model.exciseId);
            this.initDatatable5(model.exciseId);
        });

    }
    initDatatable1 = (exciseId) => {
        this.resultAnalysisSerivce.initDatatable1(exciseId);
    }

    initDatatable2 = (exciseId) => {
        this.resultAnalysisSerivce.initDatatable2(exciseId);
    }

    initDatatable3 = (exciseId) => {
        this.resultAnalysisSerivce.initDatatable3(exciseId);
    }

    initDatatable4 = (exciseId) => {
        this.resultAnalysisSerivce.initDatatable4(exciseId);
    }

    initDatatable5 = (exciseId) => {
        this.resultAnalysisSerivce.initDatatable5(exciseId);
    }

    goToOpe03 = () => {
        this.router.navigate(['/select-form', this.category, this.coordinate]);
    }
}