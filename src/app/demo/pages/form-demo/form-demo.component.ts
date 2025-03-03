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
      mode = 'add';
      selectedData;
      isButtonDisabled: boolean = false;



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
    console.log('Mode' + this.mode)
    console.log('form submitted');
    console.log(this.demoForm.value);

    if(this.mode == 'add'){
      this.demoService.serviceCall(this.demoForm.value).subscribe((response)=>{

        if(this.dataSource && this.dataSource.data && this.dataSource.data.length>0){
             this.dataSource = new MatTableDataSource([response, ...this.dataSource.data])
        } else{
          this.dataSource = new MatTableDataSource([response]); //input data goes to the top of the display
        }
   });

    } else if (this.mode === 'edit'){
       this.demoService.editData(this.selectedData?.id, this.demoForm.value).subscribe((response) =>{
         let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
         this.dataSource.data[elementIndex] = response;
         this.dataSource = new MatTableDataSource(this.dataSource.data);
       });
    }
      this.mode = 'add';
      this.demoForm.disable(); // automatically disable the form after submitting form data
      this.isButtonDisabled = true;
}
public resetData(): void {
  this.demoForm.reset();
  this.saveButtonLabel = "Save";
  this.demoForm.enable();
  this.isButtonDisabled = false;
}

public editData(data:any): void {
  this.demoForm.patchValue(data);
  this.saveButtonLabel = "Edit";
  this.mode = 'edit';
  this.selectedData = data;
}

public deleteData(data:any): void {

// data delete implementation

const id = data.id;

this.demoService.deleteData(id).subscribe((response) => {
const index = this.dataSource.data.findIndex((element) => element.id == id);
if(index !== -1){
   this.dataSource.data.splice( index,1 );
}
this.dataSource = new MatTableDataSource(this.dataSource.data);

});
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
  }}

  public refreshData(): void {
     this.populateData();
  }



}
