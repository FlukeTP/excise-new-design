import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-tax-audit-reporting",
  templateUrl: "./tax-audit-reporting.component.html",
  styleUrls: ["./tax-audit-reporting.component.css"]
})
export class TaxAuditReportingComponent implements OnInit {
  typeDocs: String[];
  topics: String[][];
  topic: String[];

  selectDoc: String;
  selectTop: String;

  selectedDoc: String;
  selectedTop: String;

  sent: boolean;

  constructor(
    private route: ActivatedRoute,
  ) {
    // Mock Data
    this.typeDocs = ["บันทึกข้อความ", "แบบ ตส.","แบบตรวจปฏิบัติการ"];
    this.topics = [
      [
        "ขออนุมัติเดินทางไปปฏิบัติราชการ",
        "รายงานผลการตรวจติดตามแนะกำกับดูแล"
      ],
      [
        "ตส. 01-01",
        "ตส. 01-02",
        "ตส. 01-03",
        "ตส. 01-04",
        "ตส. 01-05",
        "ตส. 01-07",
        "ตส. 01-08",
        "ตส. 01-10",
        "ตส. 01-10/1",
        "ตส. 01-11",
        "ตส. 01-13",
        "ตส. 01-14",
        "ตส. 01-14/1",
        "ตส. 01-14/2",
        "ตส. 01-15",
        "ตส. 01-16",
        "ตส. 01-17",
        "ตส. 01-17/1",      
        "ตส. 01-18",
        "ตส. 01-19"
      ],
      [
        "Solvent-01",
        "Solvent-02",
      ],
    ];
    this.topic = [];
    this.sent = false; // false
    this.selectedTop = ""; // ''
  }

  ngOnInit ()  { 
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");

    console.log("typeDocs : ",this.route.snapshot.queryParams["typeDocs"]);
    console.log("topics : ",this.route.snapshot.queryParams["topics"]);
    
    let typeDocs = this.route.snapshot.queryParams["typeDocs"];
    let topics = this.route.snapshot.queryParams["topics"];
    if(typeDocs!=""&&typeDocs!=null&&topics!=""&&topics!=null){
      let typeDocsIndex = 1;
      let topicsIndex = 0;
  
      setTimeout(() => {
        $("#doc").dropdown('set selected',typeDocsIndex);
        console.log("typeDocs : ",typeDocs);
        setTimeout(() => {
          for(let i = 0;i<this.topic.length;i++){
            if(this.topic[i]==topics){
                console.log("this.topic[i] : ",this.topic[i]+" topics :"+topics);
                $("#topic").dropdown('set selected',this.topic[i]);
            }
          }
          },500);
         
        },1000);
       
        setTimeout(() => {
          $("#submitDoc").click();
        },2500);
    }
   
  }

  onSelectDoc = event => {
    this.topic = this.topics[event.target.value];
    this.selectDoc = this.typeDocs[event.target.value];
  };

  onSelectTop = event => {
    this.selectTop = this.topic[event.target.value];
  };

  onSubmit = e => {
    e.preventDefault();
    // show form generate pdf
    this.sent = true;
    this.selectedTop = this.selectTop;
  };

  onDiscard = event => {
    // hide form generate pdf
    this.sent = event;
  };
}
