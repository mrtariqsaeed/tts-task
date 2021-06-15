import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Hotel } from './app.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'tts';
  fromDate: string;
  toDate: string;
  hotels: Hotel[];

  constructor(private appService: AppService) {
    Chart.register(...registerables);

    this.appService.getHotels().subscribe((data: Hotel[]) => {
      this.hotels = data;
    });
  }
  ngOnInit() {}

  ngAfterViewInit() {
    let ctx = document.getElementById('myChart') as HTMLCanvasElement
    let _ctx = ctx.getContext('2d');
    const myChart = new Chart(_ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            borderColor: 'rgb(166, 64, 224)'
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  getReport() {
    console.log("params ->", this.fromDate + " -- " + this.toDate)
  }
}
