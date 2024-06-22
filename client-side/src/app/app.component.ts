import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService from ngx-toastr

interface Customer {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'YBanking';
  customers: Customer[] = [];
  totalCustomers: number = 0;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    this.fetchCustomers(); // Optionally fetch customers when component initializes
  }

  fetchCustomers() {
    this.http.get<Customer[]>('http://localhost:8085/customers')
      .subscribe((data) => {
        this.customers = data;
        this.totalCustomers = data.length;
      });
  }

  // Method to display success message using Toastr
  showSuccessMessage(message: string) {
    this.toastr.success(message, 'Success');
  }

  // Method to handle operations (debit, credit, transfer)
  handleAccountOperation(operationType: string, accountId: string, amount: number, description: string, accountDestination?: string) {
    let operationObservable;

    switch (operationType) {
      case 'DEBIT':
        operationObservable = this.http.post<any>(`http://localhost:8085/debit/${accountId}`, { amount, description });
        break;
      case 'CREDIT':
        operationObservable = this.http.post<any>(`http://localhost:8085/credit/${accountId}`, { amount, description });
        break;
      case 'TRANSFER':
        operationObservable = this.http.post<any>(`http://localhost:8085/transfer/${accountId}`, { amount, description, accountDestination });
        break;
      default:
        return; // Handle invalid operation type or throw error
    }

    operationObservable.subscribe(
      (data) => {
        // Success scenario
        this.showSuccessMessage(`Success ${operationType}`);
        this.fetchCustomers(); // Refresh data after successful operation
      },
      (error) => {
        console.error('Error:', error); // Log error to console
        // Optionally display error message using Toastr
        this.toastr.error('Operation failed. Please try again.', 'Error');
      }
    );
  }
}
