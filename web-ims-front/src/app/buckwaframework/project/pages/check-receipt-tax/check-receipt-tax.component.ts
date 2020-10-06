import { Component, OnInit } from "@angular/core";

declare var $: any;
@Component({
  selector: "check-receipt-tax",
  templateUrl: "./check-receipt-tax.component.html",
  styleUrls: ["./check-receipt-tax.component.css"]
})
export class CheckReceiptTaxComponent implements OnInit {
  codeList: any[];
  productList: any[];
  printMonthList: any[];

  selectedProduct: string = "เครื่องดื่ม";

  constructor() {}

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.codeList = [
      { value: "1 : ภาษีสุรา ยาสูบ เครื่องดื่ม" },
      { value: "2 : ภาษีอื่น(นอกจากสุรา ยาสูบ เครื่องดื่ม)" },
      { value: "3 : รายได้อื่นนอกจากภาษี" }
    ];

    this.productList = [
      { value: "เครื่องดื่ม" },
      { value: "สุราแช่" },
      { value: "สุราแช่ชุมชน" },
      { value: "สุรากลั่น" },
      { value: "สุรากลั่นชุมชน" },
      { value: "ยาสูบ" }
    ];

    this.printMonthList = [
      { value: "ตุลาคม" },
      { value: "พฤศจิกายน" },
      { value: "ธันวาคม" },
      { value: "มกราคม" },
      { value: "กุมภาพันธ์" },
      { value: "มีนาคม" },
      { value: "เมษายน" },
      { value: "พฤษภาคม" },
      { value: "มิถุนายน" },
      { value: "กรกฎาคม" },
      { value: "สิงหาคม" },
      { value: "กันยายน" }
    ];
  }

  onChange(newValue) {
    this.selectedProduct = newValue; // don't forget to update the model here
  }

  ngAfterViewInit() {
    this.initDatatable();
  }

  initDatatable() {
    let tableMock = [
      {
        "1": "สุราแช่ชุมชน",
        "2": "1",
        "3": "07/10/60",
        "4": "239810",
        "5": "1480",
        "6": "10000.00",
        "7": "1000",
        "8": "950",
        "9": "50",
        "10": "11000.00",
        "11": "75",
        "12": "100",
        "13": "9825.00"
      },
      {
        "1": "สสสสุรา",
        "2": "3",
        "3": "07/10/60",
        "4": "239811",
        "5": "1481",
        "6": "200.00",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "200",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "กกทสุรา",
        "2": "3",
        "3": "07/10/60",
        "4": "239813",
        "5": "1482",
        "6": "200.00",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "200",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "สสทสุรา",
        "2": "4",
        "3": "07/10/60",
        "4": "239814",
        "5": "1483",
        "6": "150.00",
        "7": "147.75",
        "8": "2.25",
        "9": "0",
        "10": "150",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "เครื่องหอม",
        "2": "3",
        "3": "08/10/60",
        "4": "239815",
        "5": "1484",
        "6": "379.35",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "379.35",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "เครื่องหอม",
        "2": "3",
        "3": "08/10/60",
        "4": "239816",
        "5": "1485",
        "6": "570.00",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "570",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "ใบขน",
        "2": "4",
        "3": "09/10/60",
        "4": "239817",
        "5": "1488",
        "6": "600.00",
        "7": "591",
        "8": "9",
        "9": "0",
        "10": "600",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "เครื่องดื่ม",
        "2": "1",
        "3": "10/10/60",
        "4": "239818",
        "5": "1489",
        "6": "2000.00",
        "7": "200",
        "8": "190",
        "9": "10",
        "10": "2200",
        "11": "15",
        "12": "20",
        "13": "1965"
      },
      {
        "1": "เครื่องดื่ม",
        "2": "1",
        "3": "10/10/60",
        "4": "239819",
        "5": "1490",
        "6": "3740.00",
        "7": "374",
        "8": "355.3",
        "9": "18.7",
        "10": "4114",
        "11": "28.05",
        "12": "37.4",
        "13": "3674.55"
      },
      {
        "1": "สุราแช่",
        "2": "1",
        "3": "11/10/60",
        "4": "239820",
        "5": "1491",
        "6": "1275.00",
        "7": "127.5",
        "8": "121.12",
        "9": "6.38",
        "10": "1402.5",
        "11": "9.56",
        "12": "12.75",
        "13": "1252.69"
      },
      {
        "1": "สสสสุรา",
        "2": "3",
        "3": "11/10/60",
        "4": "239823",
        "5": "1492",
        "6": "25.50",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "25.5",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "กกทสุรา",
        "2": "3",
        "3": "11/10/60",
        "4": "239824",
        "5": "1493",
        "6": "25.50",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "25.5",
        "11": "0",
        "12": "0",
        "13": "0"
      },
      {
        "1": "สสทสุรา",
        "2": "4",
        "3": "11/10/60",
        "4": "239825",
        "5": "1494",
        "6": "18.83",
        "7": "18.55",
        "8": "0.28",
        "9": "0",
        "10": "18.83",
        "11": "0",
        "12": "0",
        "13": "0"
      }
    ];

    let backgroundRowColor = (data, type, row, meta) => {
      let table = $("#table1").DataTable();
      let rowTable = table.row(meta.row).node();
      if (meta.row == 1 || meta.row == 2 || meta.row == 9 || meta.row == 10) {
        $(rowTable)
          .find("td:nth-child(3)")
          .addClass("bg-row-highlight");
      } else if (meta.row == 5 || meta.row == 6) {
        $(rowTable)
          .find("td:nth-child(4)")
          .addClass("bg-row-orange-highlight");
      }
      return data;
    };

    $("#table1").DataTable({
      lengthChange: false,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: false,
      info: false,
      pagingType: "full_numbers",
      data: tableMock,
      columns: [
        {
          data: "1"
        },
        {
          data: "3",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "4",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "5",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "6",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "7",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "8",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "9",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "10",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "11",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "12",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "13",
          render: backgroundRowColor,
          className: "right"
        },
        {
          data: "13",
          render: function() {
            return `<a class="edit">แก้ไข</a>`;
          }
        }
      ],
      rowCallback: (row, data, index) => {
        $("td > .edit", row).bind("click", () => {
          this.popupEditData();
        });
      }
    });
  }

  popupEditData() {
    $("#modalEditData").modal("show");
  }

  closePopupEdit() {
    $("#modalEditData").modal("hide");
  }
}
