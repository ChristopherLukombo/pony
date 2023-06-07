import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AlertComponent } from '../alert/alert.component';
import { FormControlValidationDirective } from '../form-control-validation.directive';
import { FormLabelValidationDirective } from '../form-label-validation.directive';
import { FormLabelDirective } from '../form-label.directive';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    NgbAlert,
    FormControlValidationDirective,
    FormLabelDirective,
    FormLabelValidationDirective
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    login: '',
    password: ''
  };
  authenticationFailed = false;

  constructor(private router: Router, private userService: UserService) {}

  authenticate(): void {
    this.authenticationFailed = false;
    this.userService.authenticate(this.credentials).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.authenticationFailed = true)
    });
  }
}
