import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(){
    // get a product that we don't expect it to exist
    this.http.get(this.baseUrl + 'products/42').subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  get500Error(){
    // get a product that we don't expect it to exist
    this.http.get(this.baseUrl + 'buggy/servererror').subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  get400Error(){
    // get a product that we don't expect it to exist
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  get400ValidationError(){
    // get a product that we don't expect it to exist
    this.http.get(this.baseUrl + 'products/fortytwo').subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

}
