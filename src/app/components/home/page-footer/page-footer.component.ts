import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PrivacyModalComponent } from '../modals/privacy-modal/privacy-modal.component';
import { RefundModalComponent } from '../modals/refund-modal/refund-modal.component';
import { TermsModalComponent } from '../modals/terms-modal/terms-modal.component';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss']
})

export class PageFooterComponent {

  constructor(public dialog: MatDialog) { }

  presentTerms() {
    const dialogRef = this.dialog.open(TermsModalComponent, {
      width: '1000px',
    });

    return dialogRef.afterClosed();
  }

  presentRefund() {
    const dialogRef = this.dialog.open(RefundModalComponent, {
      width: '1000px',
    });

    return dialogRef.afterClosed();
  }

  presentPrivacy() {
    const dialogRef = this.dialog.open(PrivacyModalComponent, {
      width: '1000px',
    });

    return dialogRef.afterClosed();
  }
}
