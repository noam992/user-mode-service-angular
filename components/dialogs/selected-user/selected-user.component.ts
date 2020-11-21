import { takeUntil } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { environment } from '../../../../environments/environment';
import { ScreenSizeService } from './../../../services/screen-size.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-selected-user',
  templateUrl: './selected-user.component.html',
  styleUrls: ['./selected-user.component.css']
})
export class SelectedUserComponent implements OnInit {

  public unsubscribe$ = new Subject;
  public envMode = environment.ProductsBaseUrl;
  public screenSize: string;

  constructor(public myDialog: MatDialog,
            @Inject(MAT_DIALOG_DATA) public selectedUser: User,
            private myScreenSizeService: ScreenSizeService) { }

  ngOnInit(): void {

    // Get current screen size
    this.screenSize = this.myScreenSizeService.currentSize

    // Subscribe to streaming update of screen size, update changes 
    this.myScreenSizeService.sizeScreenCalled$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(whichSizeIs => {
        this.screenSize = whichSizeIs;
    });

  }

  // Destroy subscribe when component destroy 
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
