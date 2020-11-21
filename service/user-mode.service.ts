import { UserRole } from './../models/user-role';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserModeService {

  // Subject can multicast to many Observers
  public sharingUserMode = new Subject<any>();
  
  // Get user mode
  private userAuthorizationStatus: string = "guest";

  // Observable string streams
  public userMode$ = this.sharingUserMode.asObservable();

  // Set user status - Sign in / Sign out / Sign up are update user status
  public setUserMode(userPermission: UserRole){

    // Streaming "user mode"
    this.sharingUserMode.next(userPermission[0].role);

    // Save "user mode" into local variable
    this.userAuthorizationStatus = userPermission[0].role;
  }

  // Get user status - on initialize of any component is require for user status
  public getUserMode() {

    // Get user info from session storage
    const userJson = sessionStorage.getItem('user');

    // User already made login, get current status
    if (userJson) {
      this.userAuthorizationStatus = JSON.parse(userJson).roles[0].role;
      return this.userAuthorizationStatus;
      
    } else {
      return this.userAuthorizationStatus;
    }

  }

}
