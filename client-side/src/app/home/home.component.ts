import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  lineChart: Chart | undefined;
  pieChart: Chart | undefined;
  totalAccounts: number = 0;
  totalBalance: number = 0;
  customers: Customer[] = [];
  totalCustomers: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCustomers();
    this.generateFakeStatistics();
  }

  fetchCustomers() {
    this.http.get<Customer[]>('http://localhost:8085/customers')
      .subscribe((data) => {
        this.customers = data;
        this.totalCustomers = data.length;
      });
  }

  generateFakeStatistics() {
    this.totalBalance = 1000000;
  }

  ngAfterViewInit() {
    this.initLineChart();
    this.initPieChart();
  }

  initLineChart() {
    Chart.register(...registerables);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Visitors',
          data: [100, 120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const canvas = document.getElementById('monthly-visitors-chart') as HTMLCanvasElement;
    if (canvas && canvas.getContext('2d')) {
      this.lineChart = new Chart(canvas.getContext('2d')!, config);
    } else {
      console.error("Failed to acquire context for line chart");
    }
  }

  initPieChart() {
    Chart.register(...registerables);

    const pieConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['CREDIT', 'TRANSFERT', 'DEBIT'],
        datasets: [{
          label: 'Dataset',
          data: [12, 19, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    };

    const pieCanvas = document.getElementById('pie-chart') as HTMLCanvasElement;
    if (pieCanvas && pieCanvas.getContext('2d')) {
      this.pieChart = new Chart(pieCanvas.getContext('2d')!, pieConfig);
    } else {
      console.error("Failed to acquire context for pie chart");
    }
  }
}
