import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';
import { ItemRegistrationService } from 'src/app/services/item-registration/item-registration.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-item-registration',
  standalone: false,
  templateUrl: './item-registration.component.html',
  styleUrl: './item-registration.component.scss'
})

export class ItemRegistrationComponent implements OnInit {

  itemRegistrationForm: FormGroup;
  displayedColumns: string[] = ['itemName', 'genericName', 'type', 'consumeType', 'description', 'packSize', 'unitOfMeasure', 'batchNumber', 'expiryDate', 'prescriptionRequired', "reorderLevel"];
  dataSource = new MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  saveButtonLabel = 'save';
  mode = 'add';
  selectedEditData;
  isbtnDisabled = false;
  submitted = false;
  selectedImageName: string = '';


  constructor(
    private fb: FormBuilder,
    private ItemRegistrationService: ItemRegistrationService,
    private MessageService: MessageServiceService

  ) {
    this.itemRegistrationForm = this.fb.group({
      itemName: new FormControl(''),
      genericName: new FormControl(''),
      formulation: new FormControl(''),
      type: new FormControl(''),
      consumeType: new FormControl(''),
      description: new FormControl(''),
      packSize: new FormControl(''),
      unitOfMeasure: new FormControl(''),
      batchNumber: new FormControl(''),
      expiryDate: new FormControl(''),
      prescriptionRequired: new FormControl(''),
      reorderLevel: new FormControl(''),
      itemImage: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  populateData(): void {
    try {
      this.ItemRegistrationService.getData().subscribe({
        next: (dataList: any[]) => {
          if (dataList.length <= 0) {
            return;
          }
          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(dataList);

        }, error: (error) => {
          this.MessageService.showError('Action failed with error' + error);
        }
      });
    } catch (error) {
      this.MessageService.showError('Action failed with error' + error);
    }
  }


  onSubmit() {
    try {
      console.log('Mode' + this.mode);
      console.log('form submitted');
      console.log(this.itemRegistrationForm.value);

      this.submitted = true;
      if (this.mode == 'add') {

        this.ItemRegistrationService.serviceCall(this.itemRegistrationForm.value).subscribe({
          next: (response: any) => {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
              this.dataSource = new MatTableDataSource([response, ...this.dataSource.data])
            } else {
              this.dataSource = new MatTableDataSource([response]); //input data goes to the top of the display
            }

            this.MessageService.showSuccess('Data saved successfully!');
          },
          error: (error) => {
            this.MessageService.showError('Action failed with erro' + error);
          }
        });

      } else if (this.mode === 'edit') {


        this.ItemRegistrationService.editData(this.selectedEditData?.id, this.itemRegistrationForm.value).subscribe({
          next: (response: any) => {
            let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedEditData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.MessageService.showSuccess('Data  edited successfully!');
          },
          error: (error) => {
            this.MessageService.showError('Action failed with erro' + error);
          }
        });
      }
      this.mode = 'add';
      this.itemRegistrationForm.disable(); // automatically disable the form after submitting form data
      this.isbtnDisabled = true;
    } catch (error) {
      this.MessageService.showError('Action failed with error' + error);
    }
  }
  public resetData(): void {

    this.itemRegistrationForm.reset();
    this.itemRegistrationForm.setErrors = null;
    this.itemRegistrationForm.updateValueAndValidity();
    this.saveButtonLabel = 'save';
    this.itemRegistrationForm.enable();
    this.isbtnDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.itemRegistrationForm.patchValue(data);
    this.saveButtonLabel = "Edit";
    this.mode = 'edit';
    this.selectedEditData = data;
  }


  public deleteData(data: any): void {
    const id = data.id;
    try {
      this.ItemRegistrationService.deleteData(id).subscribe({
        next: (_response: any) => {
          const index = this.dataSource.data.findIndex((element) => element.id == id);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.MessageService.showSuccess('Data deleted successfully!');
        }, error: (error) => {
          this.MessageService.showError('Action failed with erro' + error);
        }
      });
    } catch (error) {

      this.MessageService.showError('Action failed with error' + error);
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

