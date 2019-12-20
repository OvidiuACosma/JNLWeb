import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../_services';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.scss']
})

export class AlertComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
      console.log('Message:', message);
      this.hideMessage(20000);
    });
  }

  hideMessage(timeout: number) {
    setTimeout(function() {
      this.message = null;
    }.bind(this),
    timeout);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
