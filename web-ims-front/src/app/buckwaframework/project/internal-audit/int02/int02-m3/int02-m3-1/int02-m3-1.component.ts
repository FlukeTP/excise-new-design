import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AjaxService, MessageBarService, AuthService } from "../../../../../common/services";
import { BaseModel, ManageReq, BreadCrumb } from "../../../../../common/models";
import { toFormData } from "../../../../../common/helper";

const URL = {
  MAINDETAIL: "/ia/int02m31/getQtnDetailList",
  SAVE_DETAIL: "/ia/int02m31/saveDetailList",
  UPDATE_DETAIL: "/ia/int02m31/updateDetail",
  DELETE_MAINDTL: "/ia/int02m31/deleteMainDtl/",
  DELETE_MINORDTL: "/ia/int02m31/deleteMinorDtl/"
};

declare var $: any;

@Component({
  selector: "app-int02-m3-1",
  templateUrl: "./int02-m3-1.component.html",
  styleUrls: ["./int02-m3-1.component.css"]
})
export class Int02M31Component implements OnInit {
  headerCode: any;
  qtnMainList: any;
  qtnMinorList: any;
  mainId: any;
  qtnHeaderName: any;
  lastData: any;
  option: any;
  table: Int023FormVo[] = [];
  minorDetail: string[] = [];
  numbers: string[] = [""];
  mainDetail: any;
  dataSave: any;
  qtnMainDetail: any;
  qtnMinorDetail: any;
  listSelect: any = "";
  data: any;
  dataSelect: any;
  showEdit: any;
  chkSelect: any = [];
  chkAllSelect: any = [];
  breadcrumb: BreadCrumb[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private authService: AuthService
  ) {
    this.mainId = "";
    this.qtnMainList = [];
    this.qtnMinorList = [];
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "จัดการข้อมูลแบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "รายละเอียดด้าน", route: "#" }
    ];
  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('INT-02600');
    //get params link "/int02/m3"
    this.headerCode = this.route.snapshot.queryParams["qtnHeaderCode"];
    this.qtnHeaderName = this.route.snapshot.queryParams["qtnHeaderName"];

    this.initialTable();
  }

  initialTable(loadmore = false): void {
    this.option = {
      headerCode: this.headerCode,
      draw: 1,
      start: 0,
      length: 50
    };

    if (!loadmore) {
      this.table = [];
    }
    this.ajax.post(URL.MAINDETAIL, this.option, res => {
      let d = res.json().data;
      this.data = d;
      console.log("d: ", d);
      d.forEach(data => {
        let qtn = new Int023FormVo();
        qtn.qtnReportHdrId = "NOT NULL";
        qtn.qtnReportManId = `OLD_${data.qtnReportManId}`;
        qtn.qtnMainDetail = data.qtnMainDetail;
        if (
          this.table.findIndex(
            obj =>
              obj.qtnReportHdrId == "NOT NULL" &&
              obj.qtnReportManId == data.qtnReportManId
          ) == -1
        ) {
          this.table.push(qtn);
        }
        data.detail.forEach((obj, index) => {
          let _qtn = new Int023FormVo();
          _qtn.qtnReportManId = `OLD_${obj.mainId}`;
          _qtn.qtnReportDtlId = obj.qtnMinorId;
          _qtn.qtnMainDetail = obj.qtnMinorDetail;
          if (
            this.table.findIndex(o => o.qtnReportDtlId == obj.qtnMinorId) == -1
          ) {
            $("#chk1").prop("checked", false);
            this.table.push(_qtn);
          }
        });
      });
    });
  }

  chkAll = (event, table, i) => {
    if (event.target.checked) {
      this[`chk${i}`] = this[`${table}`];
      if (this[`${table}`].length > 0) {
        this.chkSelect = [];
        this[`${table}`].map((obj, index) => {
          if ($(`#chk${i}-${index}`)[0]) {
            this.chkSelect.push(obj);
            $(`#chk${i}-${index}`)[0].checked = true;
          }
        });
      }
    } else {
      this[`chk${i}`] = [];
      if (this[`${table}`].length > 0) {
        this[`${table}`].map((obj, index) => {
          if ($(`#chk${i}-${index}`)[0]) {
            this.chkSelect.splice(0, index);
            $(`#chk${i}-${index}`)[0].checked = false;
          }
        });
      }
    }
    if (this.chkSelect.length) {
      for (let i = 0; i < this.chkSelect.length; i++) {
        console.log(
          this.chkSelect[i].qtnReportManId,
          this.chkSelect[i].qtnReportDtlId,
          this.chkSelect[i].qtnMainDetail,
          i
        );
      }
      console.log(this.chkSelect.length);
      console.log("----------------------------------");
    } else {
      console.log("Empty!!!!!!!!!!!!!!!");
    }
  };

  chck = (id, what, e, i, table) => {
    e.preventDefault();
    console.log("id: ", id);
    console.log("what: ", what);
    // console.log("e: ", e.target.value);
    // console.log("i: ", i);
    // console.log("table: ", table);
    this[`chk${i}`] = [];
    switch (what) {
      case "man":
        this[`chk${i}`] = this[`chk${i}`].filter(
          obj => obj.qtnReportManId != id
        );

        // console.log(this.chkSelect);
        // //check length dtl
        // if (this.chkSelect.length > 0) {
        //   for (let a = 0; a < this.chkSelect.length; a++) {
        //     // console.log("length: ", this.chkSelect.length);
        //     // console.log(this.chkSelect[a].qtnReportManId, "==", id, a);
        //     // console.log(this.chkSelect.filter(obj => obj.qtnReportManId != id));
        //     if (this.chkSelect[a].qtnReportManId == id) {
        //       //   // this.chkSelect.splice(this.chkSelect.length, 1);
        //       //   // console.log(this.chkSelect);
        //       this.chkSelect = this.chkSelect.filter(
        //         obj => obj.qtnReportManId != id
        //       );
        //     }
        //   }
        // }

        // this.chkSelect.forEach((obj, index) => {
        //   if (obj.qtnReportManId == id) {
        //     let d = this.chkSelect.findIndex(ob => ob.qtnReportManId == id);
        //     this.chkSelect.splice(d, 1);
        //     console.log(this.chkSelect);
        //   }
        // });

        this[`${table}`].map((obj, index) => {
          if (obj.qtnReportManId == id) {
            if (e.target.checked) {
              //check delete
              this.chkSelect.push(obj);

              this[`chk${i}`].push(obj);
              $(`#chk${i}-${index}`)[0].checked = true;
            } else {
              // const del = this[`chk${i}`].findIndex(
              //   ob => ob.qtnReportManId == id
              // );
              const del = this.chkSelect.findIndex(
                ob => ob.qtnReportManId == id
              );
              console.log(del);
              this.chkSelect.splice(del, 1);

              // del != -1 && this[`chk${i}`].splice(del, 1);
              $(`#chk${i}-${index}`)[0].checked = false;
            }
          }
        });
        break;
      case "dtl":
        this[`${table}`].map((obj, index) => {
          if (obj.qtnReportDtlId == id) {
            if (e.target.checked) {
              //check delete
              this.chkSelect.push(obj);

              // this[`chk${i}`].push(obj);
              // $(`#chk${i}-${index}`)[0].checked = true;
            } else {
              // this[`chk${i}`].push(obj);
              // console.log(this[`chk${i}`]);
              // const del = this[`chk${i}`].findIndex(
              //   ob => ob.qtnReportDtlId == id
              // );
              console.log(this.chkSelect);
              const del = this.chkSelect.findIndex(
                ob => ob.qtnReportDtlId == id
              );
              console.log("dtl: ", del);
              this.chkSelect.splice(del, 1);

              // del != -1 && this[`chk${i}`].splice(del, 1);
              // $(`#chk${i}-${index}`)[0].checked = false;
            }
          }
        });
        break;
    }
    // this[`${table}`].length == this[`chk${i}`].length
    //   ? $(`#chk${i}`).prop("checked", true)
    //   : $(`#chk${i}`).prop("checked", false);

    if (this.chkSelect.length > 0) {
      for (let i = 0; i < this.chkSelect.length; i++) {
        console.log(
          this.chkSelect[i].qtnReportManId,
          this.chkSelect[i].qtnReportDtlId,
          this.chkSelect[i].qtnMainDetail,
          i
        );
      }
      console.log(this.chkSelect.length);
      console.log("----------------------------------");
    } else {
      console.log("Empty!!!!!!!!!!!!!!!");
    }
  };

  onAddField = () => {
    this.numbers.push("");
  };

  onDelField = index => {
    this.numbers.splice(index, 1);
  };

  onSaveData = () => {
    this.dataSave = [];
    this.dataSave.push({
      qtnMainDetail: this.mainDetail,
      headerCode: this.headerCode
    });

    for (let i = 0; i < this.numbers.length; i++) {
      this.dataSave.push({
        headerCode: this.headerCode,
        qtnMinorDetail: this.minorDetail[i]
      });
    }

    this.ajax.post(URL.SAVE_DETAIL, JSON.stringify(this.dataSave), res => {
      let data = res.json();
      console.log(data);
    });
  };

  onEditData = data => {
    $(".ui.modal.show").modal("show");
    console.log(this.table);
    this.dataSelect = data;
    this.showEdit = data.qtnMainDetail;
  };

  onUpdate = () => {
    console.log(this.dataSelect);
    if (this.dataSelect.qtnReportHdrId == "NOT NULL") {
      let id = this.dataSelect.qtnReportManId.split("_")[1];
      let dataM = {
        qtnMainDetail: this.showEdit,
        flag: "M"
      };
      this.ajax.post(URL.UPDATE_DETAIL + "/" + id, dataM, res => {
        let data = res.json();
        console.log(data);
        this.msg.successModal(data.messageTh, "สำเร็จ");
      });
    } else {
      let id = this.dataSelect.qtnReportDtlId;
      let dataMi = {
        qtnMinorDetail: this.showEdit,
        flag: "Mi"
      };
      this.ajax.post(URL.UPDATE_DETAIL + "/" + id, dataMi, res => {
        let data = res.json();
        console.log(data);
        this.msg.successModal(data.messageTh, "สำเร็จ");
      });
    }
    $(".ui.modal.show").modal("hide");
  };

  onDeleteData = () => {
    var idM = [];
    var idMi = [];
    console.log(this.table);
    if (this.chkSelect.length) {
      for (let i = 0; i < this.chkSelect.length; i++) {
        if (this.chkSelect[i].qtnReportHdrId == "NOT NULL") {
          let chkid = this.chkSelect[i].qtnReportManId.split("_")[1];
          idM.push(parseInt(chkid));
        } else {
          idMi.push(parseInt(this.chkSelect[i].qtnReportDtlId));
        }
      }
      this.ajax.delete(URL.DELETE_MAINDTL + idM.join(), res => {
        this.ajax.delete(URL.DELETE_MINORDTL + idMi.join(), res => {
          let data = res.json();
          this.msg.successModal(data.messageTh, "สำเร็จ");
        });
      });
    }
  };
}

class Int023FormVo extends BaseModel {
  [x: string]: any;
  qtnReportHdrId: string = null;
  qtnReportManId: string = null;
  qtnReportDtlId: string = null;
  qtnMainDetail: string = "";
  qtnFor: string = "";
}
