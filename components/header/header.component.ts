import { logging } from 'protractor';
import { UserModeService } from './../../services/user-mode.service';
import { AuthenticationService } from './../../services/authentication.service';
import { take } from 'rxjs/operators';
import { UsersService } from './../../services/users.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { environment } from '../../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import { SelectedUserComponent } from '../dialogs/selected-user/selected-user.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  public unsubscribe$ = new Subject;
  public unsubscribeUserDialog$ = new Subject;
  public imageWidth = '20px';
  public screenSize: string;
  public users: User[];
  // Path for server folders
  public envMode = environment.ProductsBaseUrl;

  constructor(private myUsersService: UsersService,
              private myDialog: MatDialog,
              private myAuthorizationService: AuthenticationService,
              private myUserModeService: UserModeService) { }

  async ngOnInit() {
    try {

      // Get users
      this.users = await this.myUsersService.getAllUsers();   

    } catch (err) {
      console.log(err.message)
    }

  }

  // On mouse hover spread the user images
  public mouseEnterUsers(){
    this.imageWidth = "50px"
  }

  // On mouse leave tight user images
  public mouseLeaveUsers() {
    this.imageWidth = "20px"
  }

  // User log in, pop up dialog to confirm selected user
  public async chooseUser(userDetails: User) {

    // Open dialog and sent data to it
    const dialogRef = this.myDialog.open(SelectedUserComponent,{
      maxWidth: this.screenSize === 'xs' ? '100vw': null,
      data: userDetails
    });
  
    // On close dialog component get back user answer - Guest / User / Admin
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(result => {
          
        if (result === "" || result === undefined) {
          return
        } else {
          
          // Get user info from session storage
          const userJson = sessionStorage.getItem('user');
          
          // Log out
          if (userJson) {

            // Remove "user" and "token" from session storage 
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
          }

          // Log in user
          this.myAuthorizationService.login(userDetails)
            .pipe(take(1))
            .subscribe(
              response => {
      
                // Saving token in the sessionStorage
                sessionStorage.setItem("token", response.headers.get("DocumentViewersApp"));
                sessionStorage.setItem("user", JSON.stringify(response.body.user));

                // Send status user mode to service
                this.myUserModeService.setUserMode(response.body.user.roles)
              },
              error => {

                // Error message
                console.log(error.message)
              }
            )

        }

      });  
  }

  // Destroy subscribe when component destroy 
  ngOnDestroy() {
  
    // Unsubscribe screen size
    this.unsubscribeUserDialog$.next();
    this.unsubscribeUserDialog$.complete();
  }

}
