import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoadingService, AlertService} from '../_services';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loadingService: LoadingService,
                private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(res => {
                // console.log('HttpEventType:', res);
                if (res.type === HttpEventType.Sent) {
                    this.loadingService.loading$.next(true);
                }

                if (res.type === HttpEventType.Response) {
                    this.loadingService.loading$.next(false);
                }
            })
            // ,
            // catchError((err: HttpErrorResponse) => {
            //     if (err instanceof ErrorEvent) {
            //         console.error('Client side or network error');
            //     } else {
            //         if (err.status === 400) {
            //             // console.log('Error in full:', err);
            //             console.error(err.status.toString() + ' - ' + err.statusText);
            //         }
            //     }
            //     this.loadingService.loading$.next(false);
            //     this.alertService.error('Sorry...an error occured.');
            //     return throwError(err);
            // })
        );
    }
}
