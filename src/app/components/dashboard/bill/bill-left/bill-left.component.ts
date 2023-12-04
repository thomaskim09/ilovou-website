import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { BillFormService } from 'src/app/providers/bill/bill-form/bill-form.service';
import { BillService } from 'src/app/providers/bill/bill.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { ToastrService } from 'ngx-toastr';
import { startOfMonth, endOfMonth, subMonths, format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../providers/common/common-form.service';

@Component({
  selector: 'app-bill-left',
  templateUrl: './bill-left.component.html',
  styleUrls: ['./bill-left.component.scss']
})
export class BillLeftComponent implements OnInit, OnDestroy {

  // form properties
  @Input('form') form: FormGroup;
  isFormChanged: boolean = false;

  durationList = [
    { name: 'Current month', value: 'CM' },
    { name: 'Last month until now', value: 'LM' },
    { name: 'Last 2 months until now', value: '2M' },
  ];

  // Validation
  validation_messages: any;

  dateFormat: any = 'dd MMM yyyy';
  dateTimeFormat: any = 'dd MMM hh:mma';

  // Controller
  needSpinner: boolean = false;

  constructor(
    public hintService: HintService,
    public billFormService: BillFormService,
    public billService: BillService,
    public authenticationService: AuthenticationService,
    public dataService: DataService,
    public toastr: ToastrService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.billFormService.billValidationMessage();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  onChanges() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.isFormChanged = true;
      this.dataService.changeBill({
        needBillRight: false,
        previewClicked: false,
        needHint: true
      });
    });

    this.form.get('duration').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      const cd = new Date();
      const sd = this.form.get('startDate');
      const ed = this.form.get('endDate');
      switch (val) {
        case 'CM': {
          sd.setValue(startOfMonth(cd));
          ed.setValue(endOfMonth(cd));
          break;
        }
        case 'LM': {
          sd.setValue(startOfMonth(subMonths(cd, 1)));
          ed.setValue(endOfMonth(cd));
          break;
        }
        case '2M': {
          sd.setValue(startOfMonth(subMonths(cd, 2)));
          ed.setValue(endOfMonth(cd));
          break;
        }
      }
    });
  }

  previewPDF() {
    const title = `Get voucher transaction summary?`;
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes' || !this.form.valid) {
        return;
      }
      const fv = this.form.value;
      this.needSpinner = true;
      const restaurantId = this.authenticationService.currentUserValue.restaurantId;
      const startDateText = format(fv.startDate, this.dateFormat);
      const endDateText = format(fv.endDate, this.dateFormat);
      const startDate = startOfDay(fv.startDate).toISOString();
      const endDate = endOfDay(fv.endDate).toISOString();

      this.previewVoucher(restaurantId, startDate, endDate, startDateText, endDateText);
    });
  }

  private previewVoucher(restaurantId, startDate, endDate, startDateText, endDateText) {
    this.billService.getTicketSummary(restaurantId, startDate, endDate).pipe(untilDestroyed(this)).subscribe(val => {
      this.needSpinner = false;
      if (val.length) {
        const bi = {};
        bi['purchaseDetails'] = val[0].details.map(val2 => ({
          purchaseTime: format(parseISO(val2.purchaseTime), this.dateTimeFormat).toLowerCase(),
          pricePerUnit: (val2.pricePerUnit).toFixed(2),
          quantity: val2.quantity,
          voucherName: val2.voucherName,
          subtotalText: (val2.total).toFixed(2),
          subtotal: val2.total,
        }));
        const total = bi['purchaseDetails'].reduce((acc, now) => acc + now.subtotal, 0);

        // Make into displayable string
        bi['total'] = (total).toFixed(2);

        // Others
        bi['startDate'] = startDateText;
        bi['endDate'] = endDateText;

        const adminId = this.authenticationService.currentUserValue._id;
        this.billService.getCompanyInfo(adminId).pipe(untilDestroyed(this)).subscribe(val2 => {
          if (val2) {
            bi['companyDetails'] = val2.companyDetails;
            this.dataService.changeBill({
              billContent: bi,
              needVoucherRight: true,
              needHint: false
            });
            this.isFormChanged = false;
          }
        });
      } else {
        this.toastr.error('No record found');
        this.isFormChanged = false;
      }
    });
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
