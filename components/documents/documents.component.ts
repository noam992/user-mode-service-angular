import { UserModeService } from './../../services/user-mode.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})

export class DocumentsComponent implements OnInit, OnDestroy {

  public userModeUnsubscribe$ = new Subject<any>();

  constructor(private myUserModeService: UserModeService) { }

  async ngOnInit() {
    try {

      // -- Get user mode -- //
      // Get current user mode
      const currentUserMode = this.myUserModeService.getUserMode();
      this.checkUserMode(currentUserMode);

      // Listening to any called from user mode service to get user mode. 
      this.myUserModeService.userMode$
        .pipe(takeUntil(this.userModeUnsubscribe$))
        .subscribe( mode => this.checkUserMode(mode))

    } catch (err) {
      console.log(err.message)
    }

  }

  // -- User Mode Section -- //
  // Check if user mode: guest/user/admin
  public checkUserMode(userMode: string){
    
    // Navigate between user modes
    switch (userMode) {
      case "read":
        this.userMode()
        break;
      
      case "userAdminAnyDatabase":    
        this.adminMode()
        break;

      default:
          this.guestMode()
        break;
    }

  }
    
  // Guest mode
  public guestMode(){
    console.log("Guest")
  }

  // User mode
  public userMode(){
    console.log("User")
  }
    
  // Admin mode
  public adminMode(){
    console.log("Admin")
  }
  
  // Destroy subscribe when user leave current page
  ngOnDestroy() {
    
    // Unsubscribe user mode
    this.userModeUnsubscribe$.next();
    this.userModeUnsubscribe$.complete();
  }

}
