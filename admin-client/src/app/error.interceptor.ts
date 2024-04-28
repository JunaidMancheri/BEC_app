import {  HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { EMPTY, Observable, catchError, of, throwError } from "rxjs";
import { SnackbarService } from "./shared/snackbar.service";

export  function CatchHttpErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const snackbarService = inject(SnackbarService);
  return next(req).pipe(
    catchError((err) => {
      snackbarService.openSnackbar(err.error.error.message)
      return EMPTY;
    })
  )
}