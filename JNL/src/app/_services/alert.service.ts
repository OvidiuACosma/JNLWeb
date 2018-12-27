import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    }

    // confirmThis(message: string, yesFn:()=>void,noFn:()=>void){
    //     this.setConfirmation(message,yesFn,noFn);
    // }

    // setConfirmation(message: string, yesFn: () => void, noFn: () => void) {
    //     let that = this;
    //     this.subject.next({ type: "confirm",
    //     text: message,
    //         yesFn: function(){
    //             that.subject.next(); //this will close the modal
    //             yesFn();
    //             },
    //         noFn:function(){
    //             that.subject.next();
    //             noFn();
    //         }
    //     });
    // }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
