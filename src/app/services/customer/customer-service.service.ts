import { HttpService } from 'src/app/services/http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { request } from 'http';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FormDemoServiceService {

  constructor(private http: HttpClient,private httpService: HttpService) {



              /* http client*/
             /* hGet,POST,Delete, Put*/
   }
   serviceCall(form_details: any = {}) {
    console.log("In the service");
    const requestUrl = environment.baseUrl + '/form-demo';   //http://localhost:8080/form-demo
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

  const requestUrl = environment.baseUrl + '/form-demo';   //http://localhost:8080/form-demo
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

  const requestUrl = environment.baseUrl + '/form-demo/' + id.toString();
  let headers = {};
  if (this.httpService.getAuthToken() !== null) {
    headers = {
      Authorization: 'Bearer ' + this.httpService.getAuthToken(),
    };
  }

  return this.http.post(requestUrl,form_details,  { headers: headers });
}

deleteData(id: number){

console.log('In Delete data');

const requestUrl = environment.baseUrl + '/form-demo/' + id.toString();
let headers = {};
if (this.httpService.getAuthToken() !== null) {
  headers = {
    Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  };
}

return this.http.delete(requestUrl,  { headers: headers });


}}

