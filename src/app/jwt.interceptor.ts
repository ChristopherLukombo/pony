import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from './user.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const loggedUser = inject(UserService).getCurrentUser();
  if (loggedUser) {
    const clone = req.clone({ setHeaders: { Authorization: `Bearer ${loggedUser.token}` } });
    return next(clone);
  }
  return next(req);
};
