import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, Browser, IProductsFiltersCached } from '../_models';
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

  // Products Cached Filters
  private subjectProductsFilters = new BehaviorSubject<IProductsFiltersCached>({
    searchText: '',
    filteredItems: [],
    filteredElements: []
  });
  currentProductsFilters = this.subjectProductsFilters.asObservable();

  // Products Ready to Sell Cached Filters
  private subjectProductsRtsFilters = new BehaviorSubject<IProductsFiltersCached>({
    searchText: '',
    filteredItems: [],
    filteredElements: []
  });
  currentProductsRtsFilters = this.subjectProductsRtsFilters.asObservable();

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

  public setProductsFilters(productsFilters: IProductsFiltersCached) {
    this.subjectProductsFilters.next(productsFilters);
  }

  public setProductsRtsFilters(productsRtsFilters: IProductsFiltersCached) {
    this.subjectProductsRtsFilters.next(productsRtsFilters);
  }
}
