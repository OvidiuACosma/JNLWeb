import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models';


@Injectable({
  providedIn: 'root'
})
export class DataExchangeService {

  private language: string;

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  // User
  private subjectUser = new BehaviorSubject<User>(new User());
  currentUser = this.subjectUser.asObservable();

  // Browser
  private subjectBrowser = new BehaviorSubject<String>('');
  currentBrowser = this.subjectBrowser.asObservable();

  // NavBar Status
  private subjectNavBarStatus = new BehaviorSubject<boolean>(false);
  currentNavBarStatus = this.subjectNavBarStatus.asObservable();

  // Language
  public getLanguage() {
    return this.language;
  }

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

  public setNavBarStatus(status: boolean) {
    this.subjectNavBarStatus.next(status);
  }

  public setLanguage(language: string) {
    this.language = language;
  }
}
