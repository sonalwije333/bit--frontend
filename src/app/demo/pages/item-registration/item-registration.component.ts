import { Component, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ItemRegistrationService } from 'src/app/services/item-registration/item-registration.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ItemDetailsDialogComponent } from '../ItemDetailsDialog/item-details-dialog/item-details-dialog.component';

@Component({
  selector: 'app-item-registration',
  standalone: false,
  templateUrl: './item-registration.component.html',
  styleUrls: ['./item-registration.component.scss']
})
export class ItemRegistrationComponent implements OnInit {
  itemsReg: FormGroup;
  selectedFile: File;

  // For card view filtering
  filteredItems: any[] = []; // For card view filtering
  pageSize = 4;
  currentPage = 0;
  pagedItems: any[] = [];

  // For pagination
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedItems();
  }

  // Method to update paged items based on current page and page size
  updatePagedItems() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.filteredItems.slice(start, end);
  }

  displayedColumns: string[] = [
    'itemName',
    'genericName',
    'formulation',
    'type',
    'consumeType',
    'description',
    'packSize',
    'unitOfMeasure',
    'batchNumber',
    'expiryDate',
    'prescriptionRequired',
    'reorderLevel',
    'image',
    'actions'
  ];

  unitOptions: string[] = [
    'Tablet',
    'Capsule',
    'Ampoule',
    'Syringe',
    'Inhaler',
    'Bottle',
    'Tube',
    'Box',
    'Pack / Pkg',
    'Piece',
    'Bundle',
    'ml',
    'l',
    'mg',
    'g'
  ];
  showCustomUnit = false;
  customUnit = '';

  onUnitChange(value: string) {
    this.showCustomUnit = value === 'Other';
    if (!this.showCustomUnit) {
      this.customUnit = '';
    }
  }

  setCustomUnit() {
    this.itemsReg.get('unitOfMeasure')?.setValue(this.customUnit);
  }

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileInput') fileInput;

  saveButtonLabeel = 'save';
  mode = 'add';
  selectedEditData: any;
  isbtnDisabled = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private itemRegistrationService: ItemRegistrationService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.itemsReg = this.formBuilder.group({
      itemName: new FormControl('', Validators.required),
      genericName: new FormControl('', Validators.required),
      formulation: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      consumeType: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      packSize: new FormControl('', [Validators.required]),
      unitOfMeasure: new FormControl('', [Validators.required]),
      batchNumber: new FormControl('', [Validators.required]),
      expiryDate: new FormControl('', [Validators.required]),
      prescriptionRequired: new FormControl('', [Validators.required]),
      reorderLevel: new FormControl('', [Validators.required]),
      image: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Custom filter function to handle both table and card view filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (!this.dataSource) return;

    // Table filter
    this.dataSource.filter = filterValue;

    // Card filter
    this.filteredItems = this.dataSource.data.filter(
      (data: any) =>
        data.itemName?.toLowerCase().includes(filterValue) ||
        data.genericName?.toLowerCase().includes(filterValue) ||
        data.type?.toLowerCase().includes(filterValue) ||
        data.description?.toLowerCase().includes(filterValue) ||
        data.batchNumber?.toLowerCase().includes(filterValue)
    );
    this.currentPage = 0;
    this.updatePagedItems();
  }

  // Method to open the details dialog
  openDetailsDialog(item: any) {
    this.dialog.open(ItemDetailsDialogComponent, {
      width: '400px',
      data: item
    });
  }

  populateData(): void {
    console.log('Fetching data...');
    this.itemRegistrationService.getData().subscribe((response: any[]) => {
      const processedData = response.map((item) => {
        let imageUrl = '';
        if (item.image && item.imageType) {
          const byteArray = new Uint8Array(item.image);
          const blob = new Blob([byteArray], { type: item.imageType });
          const objectUrl = URL.createObjectURL(blob);
          imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl + '?t=' + new Date().getTime()) as string;
        }
        return { ...item, imageUrl };
      });
      this.dataSource = new MatTableDataSource(processedData);

      this.filteredItems = processedData; // Initialize filteredItems for card view ********
      this.currentPage = 0;
      this.updatePagedItems();

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onSubmit(): void {
    try {
      this.submitted = true;

      if (this.itemsReg.invalid || (this.mode === 'add' && !this.selectedFile)) {
        return;
      }

      const formData = new FormData();
      const itemData = { ...this.itemsReg.value };
      formData.append('itemForm', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if (this.mode === 'add') {
        this.itemRegistrationService.serviceCall(formData).subscribe({
          next: (response: any) => {
            this.messageService.showSuccess('Item Saved Successfully!');
            this.itemsReg.reset();
            this.submitted = false;
            this.isbtnDisabled = true;
            this.itemsReg.disable();
            this.selectedFile = undefined!;
            if (this.fileInput) {
              this.fileInput.nativeElement.value = '';
            }
            this.populateData();
          },
          error: (error) => {
            this.messageService.showError('Action failed with error ' + error);
          }
        });
      } else if (this.mode === 'edit') {
        this.itemRegistrationService.editData(this.selectedEditData?.id, formData).subscribe({
          next: (response: any) => {
            this.messageService.showSuccess('Successfully updated!');
            this.itemsReg.reset();
            this.submitted = false;
            this.selectedFile = undefined!;
            if (this.fileInput) {
              this.fileInput.nativeElement.value = '';
            }
            this.mode = 'add';
            this.saveButtonLabeel = 'save';
            this.selectedEditData = null;
            this.isbtnDisabled = true;
            this.itemsReg.disable();
            this.populateData();
          },
          error: (error) => {
            this.messageService.showError('Action failed with error ' + error);
          }
        });
      }
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  resetData(): void {
    this.itemsReg.reset();
    this.itemsReg.setErrors(null);
    this.itemsReg.updateValueAndValidity();
    this.saveButtonLabeel = 'Save';
    this.itemsReg.enable();
    this.isbtnDisabled = false;
    this.submitted = false;
    this.mode = 'add';

    this.selectedFile = undefined;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.showCustomUnit = false; // <-- Hide custom unit field
  this.customUnit = ''; 
  }

  editData(data: any): void {
    this.itemsReg.patchValue(data);
    this.itemsReg.patchValue({ expiryDate: new Date(data.expiryDate) });

    this.saveButtonLabeel = 'Edit';
    this.mode = 'edit';
    this.selectedEditData = data;
  }

  deleteData(data: any): void {
    const id = data.id;
    this.itemRegistrationService.deleteData(id).subscribe({
      next: () => {
        this.messageService.showSuccess('Successfully deleted!');
        this.populateData();
      },
      error: (error) => {
        this.messageService.showError('Action failed with error ' + error);
      }
    });
  }

  refreshData(): void {
    console.log('Refresh button clicked');
    this.populateData();
  }
}
