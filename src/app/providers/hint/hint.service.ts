import { AlertModalComponent } from 'src/app/components/dashboard/modals/alert-modal/alert-modal.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class HintService {

  private messageSource = new BehaviorSubject('0');
  currentMessage = this.messageSource.asObservable();

  constructor(public dialog: MatDialog) { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  showModal(title, message, yes?, no?) {
    const obj = {
      title: title,
      message: message,
      yesButton: yes,
      noButton: no
    };
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '350px',
      data: obj
    });

    return dialogRef.afterClosed();
  }

}
