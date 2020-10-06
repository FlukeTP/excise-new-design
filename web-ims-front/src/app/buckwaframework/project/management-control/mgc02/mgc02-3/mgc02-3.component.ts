import { Component, OnInit, Input } from "@angular/core";
import { formatter, TextDateTH } from "../../../../common/helper/datepicker";
import { AuthService } from "services/auth.service";
declare var $: any;
@Component({
  selector: "app-mgc02-3",
  templateUrl: "./mgc02-3.component.html"
})
export class Mgc023Component implements OnInit {
  @Input() year: any;
  products: String[];
  zones: String[];
  selectProduct: String;
  selectZone: String;

  constructor(  private authService: AuthService) {
    this.products = [
      "ทั้งหมด",
      "สินค้าน้ำมันและผลิตภัณฑ์น้ำมัน",
      "สินค้าเครื่องดื่ม",
      "สินค้าเครื่องไฟฟ้า",
      "สินค้าแบตเตอรี่",
      "สินค้าแก้วและเครื่องแก้ว",
      "สินค้ารถยนต์",
      "สินค้ารถจักรยานยนต์",
      "สินค้าเรือ",
      "สินค้าผลิตภัณฑ์เครื่องหอมและเครื่องสำอาง",
      "สินค้าพรมและสิ่งทอปูพื้นอื่นๆ",
      "สินค้าหินอ่อนและหินแกรนิต",
      "สินค้าสารทำลายชั้นบรรยากาศ",
      "สินค้าไพ่",
      "กิจการบันเทิงหรือหย่อนใจ",
      "กิจการเสี่ยงโชค",
      "กิจการที่มีผลกระทต่อสิ่งแวดล้อม",
      "กิจการที่ได้รับอนุญาตหรือสัมปทานจากรัฐ"
    ];
    this.zones = [
      "ทั้งหมด",
      "ภาค1",
      "ภาค2",
      "ภาค3",
      "ภาค4",
      "ภาค5",
      "ภาค6",
      "ภาค7",
      "ภาค8",
      "ภาค9",
      "ภาค10",
      "ภาคกลาง"
    ];
  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('REP-02023');

  }

  onSelectProducts = event => {
    this.selectProduct = this.products[event.target.value];
  };

  onSelectZones = event => {
    this.selectZone = this.zones[event.target.value];
  };
}
