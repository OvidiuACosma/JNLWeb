import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthenticationService, LoadingService } from '../_services';
import { DialogService } from '../_services/dialog.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
              private dialogService: DialogService,
              private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(retry(1),
    catchError((err: HttpErrorResponse) => {
      console.log('Error interceptor:', err);
      let showMessage = false;
      let message = '';
      if (err.error instanceof ErrorEvent) {
        showMessage = true;
        message = `Sorry...\nA navigator or network error occured.\nOriginal message: ${err.error.message}.`;
      } else {
        // The backend returned an unsuccessful response code.
        switch (err.status) {
          case 400: {
            // bad request
            showMessage = true;
            message = `Sorry...\nYour request cannot be served.\n`;
            break;
          }
          case 401: {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
            location.reload(true);
            showMessage = true;
            message = `Sorry...\nYour request is not authenticated.\n Please login again.\n`;
            break;
          }
          case 402: {
              // payment required - reserved for future use
              break;
          }
          case 403: {
            // forbidden
            showMessage = true;
            message = `Sorry...\nYour request is forbidden.\n`;
              break;
          }
          case 404: {
            // not found
            showMessage = true;
            message = `Sorry...\nThe resource you are looking for is not available.\n`;
            break;
          }
        }
        if (showMessage) {
          this.dialogService.openDialog('Error', message, [0]);
        }
      }
      this.loadingService.loading$.next(false);
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
