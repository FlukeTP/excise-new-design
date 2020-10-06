import { Component, AfterViewInit } from "@angular/core";
import * as Chart from "chart.js";
import { AuthService } from "services/auth.service";
import { Mgc012Service } from "./mgc01-2.service";
declare var $: any;
@Component({
  selector: "app-mgc01-2",
  templateUrl: "./mgc01-2.component.html",
  styleUrls: ["./mgc01-2.component.css"],
  providers: [Mgc012Service]
})
export class Mgc012Component implements AfterViewInit {
  canvas: any;
  ctx: any;

  sector1: any = null;
  sector2: any = null;
  sector3: any = null;
  sector4: any = null;
  sector5: any = null;
  sector6: any = null;
  sector7: any = null;
  sector8: any = null;
  sector9: any = null;
  sector10: any = null;
  center: any = null;

  sector1Txt: any = null;
  sector2Txt: any = null;
  sector3Txt: any = null;
  sector4Txt: any = null;
  sector5Txt: any = null;
  sector6Txt: any = null;
  sector7Txt: any = null;
  sector8Txt: any = null;
  sector9Txt: any = null;
  sector10Txt: any = null;

  constructor(
    private authService: AuthService,
    private mgc012Service: Mgc012Service
  ) { }

  ngAfterViewInit() {
    //this.authService.reRenderVersionProgram('REP-01012');

    this.mgc012Service.getData().then(res => {

      this.setData(res);

      this.canvas = <HTMLCanvasElement>document.getElementById("myChart2");
      this.ctx = this.canvas.getContext("2d");
      let myChart = new Chart(this.ctx, {
        type: "bar",
        data: {
          labels: [
            this.sector1Txt,
            this.sector2Txt,
            this.sector3Txt,
            this.sector4Txt,
            this.sector5Txt,
            this.sector6Txt,
            this.sector7Txt,
            this.sector8Txt,
            this.sector9Txt,
            this.sector10Txt,
            "ส่วนกลาง"
          ],
          datasets: [
            {
              label: false,
              data: [
                this.sector1,
                this.sector2,
                this.sector3,
                this.sector4,
                this.sector5,
                this.sector6,
                this.sector7,
                this.sector8,
                this.sector9,
                this.sector10,
                this.center
              ],
              fill: false,
              backgroundColor: [
                "rgb(0, 204, 0)", //1
                "rgb(0, 0, 255)", //2
                "rgb(255, 0, 0)", //3
                "rgb(102, 0, 0)", //4
                "rgb(255, 102, 0)", //5
                "rgb(205, 92, 92)", //6
                "rgb(148, 0, 211)", //7
                "rgb(0, 229, 238)", //8
                "rgb(255, 193, 193)", //9
                "rgb(28, 28, 28)", //10
                "rgb(119, 136, 153)", //ส่วนกลาง
              ],

              borderColor: "rgb(0, 51, 0)",

              borderWidth: 1
            },
            // {
            //   label: "",
            //   data: [55, 65, 50, 83, 90, 74, 56],
            //   fill: false,
            //   backgroundColor: [
            //     "green", 
            //     "blue",
            //     "red",
            //     "brown",
            //     "orange","rgb(205, 92, 92)", //6
            //     "rgb(148, 0, 211)", //7
            //     "rgb(0, 229, 238)", //8
            //     "rgb(255, 193, 193)", //9
            //     "rgb(28, 28, 28)", //10
            //     "rgb(119, 136, 153)", //ส่วนกลาง
            //   ],

            //   borderColor: "rgb(77, 77, 255)",

            //   borderWidth: 1
            // }
          ]
        },
        options: {
          responsive: false,
          display: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    });

  }

  setData = (object) => {
    let data = object.detailData;
    console.log(object);
    console.log(data[0].sendLineAmount);

    this.sector1 = data[0].sendLineAmount;
    this.sector2 = data[1].sendLineAmount;
    this.sector3 = data[2].sendLineAmount;
    this.sector4 = data[3].sendLineAmount;
    this.sector5 = data[4].sendLineAmount;
    this.sector6 = data[5].sendLineAmount;
    this.sector7 = data[6].sendLineAmount;
    this.sector8 = data[7].sendLineAmount;
    this.sector9 = data[8].sendLineAmount;
    this.sector10 = data[9].sendLineAmount;
    this.center = object.central;

    this.sector1Txt = data[0].sectorName;
    this.sector2Txt = data[1].sectorName;
    this.sector3Txt = data[2].sectorName;
    this.sector4Txt = data[3].sectorName;
    this.sector5Txt = data[4].sectorName;
    this.sector6Txt = data[5].sectorName;
    this.sector7Txt = data[6].sectorName;
    this.sector8Txt = data[7].sectorName;
    this.sector9Txt = data[8].sectorName;
    this.sector10Txt = data[9].sectorName;
  }
}
