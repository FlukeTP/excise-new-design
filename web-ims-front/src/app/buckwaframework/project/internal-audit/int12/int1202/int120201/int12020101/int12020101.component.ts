import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { AssetBalance } from 'models/AssetBalance';
import { AssetMaintenance } from 'models/AssetMaintenance';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { BreadCrumb } from 'models/breadcrumb.model';


const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId"
};
declare var $: any;
@Component({
  selector: 'app-int12020101',
  templateUrl: './int12020101.component.html',
  styleUrls: ['./int12020101.component.css']
})
export class Int12020101Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "บันทึกข้อมูล", route: "#" },
    { label: "ข้อมูลสินทรัพย์ ", route: "#" },
    { label: "เพิ่มข้อมูลสินทรัพย์ ", route: "#" },
  ];
  assetBalance: AssetBalance;
  assetMaintenance: AssetMaintenance;
  day: any = 0;
  month: any = 0;
  year: any = 0;

  id: any;
  act: any;
  ddtAssetType: any[] = [];
  constructor(
    private router: Router,
    private ajax: AjaxService,
    private messageBarService: MessageBarService,
    private route: ActivatedRoute
    ) {

    this.assetBalance = new AssetBalance();
    this.assetMaintenance = new AssetMaintenance();


  }



  ngOnInit() {
    

    $('#documentDate').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        console.log(date);
        this.assetBalance.documentDate = this.dataYear(date);
      }
    });

    $('#dateOfManufacture').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        console.log(date);
        this.assetBalance.dateOfManufacture = this.dataYear(date);
      }

    });

    $('#maintenanceDate').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        console.log(date);
        this.assetMaintenance.maintenanceDate = date;
      }

    });




    this.ajax.post(URL.DROPDOWN, { type: "ASSET_TYPE" }, res => {
      this.ddtAssetType = res.json();
      console.log(this.ddtAssetType);
    });



    this.id = this.route.snapshot.queryParams["id"];
    this.act = this.route.snapshot.queryParams["act"];
    if (this.act == undefined) {
      this.act = '';
    }
    if (this.id == undefined) {
      this.id = '';
    }

    if (this.act == 'addDetail') {
      $('#assetBalance').hide();
      this.ajax.post("ia/int0533/getCountAssetMaintenance", { assetBalanceId: this.id }, res => {
        console.log(res.json());
        this.assetMaintenance.maintenanceAmount = res.json() + 1;
      });
    } else {
      $('#assetMaintenance').hide();
    }
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    if (this.act == 'edit') {
      this.ajax.post("ia/int0533/findAssetBalance", { assetBalanceId: this.id }, res => {
        let value = res.json();
        this.assetBalance = value.assetBalance;
        this.year = value.year;
        this.month = value.month;
        this.day = value.day;
        console.log(this.assetBalance.documentDate);
        let docDate = this.assetBalance.documentDate;
        $('#documentDateField').val(this.dataPattle(new Date(this.assetBalance.documentDate)));
        let manrFac = this.assetBalance.dateOfManufacture;
        $('#dateOfManufactureField').val(this.dataPattle(new Date(this.assetBalance.dateOfManufacture)));
      });


    }

  }


  addAction() {

    if (Utils.isNull(this.assetBalance.governmentSector)) {
      this.messageBarService.errorModal("กรุณากรอก \"ส่วนราชการ\"", 'แจ้งเตือน');
      return;
    }
    if (Utils.isNull(this.assetBalance.institute)) {
      this.messageBarService.errorModal("กรุณากรอก \"หน่วยงาน\"", 'แจ้งเตือน');
      return;
    }

    if (Utils.isNull(this.assetBalance.dateOfManufacture)) {
      this.messageBarService.errorModal("กรุณากรอก \"วันที่ผลิต/ใช้งาน\"", 'แจ้งเตือน');
      return;
    }

    this.day = Utils.isNull(this.day) ? 0 : this.day;
    this.month = Utils.isNull(this.month) ? 0 : this.month;
    this.year = Utils.isNull(this.year) ? 0 : this.year;
    this.assetBalance.totlePriceAsset = this.assetBalance.unitPriceAsset * this.assetBalance.assetAmount;
    var url = "ia/int0533/addAssetBalance";
    this.ajax.post(url, { assetBalance: this.assetBalance, day: this.day, month: this.month, year: this.year }, res => {
      var message = res.json();

      if (message.messageType == 'E') {
        this.messageBarService.errorModal(message.messageTh, 'แจ้งเตือน');
      } else {
        this.messageBarService.successModal(message.messageTh, 'บันทึกข้อมูลสำเร็จ');
        this.router.navigate(["/int05/3/3"], {

        });
      }

    });
  }

  addAssetMaintenanceAction() {

    this.assetMaintenance.assetBalanceId = this.id;
    if (Utils.isNull(this.assetMaintenance.maintenanceDate)) {
      this.messageBarService.errorModal("กรุณากรอก \"วันที่ซ่อมบำรุงรักษา\"", 'แจ้งเตือน');
      return;
    }
    if (Utils.isNull(this.assetMaintenance.maintenancePrice)) {
      this.messageBarService.errorModal("กรุณากรอก \"จำนวนเงินค่าซ่อมบำรุงรักษา\"", 'แจ้งเตือน');
      return;
    }
    var url = "ia/int0533/addAssetMaintenance";
    this.ajax.post(url, { assetMaintenance: this.assetMaintenance }, res => {
      var message = res.json();

      if (message.messageType == 'E') {
        this.messageBarService.errorModal(message.messageTh, 'แจ้งเตือน');
      } else {
        this.messageBarService.successModal(message.messageTh, 'บันทึกข้อมูลสำเร็จ');
        this.router.navigate(["/int05/3/3"], {

        });
      }

    });
  }

  cancel() {
    this.router.navigate(['int12/02/01'], {

    });
  }


  dataPattle(date) {
    console.log("dataPattle", date);
    let _year;
    if (date.getFullYear() > (new Date().getFullYear() + 500)) {
      _year = [`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`][0].split("/")[2];
    } else {
      const _date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); // Date.UTC()
      _year = _date.toLocaleString('th-TH', { timeZone: 'UTC' }).split(" ")[0].split("/")[2];
    }
    if (!date) return "";
    let day = date.getDate();
    let month = date.getMonth();

    return (day < 10 ? "0" : "") + day + " " + TextDateTH.months[month] + " " + _year.toString();
  }

  dataYear(date) {
    //console.log("dataYear", date);
    const _date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var spDate = _date.toLocaleString('th-TH', { timeZone: 'UTC' }).split(" ")[0].split("/");


    return spDate[2] + '-' + spDate[1] + '-' + spDate[0] + 'T00:00:00';
  }


}
