import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, Browser } from '../_models';
import { DeviceDetectorService } from 'ngx-device-detector';


@Injectable({
  providedIn: 'root'
})

export class DataExchangeService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  // First visit
  private subjectFirstVisit = new BehaviorSubject<boolean>(true);
  firstVisit = this.subjectFirstVisit.asObservable();

  // User
  private subjectUser = new BehaviorSubject<User>(new User());
  currentUser = this.subjectUser.asObservable();

  // Browser
  private subjectBrowser = new BehaviorSubject<Browser>({name: this.deviceService.getDeviceInfo().browser,
                                                        isDesktopDevice: this.deviceService.isDesktop(),
                                                        isTablet: this.deviceService.isTablet(),
                                                        isMobile: this.deviceService.isMobile()});
  currentBrowser = this.subjectBrowser.asObservable();

  // NavBar Status
  private subjectNavBarStatus = new BehaviorSubject<boolean>(false);
  currentNavBarStatus = this.subjectNavBarStatus.asObservable();

  // Language
  private subjectLanguage = new BehaviorSubject<string>('EN');
  currentLanguage = this.subjectLanguage.asObservable();


  constructor(private deviceService: DeviceDetectorService) { }


  public changeMessage(message: string) {
    this.messageSource.next(message);
  }

  public changeFirstVisit() {
    this.subjectFirstVisit.next(false);
  }

  public setCurrentUser(user: User) {
    this.subjectUser.next(user);
  }

  public setCurrentBrowser(browser: Browser) {
    this.subjectBrowser.next(browser);
  }

  public setNavBarStatus(status: boolean) {
    this.subjectNavBarStatus.next(status);
  }

  public setLanguage(language: string) {
    this.subjectLanguage.next(language);
  }
}
