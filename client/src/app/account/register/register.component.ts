import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, of, timer } from 'rxjs';
import { switchMap } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[]

  // FormBuilder make create form slightly easier
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm = this.fb.group({
      // null for initial value
      displayName:[null, [Validators.required]],
      email: [null,
        [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
        [this.validateEmailNotTaken()]
      ],
      password: [null, [Validators.required]]
    })
  }

  onSubmit(){
    this.accountService.register(this.registerForm.value).subscribe({
      next: response => this.router.navigateByUrl('/shop'),
      error: error => {
        console.log(error);
        this.errors = error.errors;
      }
    })
  }

  // This async validator is going to be making requests to our API to check against that email exists method we have on our API to see if this has been taken.
  validateEmailNotTaken(): AsyncValidatorFn{
    return control => {
      // we don't want to keep making requests to the server every time a user types a character.
      // We're going to add a small delay before we actually go and check with the server.
      return timer(500).pipe(
        switchMap(() => {
          if(!control.value){
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map(res => {
              return res ? {emailExists: true} : null
            })
          )
        })
      )
    }
  }

}
