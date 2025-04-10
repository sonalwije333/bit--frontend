import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { CustomerComponent } from './customer/customer.component';
import { EmployeeComponent } from './employee/employee.component';

export const PagesRoutes: Routes = [
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'privileges',
    loadChildren: () => import('./privileges/privileges.module').then((m) => m.PrivilegesModule)
  },

  {
    path: 'form-demo',
    component: FormDemoComponent
  },
  {
    path: 'customer',
    component: CustomerComponent
  }

  ,
  {
    path: 'employee',
    component: EmployeeComponent
  }
];
