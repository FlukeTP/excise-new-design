import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from "@angular/core";
import { AjaxService } from "../../../../../common/services/ajax.service";
import { MessageBarService } from "../../../../../common/services/message-bar.service";
import { BreadCrumb, ResponseData } from 'models/index';
import { ActivatedRoute, Router } from '@angular/router';
import { element, query } from '@angular/core/src/render3';
import { CondGroup } from 'projects/tax-audit/tax-audit-new/trader-selection/ta01/ta0104/ta0104.model';
import { MessageService } from 'services/message.service';
import { FormBuilder, FormGroup } from '@angular/forms';

declare var $: any;

const URLS = {
  updateStatusRiskFactors: "ia/int03/01/03/updataStatusRiskFactors"
}

const URL = {
  QTN_COND_RANGE: "preferences/parameter/IA_COND_RANGE"
}
@Component({
  selector: 'app-int030103',
  templateUrl: './int030103.component.html',
  styleUrls: ['./int030103.component.css']
})
export class Int030103Component implements OnInit {
  breadcrumb: BreadCrumb[];
  listdynamic: any;
  listconfigall: any;
  inspectionWorksetper: any;
  budgetYearsetper: any;
  datas: any[] = [];
  factorsLevel: any;
  dataselect: any;
  dataselecteditstring: any;
  datalistconfigIn: any;
  datalistconfigall: any;
  chackfacetor: any;
  button1: boolean = true;
  button2: boolean = false;
  iaRiskFactorsConfigAll: any;
  idconfigall: any;
  percenCon: boolean = false

  changeCondutionnull: any;
  sum: any
  inputBlank: any

  conditionRange: any;
  conditionNon: any;

  @Input() riskId: any;
  @Input() riskType: any;
  @Input() page: any;
  @Output() out: EventEmitter<number> = new EventEmitter<number>();
  @Output() has: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private ajaxService: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "การประเมินความเสี่ยง", route: "#" },
      { label: "กำหนดเงื่อนไขความเสี่ยงรวม", route: "#" },
      { label: "กำหนดเงื่อนไขความเสี่ยงทั้งหมด", route: "#" }
    ];
    this.inspectionWorksetper = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYearsetper = this.route.snapshot.queryParams["budgetYear"];

    this.getDropdownRange();
    // this.datas = [];
  
    this.getDatalistdynamic();
  
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ia").css("width", "100%");
  }

  percentCheck() {
    var sum = 0
    this.inputBlank = true
    setTimeout(() => {
      var i
      for (i = 0; i < this.listdynamic.length; i++) {
        if (this.listdynamic[i].iaRiskFactorsConfig.percent) {
          sum += parseInt(this.listdynamic[i].iaRiskFactorsConfig.percent)
        } else {
          sum += 0
        }
        if (this.listdynamic[i].iaRiskFactorsConfig.percent == null || this.listdynamic[i].iaRiskFactorsConfig.percent <= 0 || this.listdynamic[i].iaRiskFactorsConfig.percent > 100) {
          this.inputBlank = false
        }
      }
      if (sum != 100) {
        this.percenCon = true
      } else {
        this.percenCon = false
      }
      this.sum = sum
    }, 150);
  }

  varidateForm(factorsLevel: any) {
    let empty = false
    if (factorsLevel == 3) {
      if ($('#valueone0').val() == "" || $('#valueone1').val() == "" || $('#valueone2').val() == ""
        || $('#valuetwo1').val() == "") {
        empty = true
      }
    } else if (factorsLevel == 5) {
      if ($('#valueone0').val() == "" || $('#valueone1').val() == "" || $('#valueone2').val() == ""
        || $('#valueone3').val() == "" || $('#valueone4').val() == "" || $('#valuetwo1').val() == ""
        || $('#valuetwo2').val() == "" || $('#valuetwo3').val() == "") {
        empty = true
      }
    }
    return empty
  }

  getDatalistdynamic = () => {
    var URL = "ia/int03/01/listdynamic";
    this.ajaxService.post(URL, {
      "budgetYear": this.budgetYearsetper,
      "inspectionWork": this.inspectionWorksetper
    }, res => {
      this.listdynamic = res.json();
      let factorsLevel = (this.listdynamic.length != 0) ? parseInt(this.listdynamic[0].iaRiskFactorsConfig.factorsLevel) : 0;
      this.factorsLevel = factorsLevel;
      var listdy = this.listdynamic;
      this.getlistConfigAll();
   
      setTimeout(() => {
        this.percentCheck();
      }, 100);
    })
  }

  getlistConfigAll = () => {
    var URL = "ia/int03/01/03/listConfigAll";
    this.ajaxService.post(URL, {
      "budgetYear": this.budgetYearsetper,
      "inspectionWork": this.inspectionWorksetper
    }, res => {
      this.listconfigall = res.json();
      console.log("listconfigall :",this.listconfigall);
      
      this.setcondation();
      if (this.listconfigall.data.length > 0) {
        this.idconfigall = this.listconfigall.data[0].id;
      } else {
        this.idconfigall = null;
      }
    })
  }

  setcondation() {
    // let factorsLevel = (listdy.length != 0) ? parseInt(listdy[0].iaRiskFactorsConfig.factorsLevel) : 0;
    // console.log("factorsLevel : ", factorsLevel);

    this.datas = [];
    let test = [];
    for (let i = 0; i < this.factorsLevel; i++) {
      this.datas.push(i);
      test.push(new Condition());
    }
    this.datas = test;
    
    this.changeCondutionnull = (this.listconfigall.data.length != 0) ? this.listconfigall.data[0].mediumColor : null;
    console.log("changeCondutionnull",this.changeCondutionnull);
    
    this.checkconditinbutton();
    if(this.factorsLevel == 3){
      if(this.changeCondutionnull == null ){
        console.log("เซ็ต defult ระดับ 3");
        setTimeout(() => {
          $("#condition0").dropdown('set selected', "<");
          $("#conditionTo0").dropdown('set selected', "N");
          $("#condition1").dropdown('set selected', ">=");
          $("#conditionTo1").dropdown('set selected', "<=");
          $("#condition2").dropdown('set selected', ">");
          $("#conditionTo2").dropdown('set selected', "N");
          $("#convertValue0").dropdown('set selected', "ต่ำ");
          $("#convertValue1").dropdown('set selected', "ปานกลาง");
          $("#convertValue2").dropdown('set selected', "สูง");
          $("#color0").dropdown('set selected', "เขียว");
          $("#color1").dropdown('set selected', "เหลือง");
          $("#color2").dropdown('set selected', "แดง");
          $("#valueRl0").val("1");
          $("#valueRl1").val("2");
          $("#valueRl2").val("3");
        }, 500);
      }else{
        console.log("เอาค่าจาก base มาโชว์ ระดับ 3");
        setTimeout(() => {
          var lowComSpil = this.listconfigall.data[0].lowCondition.split("|");
          var mediumComSpil = this.listconfigall.data[0].mediumCondition.split("|");
          var highComSpil = this.listconfigall.data[0].highCondition.split("|");
          $("#condition0").dropdown('set selected', lowComSpil[0]);
          $("#conditionTo0").dropdown('set selected', lowComSpil[1]);
          $("#condition1").dropdown('set selected', mediumComSpil[0]);
          $("#conditionTo1").dropdown('set selected', mediumComSpil[1]);
          $("#condition2").dropdown('set selected', highComSpil[0]);
          $("#conditionTo2").dropdown('set selected', highComSpil[1]);
          $("#convertValue0").dropdown('set selected', this.listconfigall.data[0].low);
          $("#convertValue1").dropdown('set selected', this.listconfigall.data[0].medium);
          $("#convertValue2").dropdown('set selected', this.listconfigall.data[0].high);
          $("#color0").dropdown('set selected', this.listconfigall.data[0].lowColor);
          $("#color1").dropdown('set selected', this.listconfigall.data[0].mediumColor);
          $("#color2").dropdown('set selected', this.listconfigall.data[0].highColor);
          $("#valueRl0").val(this.listconfigall.data[0].lowRating);
          $("#valueRl1").val(this.listconfigall.data[0].mediumRating);
          $("#valueRl2").val(this.listconfigall.data[0].highRating);
          $("#valueone0").val(this.listconfigall.data[0].lowStart)
          $("#valueone1").val(this.listconfigall.data[0].mediumStart)
          $("#valueone2").val(this.listconfigall.data[0].highStart)
          $("#valuetwo0").val(this.listconfigall.data[0].lowEnd)
          $("#valuetwo1").val(this.listconfigall.data[0].mediumEnd)
          $("#valuetwo2").val(this.listconfigall.data[0].highEnd)
        }, 500);
      }
    }else if (this.factorsLevel == 5) {
      if(this.changeCondutionnull == null){
        console.log("เซ็ต defult ระดับ 5");
        setTimeout(() => {
          $("#condition0").dropdown('set selected', "<");
          $("#conditionTo0").dropdown('set selected', "N");
          $("#condition1").dropdown('set selected', ">=");
          $("#conditionTo1").dropdown('set selected', "<");
          $("#condition2").dropdown('set selected', ">=");
          $("#conditionTo2").dropdown('set selected', "<");
          $("#condition3").dropdown('set selected', ">=");
          $("#conditionTo3").dropdown('set selected', "<");
          $("#condition4").dropdown('set selected', ">=");
          $("#conditionTo4").dropdown('set selected', "N");
          $("#convertValue0").dropdown('set selected', "ต่ำมาก");
          $("#convertValue1").dropdown('set selected', "ต่ำ");
          $("#convertValue2").dropdown('set selected', "ปานกลาง");
          $("#convertValue3").dropdown('set selected', "สูง");
          $("#convertValue4").dropdown('set selected', "สูงมาก");
          $("#color0").dropdown('set selected', "เขียวเข้ม");
          $("#color1").dropdown('set selected', "เขียว");
          $("#color2").dropdown('set selected', "เหลือง");
          $("#color3").dropdown('set selected', "ส้ม");
          $("#color4").dropdown('set selected', "แดง");
          $("#valueRl0").val("1");
          $("#valueRl1").val("2");
          $("#valueRl2").val("3");
          $("#valueRl3").val("4");
          $("#valueRl4").val("5");
        }, 500);
      }else{
        console.log("เอาค่าจาก base มาโชว์ ระดับ 5");
        setTimeout(() => {
          var varylow = this.listconfigall.data[0].verylowCondition.split("|");
          var lowComSpil = this.listconfigall.data[0].lowCondition.split("|");
          var mediumComSpil = this.listconfigall.data[0].mediumCondition.split("|");
          var highComSpil = this.listconfigall.data[0].highCondition.split("|");
          var veryhigh = this.listconfigall.data[0].veryhighCondition.split("|");
          $("#condition0").dropdown('set selected', varylow[0]);
          $("#conditionTo0").dropdown('set selected', varylow[1]);
          $("#condition1").dropdown('set selected', lowComSpil[0]);
          $("#conditionTo1").dropdown('set selected', lowComSpil[1]);
          $("#condition2").dropdown('set selected', mediumComSpil[0]);
          $("#conditionTo2").dropdown('set selected', mediumComSpil[1]);
          $("#condition3").dropdown('set selected', highComSpil[0]);
          $("#conditionTo3").dropdown('set selected', highComSpil[1]);
          $("#condition4").dropdown('set selected', veryhigh[0]);
          $("#conditionTo4").dropdown('set selected', veryhigh[1]);
          $("#convertValue0").dropdown('set selected', this.listconfigall.data[0].verylow);
          $("#convertValue1").dropdown('set selected', this.listconfigall.data[0].low);
          $("#convertValue2").dropdown('set selected', this.listconfigall.data[0].medium);
          $("#convertValue3").dropdown('set selected', this.listconfigall.data[0].high);
          $("#convertValue4").dropdown('set selected', this.listconfigall.data[0].veryhigh);
          $("#color0").dropdown('set selected', this.listconfigall.data[0].verylowColor);
          $("#color1").dropdown('set selected', this.listconfigall.data[0].lowColor);
          $("#color2").dropdown('set selected', this.listconfigall.data[0].mediumColor);
          $("#color3").dropdown('set selected', this.listconfigall.data[0].highColor);
          $("#color4").dropdown('set selected', this.listconfigall.data[0].veryhighColor);
          $("#valueRl0").val(this.listconfigall.data[0].verylowRating);
          $("#valueRl1").val(this.listconfigall.data[0].lowRating);
          $("#valueRl2").val(this.listconfigall.data[0].mediumRating);
          $("#valueRl3").val(this.listconfigall.data[0].highRating);
          $("#valueRl4").val(this.listconfigall.data[0].veryhighRating);
          $("#valueone0").val(this.listconfigall.data[0].verylowStart);
          $("#valueone1").val(this.listconfigall.data[0].lowStart);
          $("#valueone2").val(this.listconfigall.data[0].mediumStart);
          $("#valueone3").val(this.listconfigall.data[0].highStart);
          $("#valueone4").val(this.listconfigall.data[0].veryhighStart);
          $("#valuetwo0").val(this.listconfigall.data[0].verylowEnd);
          $("#valuetwo1").val(this.listconfigall.data[0].lowEnd);
          $("#valuetwo2").val(this.listconfigall.data[0].mediumEnd);
          $("#valuetwo3").val(this.listconfigall.data[0].highEnd);
          $("#valuetwo4").val(this.listconfigall.data[0].veryhighEnd);
        }, 500);
      }
    }
  }



  getDropdownRange() {
    this.ajaxService.doPost(URL.QTN_COND_RANGE, {}).subscribe((result: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.conditionRange = result.data;
        this.conditionNon = this.conditionRange.filter(function (value) {
          return value.valuetwo != 'N'
        })
        console.log("conditionRange :", this.conditionRange);
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

  checkconditinbutton() {
    this.changeCondutionnull = (this.listconfigall.data.length != 0) ? this.listconfigall.data[0].mediumColor : null;
    if (this.changeCondutionnull == null) {
      this.button1 = true;
      this.button2 = false;
    } else {
      this.button1 = false;
      this.button2 = true;
    }
  }

  editCondition(e) {
    e.preventDefault();
    if (this.percenCon) {
      this.messageBar.errorModal(`ค่าเปอร์เซ็นรวมไม่เท่ากับ 100%`)
      return
    }
    if (!this.inputBlank) {
      this.messageBar.errorModal(`เปอร์เซ็นแต่ละความเสี่ยงต้องมากกว่า 0%`)
      return
    }
    if (this.varidateForm(this.getdatacondition().factorsLevel)) {
      console.log("form is null");
      this.messageBar.errorModal(`กรุณากำหนดเงื่อนไขความเสี่ยงให้ครบ`)
      return
    }
    // -----------------------------------
    // console.log(this.listdynamic);

    // return
    var j = 0;
    var datasetlist = [];
    this.listdynamic.forEach(element => {
      var dataset = {
        "percent": $('#percent' + j).val(),
        "id": $('#idConfigSet' + j).val()
      };
      datasetlist.push(dataset);
      j++;
    });
    this.messageBar.comfirm((res) => {
      if (res) {
        $('.ui.sidebar').sidebar({
          context: '.ui.grid.pushable'
        })
          .sidebar('setting', 'transition', 'push')
          .sidebar('setting', 'dimPage', false)
          .sidebar('hide');
        var iaRiskFactorsConfigAll = this.getdatacondition();
        const URL = "ia/int03/01/03/updataConfigAll";

        if (iaRiskFactorsConfigAll.factorsLevel == 3) {
          iaRiskFactorsConfigAll.lowStart = this.checknull($("#valueone0").val())
          iaRiskFactorsConfigAll.mediumStart = this.checknull($("#valueone1").val())
          iaRiskFactorsConfigAll.mediumEnd = this.checknull($("#valuetwo1").val())
          iaRiskFactorsConfigAll.highStart = this.checknull($("#valueone2").val())
          
        } else if (iaRiskFactorsConfigAll.factorsLevel == 5) {
          iaRiskFactorsConfigAll.verylowStart = this.checknull($("#valueone0").val())

          iaRiskFactorsConfigAll.lowStart = this.checknull($("#valueone1").val())
          iaRiskFactorsConfigAll.lowEnd = this.checknull($("#valuetwo1").val())

          iaRiskFactorsConfigAll.mediumStart = this.checknull($("#valueone2").val())
          iaRiskFactorsConfigAll.mediumEnd = this.checknull($("#valuetwo2").val())

          iaRiskFactorsConfigAll.highStart = this.checknull($("#valueone3").val())
          iaRiskFactorsConfigAll.highEnd = this.checknull($("#valuetwo3").val())

          iaRiskFactorsConfigAll.veryhighStart = this.checknull($("#valueone4").val())
        }

        this.ajaxService.doPost(URL, {
          iaRiskFactorsConfigList: datasetlist,
          iaRiskFactorsConfigAll: iaRiskFactorsConfigAll
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.updateStatusRiskFactors()
            this.messageBar.successModal(res.message, "สำเร็จ", event => {
              if (event) {
                window.location.reload();
              }
            });
          } else {
            this.messageBar.errorModal(res.message);
          }
        })
      }
    }, "ยืนยันการการบันทึกข้อมูล")
    // }, "ยืนยันการการแก้ไขข้อมูล")
  }

  updateStatusRiskFactors() {
    let idFactorList = []
    for (let i = 0; i < this.listdynamic.length; i++) {
      idFactorList[i] = this.listdynamic[i].iaRiskFactors.id
    }
    console.log(idFactorList);
    this.ajaxService.doPost(URLS.updateStatusRiskFactors, { ids: idFactorList })
      .subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.messageBar.successModal(res.message)
        } else {
          this.messageBar.errorModal(res.message);
        }
      })
  }

  addRow() {
    this.datas.length < 5 && this.datas.push(new Condition());
  }

  delRow(index) {
    if (this.datas.length > 3) {
      this.datas.splice(index, 1);
    } else {
      this.messageBar.errorModal("เงื่อนไขต้องมีอย่างน้อย 3 เงื่อนไข");
    }
  }

  saveCondition(e) {
    e.preventDefault();
    if (this.percenCon) {
      this.messageBar.errorModal(`ค่าเปอร์เซ็นรวมไม่เท่ากับ 100%`)
      return
    }
    if (!this.inputBlank) {
      this.messageBar.errorModal(`เปอร์เซ็นแต่ละความเสี่ยงต้องมากกว่า 0%`)
      return
    }
    if (this.varidateForm(this.getdatacondition().factorsLevel)) {
      console.log("form is null");
      this.messageBar.errorModal(`กรุณากำหนดเงื่อนไขความเสี่ยงให้ครบ`)
      return
    }
    //------------------------------------


    var j = 0;
    var datasetlist = [];
    this.listdynamic.forEach(element => {
      var dataset = {
        "percent": $('#percent' + j).val(),
        "id": $('#idConfigSet' + j).val()
      };
      datasetlist.push(dataset);
      j++;
    });
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        var iaRiskFactorsConfigAll = this.getdatacondition();
        const URL = "ia/int03/01/03/updatePercent";
        this.ajaxService.doPost(URL, {
          iaRiskFactorsConfigList: datasetlist,
          iaRiskFactorsConfigAll: iaRiskFactorsConfigAll
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.updateStatusRiskFactors()
            this.messageBar.successModal(res.message, "สำเร็จ", event => {
              if (event) {
                window.location.reload();
              }
            });
          } else {
            this.messageBar.errorModal(res.message);
          }
        })
      }
    }, "ยืนยันการบันทึก");
  }

  getdatacondition() {
    var i = 1;
    this.datas.forEach(element => {
      i++;
      element.parentId = this.riskId;
    });
    if (i - 1 == this.datas.length) {
      var url = "ia/int03/01/saveRiskFactorsConfig";
      let data = [];
      this.datas.forEach(element => {
        element.parentId = this.riskId;
        element.riskType = this.riskType;
        element.page = this.page;
        element.conditionId = element.conditionId == '' ? null : element.conditionId;
        element.condition = element.condition == '' ? null : element.condition;
        element.valueone = element.valueone == '' ? null : element.valueone;
        element.valuetwo = element.valuetwo == '' ? null : element.valuetwo;
        element.valueRl = element.valueRl == '' ? null : element.valueRl;
        element.color = element.color == '' ? null : element.color;
        data.push(element);
      });
      if (this.factorsLevel == 3) {
        this.iaRiskFactorsConfigAll = {
          id: this.idconfigall,
          budgetYear: this.budgetYearsetper,
          inspectionWork: this.inspectionWorksetper,
          factorsLevel: this.factorsLevel,
          low: data[0].convertValue,
          lowStart: this.checknull($("#valueone0").val()),
          lowEnd: this.checknull($("#valuetwo0").val()),
          lowRating: $("#valueRl0").val(),
          lowColor: data[0].color,
          lowCondition: $("#condition0").val() + "|" + $("#conditionTo0").val(),
          medium: data[1].convertValue,
          mediumStart: this.checknull($("#valueone1").val()),
          mediumEnd: this.checknull($("#valuetwo1").val()),
          mediumRating: $("#valueRl1").val(),
          mediumColor: data[1].color,
          mediumCondition: $("#condition1").val() + "|" + $("#conditionTo1").val(),
          high: data[2].convertValue,
          highStart: this.checknull($("#valueone2").val()),
          highEnd: this.checknull($("#valuetwo2").val()),
          highRating: $("#valueRl2").val(),
          highColor: data[2].color,
          highCondition: $("#condition2").val() + "|" + $("#conditionTo2").val()
        }
      }
      else if (this.factorsLevel == 5) {
        this.iaRiskFactorsConfigAll = {
          id: this.idconfigall,
          budgetYear: this.budgetYearsetper,
          inspectionWork: this.inspectionWorksetper,
          factorsLevel: this.factorsLevel,
          verylow: data[0].convertValue,
          verylowStart: this.checknull($("#valueone0").val()),
          verylowEnd: this.checknull($("#valuetwo0").val()),
          verylowRating: $("#valueRl0").val(),
          verylowColor: data[0].color,
          verylowCondition: $("#condition0").val() + "|" + $("#conditionTo0").val(),
          low: data[1].convertValue,
          lowStart: this.checknull($("#valueone1").val()),
          lowEnd: this.checknull($("#valuetwo1").val()),
          lowRating: $("#valueRl1").val(),
          lowColor: data[1].color,
          lowCondition: $("#condition1").val() + "|" + $("#conditionTo1").val(),
          medium: data[2].convertValue,
          mediumStart: this.checknull($("#valueone2").val()),
          mediumEnd: this.checknull($("#valuetwo2").val()),
          mediumRating: $("#valueRl2").val(),
          mediumColor: data[2].color,
          mediumCondition: $("#condition2").val() + "|" + $("#conditionTo2").val(),
          high: data[3].convertValue,
          highStart: this.checknull($("#valueone3").val()),
          highEnd: this.checknull($("#valuetwo3").val()),
          highRating: $("#valueRl3").val(),
          highColor: data[3].color,
          highCondition: $("#condition3").val() + "|" + $("#conditionTo3").val(),
          veryhigh: data[4].convertValue,
          veryhighStart: this.checknull($("#valueone4").val()),
          veryhighEnd: this.checknull($("#valuetwo4").val()),
          veryhighRating: $("#valueRl4").val(),
          veryhighColor: data[4].color,
          veryhighCondition: $("#condition4").val() + "|" + $("#conditionTo4").val()
        }
      }
      return this.iaRiskFactorsConfigAll;
    }
  }

  golocation() {
    this.router.navigate(['/int03/06'], {
      queryParams: {
        inspectionWork: this.inspectionWorksetper,
        budgetYear: this.budgetYearsetper
      }
    });
  }

  checknull(data) {
    var rel = "";
    (data) ? rel = data : rel = "";
    return rel
  }

  cancel() {
    this.out.emit(this.riskId);
  }

  changeCondution(i) {
    console.log("iiiii : ", i);
    var datamurt = "conditionTo" + i;
    switch (this.datas[i].condition) {
      case "<=":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", false);
        // $('#conditionTo' + i).dropdown('set selected', ">=");
        // $(`.${datamurt}`).removeClass("disabled");
        $('#valuetwo' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: $('#valueone' + i).val() | 0
          });
          $('#valueone' + i).attr({
            max: e.target.value
          });
        });
        $('#valueone' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: e.target.value | 0
          });
          $('#valueone' + i).attr({
            max: $('#valuetwo' + i).val()
          });
        });
        break;
      case ">=":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", false);
        // $('#conditionTo' + i).dropdown('set selected', "<=");
        // $(`.${datamurt}`).removeClass("disabled");
        $('#valuetwo' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: $('#valueone' + i).val() | 0
          });
          $('#valueone' + i).attr({
            max: e.target.value
          });
        });
        $('#valueone' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: e.target.value | 0
          });
          $('#valueone' + i).attr({
            max: $('#valuetwo' + i).val()
          });
        });
        break;
      case ">":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", true);
        // $(`.${datamurt}`).addClass("disabled");
        // $('#conditionTo' + i).dropdown('set selected', "N");
        break;
      case "<":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", true);
        // $(`.${datamurt}`).addClass("disabled");
        // $('#conditionTo' + i).dropdown('set selected', "N");
        break;
      case "=":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", true);
        $(`.${datamurt}`).addClass("disabled");
        $('#conditionTo' + i).dropdown('set selected', "N");
        break;
    }
  }

  changeCondutionTo(i) {
    var datamurt = "conditionTo" + i;
    switch (this.datas[i].conditionTo) {
      case "N":
        $('#valuetwo' + i).prop("disabled", true);
        break;
        case ">":
        $('#valuetwo' + i).prop("disabled", false);
        break;
        case "<":
        $('#valuetwo' + i).prop("disabled", false);
        break;
        case ">=":
        $('#valuetwo' + i).prop("disabled", false);
        break;
        case "<=":
        $('#valuetwo' + i).prop("disabled", false);
        break;
    }
  }

  isEmpty(value) {
    return value == null || value == undefined || value == '';
  }

}

class Condition {
  conditionId: any;
  parentId: any;
  condition: any = "<>";
  valueone: any;
  valuetwo: any;
  valueRl: any;
  convertValue: any;
  color: any;
  riskType: any = '';
  page: any;
}
