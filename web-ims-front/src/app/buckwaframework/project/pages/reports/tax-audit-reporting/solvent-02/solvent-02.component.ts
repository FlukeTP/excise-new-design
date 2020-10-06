import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AjaxService } from "../../../../../common/services";
import { ThaiNumber } from "../../../../../common/helper";
@Component({
  selector: 'app-solvent-02',
  templateUrl: './solvent-02.component.html',
  styleUrls: ['./solvent-02.component.css']
})
export class Solvent02Component implements OnInit {
  @Output() discard = new EventEmitter<any>();

  add: number;
  obj: solvent02;
  beans: Bean[];
  constructor(private ajax: AjaxService) {
    this.add = 0;
    this.obj = new solvent02();
    this.beans = [new Bean()];
  }


  ngOnInit() {
    this.onAddField();
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onAddField = () => {
    this.beans.push(new Bean());
    this.add++;
  };

  removeField = i => {
    this.beans.splice(i, 1);
  };

  onKeyUpBean = (e: any, str: string, index: any) => {
    e.preventDefault();
    this.beans[index][str] = ThaiNumber(e.target.value.toString());
  };

  onKeyUp = (e: any, str: string) => {
    e.preventDefault();
    this.obj[str] = ThaiNumber(e.target.value.toString());
  };

  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/Solvent-02";
    this.obj.Bean = this.beans;
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/Solvent-02/file");
      }
    });
  };
}

class solvent02 {
  Bean: Bean[];
}

class Bean {
  [x: string]: any;
  numId: string;
  area: string;
  operatorName: string;
  agent: string;
  user: string;
  solutionType: string; //ชนิดสารละลาย
  sk03: string;
  sk04: string;
  sk04k: string;
  leaves: string; //ใบขน
  accountingDocuments: string; //เอกสารประกอบการลงบัญชี
  results: string; //ผล
  DetailErrors : string; //รายละเอียดกรณีพบข้อผิดพลาด 
  measurement :string; //ผลการตรวจวัดจริงเทียบกับบัญชีประจําวัน
  comparedProduction  :string; //สุ่มตรวจวิเคราะห์จํานวนการใช้เทียบกับสูตรการผลิต
  note : string; //หมายเหตุ

}
