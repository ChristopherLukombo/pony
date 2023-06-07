import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { UserService } from '../user.service';
import { FormControlValidationDirective } from '../form-control-validation.directive';
import { FormLabelValidationDirective } from '../form-label-validation.directive';
import { FormLabelDirective } from '../form-label.directive';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    FormControlValidationDirective,
    FormLabelDirective,
    FormLabelValidationDirective,
    NgbAlert
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationFailed = false;
  loginCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
  passwordCtrl = this.fb.control('', Validators.required);
  confirmPasswordCtrl = this.fb.control('', Validators.required);
  birthYearCtrl = this.fb.control<number | null>(null, [
    Validators.required,
    Validators.min(1900),
    Validators.max(new Date().getFullYear())
  ]);
  passwordGroup = this.fb.group(
    {
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    },
    {
      validators: RegisterComponent.passwordMatch
    }
  );
  userForm = this.fb.group({
    login: this.loginCtrl,
    passwordForm: this.passwordGroup,
    birthYear: this.birthYearCtrl
  });

  constructor(private fb: NonNullableFormBuilder, private userService: UserService, private router: Router) {}

  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')!.value;
    const confirmPassword = control.get('confirmPassword')!.value;
    return password !== confirmPassword ? { matchingError: true } : null;
  }

  register(): void {
    const formValue = this.userForm.value;
    this.userService.register(formValue.login!, formValue.passwordForm!.password!, formValue.birthYear!).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => (this.registrationFailed = true)
    });
  }
}
