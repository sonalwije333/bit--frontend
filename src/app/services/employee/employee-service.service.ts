import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  constructor(private http: HttpClient,private httpService: HttpService) {



    /* http client*/
   /* GET,POST,Delete, Put*/
}


serviceCall(form_details: any = {}) {
console.log("In the service");
const requestUrl = environment.baseUrl + '/employee';   //http://localhost:8080/employee
let headers = {};

if (this.httpService.getAuthToken() !== null) {
headers = {
Authorization: 'Bearer ' + this.httpService.getAuthToken(),
};
}
return this.http.post(requestUrl, form_details, { headers: headers });
}



//getData

getData()
{
console.log("get data");

const requestUrl = environment.baseUrl + '/employee';   //http://localhost:8080/employee
let headers = {};
if (this.httpService.getAuthToken() !== null) {
headers = {
Authorization: 'Bearer ' + this.httpService.getAuthToken(),
};
}

return this.http.get(requestUrl, { headers: headers });
}



editData(id: number, form_details:any){
console.log('In edit data');

const requestUrl = environment.baseUrl + '/employee/' + id.toString();
let headers = {};
if (this.httpService.getAuthToken() !== null) {
headers = {
Authorization: 'Bearer ' + this.httpService.getAuthToken(),
};
}

return this.http.put(requestUrl,form_details,  { headers: headers });  //added put to avoid the error adding extra  data when editing
}

deleteData(id: number){

console.log('In Delete data');

const requestUrl = environment.baseUrl + '/employee/' + id.toString();
let headers = {};
if (this.httpService.getAuthToken() !== null) {
headers = {
Authorization: 'Bearer ' + this.httpService.getAuthToken(),
};
}

return this.http.delete(requestUrl,  { headers: headers });

}}
