import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models';


@Injectable({
  providedIn: 'root'
})
export class DataExchangeService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  // User
  private subjectUser = new BehaviorSubject<User>(new User());
  currentUser = this.subjectUser.asObservable();

  // Browser
  private subjectBrowser = new BehaviorSubject<String>('');
  currentBrowser = this.subjectBrowser.asObservable();

  constructor() { }

  public changeMessage(message: string) {
    this.messageSource.next(message);
  }

  public setCurrentUser(user: User) {
    this.subjectUser.next(user);
  }

  public setCurrentBrowser(browser: String) {
    this.subjectBrowser.next(browser);
  }
}
