import { Component, OnInit } from '@angular/core';

import { AjaxService } from 'services/ajax.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { BreadCrumb } from 'models/breadcrumb.model';

declare var $: any;

@Component({
  selector: 'app-int0504admin',
  templateUrl: './int0504admin.component.html',
  styleUrls: ['./int0504admin.component.css']
})
export class Int0504adminComponent implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบพัสดุ", route: "#" },
    { label: "ตรวจสอบจัดซื้อจัดจ้าง ", route: "#" },
    { label: "ตรวจสอบผลการจัดซื้อจัดจ้าง", route: "#" },
  ];
  travelTo1List: any;
  travelTo2List: any;
  travelTo3List: any;

  travelTo1AddList: any;
  travelTo2AddList: any;
  travelTo3AddList: any;

  travelToDescription: any;

  constructor(
    private ajax: AjaxService,
  ) { }

  ngOnInit() {

    this.travelTo1Dropdown();
    this.travelTo1AddDropdown();
    this.calender();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown").css("width", "100%");
  }
  calender() {
    $("#date3").calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter("year"),
      onChange: (date, text, mode) => {
        // this.formSearch.get('qtnYear').setValue(text);
      }
    }).calendar('set date', '2018');
    // $("#pickyear").calendar({
    // })
  }
  travelTo1Dropdown = () => {

    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "SECTOR_VALUE" }, res => {
      this.travelTo1List = res.json();
    });
  }
  travelTo2Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo2List = res.json();
        this.setTravelTo(e);
      });
    }
  }
  travelTo3Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo3List = res.json();
        this.setTravelTo(e);
      });
    }
  }



  travelTo1AddDropdown = () => {
    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "SECTOR_VALUE" }, res => {
      this.travelTo1AddList = res.json();
    });
  }
  travelTo2AddDropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo2AddList = res.json();
        this.setTravelToAdd(e);
      });
    }
  }
  travelTo3AddDropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo3AddList = res.json();
        this.setTravelToAdd(e);
      });
    }
  }
  setTravelTo = e => {
    $('#travelTo').val(e.target.value);
    $('#travelToId').val(e.target.value);

  }

  setTravelToAdd = e => {
    $('#travelToAdd').val(e.target.value);
    $('#travelToIdAdd').val(e.target.value);

    if ($("#travelTo3Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text() + " " + $('#travelTo2Add option:selected').text() + " " + $('#travelTo3Add option:selected').text();
    } else if ($("#travelTo2Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text() + " " + $('#travelTo2Add option:selected').text();
    } else if ($("#travelTo1Add").val() != "") {
      this.travelToDescription = $('#travelTo1Add option:selected').text();
    }
    console.log("TravelToDescription : ", this.travelToDescription);
  }

}
