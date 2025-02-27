import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

// const ELEMENT_DATA: any[] = [
//   { firstName: 1, lastName: 'Hydrogen', age: 1.0079, email: 'H'},

// ];


@Component({
  selector: 'app-form-demo',
  standalone: false,
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss'
})
export class FormDemoComponent implements OnInit {
      demoForm: FormGroup;
      displayedColumns: string[] = ['firstName', 'lastName', 'age', 'email', 'actions'];
      dataSource = new MatTableDataSource<any>;
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;

      saveButtonLabel = 'Save';
      mode = 'save';


 constructor(private fb: FormBuilder,private demoService : FormDemoServiceService){
    this.demoForm = this.fb.group({
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          age: new FormControl(''),
          email: new FormControl('')
    });
 }
  ngOnInit(): void {
//get data requets
    this.populateData();
  }


public populateData(): void{
    //implemet get data code
    //ts -> service file function
    // service -> backend call
    this.demoService.getData().subscribe((response: any[]) => {
       console.log('get data response' , response);

       this.dataSource = new MatTableDataSource(response);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort =this.sort;
    });
}


onSubmit(){
    console.log('form submitted');
    console.log(this.demoForm.value);


    this.demoService.serviceCall(this.demoForm.value).subscribe((response)=>{
         console.log('server response: ' , response);
    });
}


public resetData(): void {
  this.demoForm.reset();
  this.saveButtonLabel = "Save";
}

public editData(data:any): void {
  this.demoForm.patchValue(data);
  this.saveButtonLabel = "Edit";
  this.mode = 'edit';
}
public deleteData(data:any): void {

}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

}
}
