import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TestComponent } from './test/test.component';
import { MaterialModule } from 'src/app/material.module';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { CustomerComponent } from './customer/customer.component';
import { EmployeeComponent } from './employee/employee.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ItemRegistrationComponent } from './item-registration/item-registration.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';

// icons

@NgModule({
  declarations: [TestComponent,FormDemoComponent,CustomerComponent,EmployeeComponent,InventoryComponent,ItemRegistrationComponent,SupplierComponent,CustomerLoginComponent],
  imports: [CommonModule, FormsModule, NgApexchartsModule, RouterModule.forChild(PagesRoutes), MaterialModule,ReactiveFormsModule],
  exports: []
})
export class PagesModule {}
