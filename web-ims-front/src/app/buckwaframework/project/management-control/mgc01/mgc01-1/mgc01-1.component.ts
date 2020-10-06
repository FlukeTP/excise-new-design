import { Component, AfterViewInit } from "@angular/core";
import * as Chart from "chart.js";
import { AuthService } from "services/auth.service";
declare var $: any;
@Component({
  selector: "app-mgc01-1",
  templateUrl: "./mgc01-1.component.html",
  styleUrls: ["./mgc01-1.component.css"]
})
export class Mgc011Component implements AfterViewInit {
  canvas: any;
  ctx: any;
  constructor( private authService: AuthService) {}

  ngAfterViewInit() {
    //this.authService.reRenderVersionProgram('REP-01011');

    this.canvas = <HTMLCanvasElement>document.getElementById("myChart1");
    this.ctx = this.canvas.getContext("2d");
    let myChart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "A",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: "green",
            lineTension: 0.1
          },
          {
            label: "B",
            data: [60, 75, 55, 60, 84, 66, 44],
            fill: false,
            borderColor: "blue",
            lineTension: 0.1
          },
          {
            label: "C",
            data: [50, 71, 52, 42, 47, 65, 64],
            fill: false,
            borderColor: "red",
            lineTension: 0.1
          },
          {
            label: "D",
            data: [63, 73, 58, 68, 81, 69, 41],
            fill: false,
            borderColor: "brown",
            lineTension: 0.1
          },
          {
            label: "E",
            data: [80, 79, 59, 69, 88, 63, 74],
            fill: false,
            borderColor: "orange",
            lineTension: 0.1
          }
        ]
      },
      options: {
        responsive: false,
        display: true
      }
    });
  }
}
