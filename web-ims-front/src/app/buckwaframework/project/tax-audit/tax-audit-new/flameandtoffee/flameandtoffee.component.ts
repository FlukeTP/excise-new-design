import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';


declare var $: any;
@Component({
  selector: 'app-flameandtoffee',
  templateUrl: './flameandtoffee.component.html',
  styleUrls: ['./flameandtoffee.component.css']
})
export class FlameandtoffeeComponent implements OnInit {
  table: any;
  datas: any;

  constructor(private ajax: AjaxService, ) { }

  ngOnInit() {
    
    this.tablePlan();
  }
  onSubmit = e => {
    var form = document.createElement("form");
    form.method = "POST";
    form.target = "_blank";
    form.action = AjaxService.CONTEXT_PATH + "lubricant/pdf/oa/lubricantService";
    form.style.display = "none";
    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    form.appendChild(jsonInput);
    document.body.appendChild(form);
    form.submit();

  };


  tablePlan = () => {
    this.table = $("#tableDetail").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      data: this.datas,
      columns: [
     
      ],
    });

  
  }
  
}
