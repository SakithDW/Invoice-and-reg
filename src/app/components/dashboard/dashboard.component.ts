import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MasterService } from '../../services/master.service';
import { salesdata } from '../../models/salesdata';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  chartData: salesdata[] = [];
  labelData: number[] = [];
  realData: number[] = [];
  colorData: string[] = [];

  constructor(private service: MasterService) {}
  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.service.loadSalesData().subscribe((item) => {
      this.chartData = item;
      if (this.chartData != null) {
        this.chartData.map((o) => {
          this.labelData.push(o.year);
          this.realData.push(o.amount);
          this.colorData.push(o.colorcode);
        });
        this.RenderBarChart(this.labelData, this.realData, this.colorData);
        this.RenderPieChart(this.labelData, this.realData, this.colorData);
        this.RenderDoughnutChart(this.labelData, this.realData, this.colorData);
        this.RenderPaChart(this.labelData, this.realData, this.colorData);
        this.RenderRadarChart(this.labelData, this.realData, this.colorData);
        this.RenderLineChart(this.labelData, this.realData, this.colorData);
        this.RenderBubbleChart();
        this.RenderScatterChart();
      }
    });
  }
  RenderBarChart(labelData: any, valueData: any, colorData: any) {
    this.RenderChart(labelData, valueData, colorData, 'barchart', 'bar');
  }

  RenderPieChart(labelData: any, valueData: any, colorData: any) {
    this.RenderChart(labelData, valueData, colorData, 'piechart', 'pie');
  }
  RenderDoughnutChart(labelData: any, valueData: any, colorData: any) {
    this.RenderChart(
      labelData,
      valueData,
      colorData,
      'doughnutchart',
      'doughnut'
    );
  }

  RenderPaChart(labelData: any, valueData: any, colorData: any) {
    this.RenderChart(labelData, valueData, colorData, 'pachart', 'polarArea');
  }

  RenderRadarChart(labelData: any, valueData: any, colorData: any) {
    this.RenderChart(labelData, valueData, colorData, 'radarchart', 'radar');
  }
  RenderLineChart(labelData: any, valueData: any, colorData: any) {
    this.RenderChart(labelData, valueData, colorData, 'linechart', 'line');
  }
  // RenderBubbleChart(labelData: any, valueData: any, colorData: any) {
  //   this.RenderChart(labelData, valueData, colorData, 'bubblechart', 'bubble');
  // }
  RenderScatterChart() {
    const myChar = new Chart('scatterchart', {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'yearly Sales',
            data: [
              {
                x: 20,
                y: 40,
                r: 60,
              },
              {
                x: 30,
                y: 60,
                r: 90,
              },
              {
                x: 3,
                y: 1,
                r: 10,
              },
            ],
            backgroundColor : ['red','green','yellow']
          },
        ],
      },
    });
  }
  RenderBubbleChart() {
    const myChar = new Chart('bubblechart', {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'yearly Sales',
            data: [
              {
                x: 20,
                y: 40,
                r: 60,
              },
              {
                x: 30,
                y: 60,
                r: 90,
              },
              {
                x: 3,
                y: 1,
                r: 10,
              },
            ],
            backgroundColor : ['red','green','yellow']
          },
        ],
      },
    });
  }

  RenderChart(
    labelData: any,
    valueData: any,
    colorData: any,
    chartId: string,
    chartType: any
  ) {
    const myChar = new Chart(chartId, {
      type: chartType,
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'sales',
            data: valueData,
            backgroundColor: colorData,
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
}
