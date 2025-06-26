import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { SupplierServiceService } from 'src/app/services/supplier/supplier.service';

@Component({
  selector: 'app-supplier',
  standalone: false,
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit, AfterViewInit {
  supplierForm: FormGroup;
  displayedColumns: string[] = ['supplierName', 'address', 'phoneNumber', 'businessType', 'email', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData: any;
  isButtonDisabled: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private demoService: SupplierServiceService,
    private MessageService: MessageServiceService
  ) {
    this.supplierForm = this.fb.group({
      supplierName: new FormControl('', Validators.required),
      nic: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}[VvXx]$|^[0-9]{12}$')]),
      address: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      businessType: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  supplierAgeValidator(control: AbstractControl) {
    if (!control) {
      return null;
    }
    const controlValue = +control.value;
    if (isNaN(controlValue)) {
      return { supplierAgeValidator: true };
    }
    return null;
  }

  public populateData(): void {
    try {
      this.demoService.getData().subscribe({
        next: (dataList: any[]) => {
          if (dataList.length <= 0) {
            console.log('No data received');
            return;
          }
          this.dataSource.data = dataList;
          console.log('Data received:', dataList);
        },
        error: (error) => {
          this.MessageService.showError('Action failed with error: ' + error);
        }
      });
    } catch (error) {
      this.MessageService.showError('Action failed with error: ' + error);
    }
  }

  onSubmit() {
    try {
      console.log('Mode:', this.mode);
      console.log('Form submitted:', this.supplierForm.value);
      this.submitted = true;
      if (this.mode === 'add') {
        this.demoService.serviceCall(this.supplierForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource.data = [response, ...this.dataSource.data];
            } else {
              this.dataSource.data = [response];
            }
            this.MessageService.showSuccess('Data saved successfully!');
            this.resetFormState();
          },
          error: (error) => {
            this.MessageService.showError('Action failed with error: ' + error);
          }
        });
      } else if (this.mode === 'edit') {
        this.demoService.editData(this.selectedData?.id, this.supplierForm.value).subscribe({
          next: (response: any) => {
            const elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
            if (elementIndex !== -1) {
              this.dataSource.data[elementIndex] = response;
              this.dataSource.data = [...this.dataSource.data];
            }
            this.MessageService.showSuccess('Data edited successfully!');
            this.resetFormState();
          },
          error: (error) => {
            this.MessageService.showError('Action failed with error: ' + error);
          }
        });
      }
    } catch (error) {
      this.MessageService.showError('Action failed with error: ' + error);
    }
  }

  private resetFormState(): void {
    this.mode = 'add';
    this.supplierForm.disable();
    this.isButtonDisabled = true;
  }

  public resetData(formDirective: FormGroupDirective): void {
    formDirective.resetForm();
    this.supplierForm.reset();
    this.supplierForm.clearValidators();
    this.supplierForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.supplierForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.supplierForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any): void {
    const id = data.id;
    try {
      this.demoService.deleteData(id).subscribe({
        next: (_response: any) => {
          const index = this.dataSource.data.findIndex((element) => element.id === id);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource.data = [...this.dataSource.data];
          }
          this.MessageService.showSuccess('Data deleted successfully!');
        },
        error: (error) => {
          this.MessageService.showError('Action failed with error: ' + error);
        }
      });
    } catch (error) {
      this.MessageService.showError('Action failed with error: ' + error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public refreshData(): void {
    this.populateData();
  }
}