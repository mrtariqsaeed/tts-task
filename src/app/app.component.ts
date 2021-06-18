import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Hotel, Report } from './app.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tts';
  fromDate: string;
  toDate: string;
  hotels: Hotel[];
  hotelID: string;
  ctx: HTMLCanvasElement;
  _ctx: any;
  myChart: any;

  constructor(private appService: AppService) {
    Chart.register(...registerables);

    this.appService.getHotels().subscribe((data: Hotel[]) => {
      this.hotels = data;
    });
  }
  ngOnInit() {}

  afterViewInit() {
    
  }

  setupChart(data: Report[]) {
    if (this.myChart) this.myChart.destroy();

    const scores = data.map((e) => Number(e.score)) as number[];
    this.ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this._ctx = this.ctx.getContext('2d');
    this.myChart = new Chart(this._ctx, {
      type: 'line',
      data: {
        labels: scores,
        datasets: [
          {
            label: '# of Votes',
            data: scores,
            borderWidth: 1,
            borderColor: 'rgb(166, 64, 224)',
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
    const body = {
      hotelID: this.hotelID,
      fromDate: new Date(this.fromDate).toISOString(),
      toDate: new Date(this.toDate).toISOString(),
    };
    this.appService.getReport(body).subscribe((data: Report[]) => {
      if (data) this.setupChart(data);
    });
  }
}
