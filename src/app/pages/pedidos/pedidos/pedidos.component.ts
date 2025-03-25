import { Component, OnInit} from '@angular/core';
import { Table } from 'primeng/table';

// import { Customer, Representative } from '@/domain/customer';
// import { CustomerService } from '@/service/customerservice';

import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
interface Customer{
  
}
@Component({
  selector: 'app-pedidos',
  imports: [TableModule, CommonModule, InputTextModule, TagModule,
  SelectModule, MultiSelectModule, ProgressBar, ButtonModule, IconFieldModule, InputIconModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {
  customers!: Customer[];

  representatives!: any[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  searchValue: string | undefined;

  // constructor(private customerService: CustomerService) {}

  ngOnInit() {
      // this.customerService.getCustomersLarge().then((customers) => {
      //     this.customers = customers;
      //     this.loading = false;

      //     this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
      // });

      this.representatives = [
          { name: 'Amy Elsner', image: 'amyelsner.png' },
          { name: 'Anna Fali', image: 'annafali.png' },
          { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
          { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
          { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
          { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
          { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
          { name: 'Onyama Limba', image: 'onyamalimba.png' },
          { name: 'Stephen Shaw', image: 'stephenshaw.png' },
          { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
      ];

      this.statuses = [
          { label: 'Unqualified', value: 'unqualified' },
          { label: 'Qualified', value: 'qualified' },
          { label: 'New', value: 'new' },
          { label: 'Negotiation', value: 'negotiation' },
          { label: 'Renewal', value: 'renewal' },
          { label: 'Proposal', value: 'proposal' }
      ];
  }

  clear(table: Table) {
      table.clear();
      this.searchValue = ''
  }

  getSeverity(status: string) {
      switch (status.toLowerCase()) {
          case 'unqualified':
              return 'danger';

          case 'qualified':
              return 'success';

          case 'new':
              return 'info';

          case 'negotiation':
              return 'warn';

          case 'renewal':
              return null;
          default:
            return null;
      }
  }
}
