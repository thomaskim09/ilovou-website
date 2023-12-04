import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { VoucherService } from 'src/app/providers/voucher/voucher.service';
import { VoucherViewService } from 'src/app/providers/voucher/voucherView/voucher-view.service';
import { isBefore, isAfter, parseISO } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-voucher-left',
  templateUrl: './voucher-left.component.html',
  styleUrls: ['./voucher-left.component.scss']
})
export class VoucherLeftComponent implements OnInit, OnDestroy {

  // Form properties
  form: FormGroup;

  // HTML properties
  voucherList: any = [];
  historyVoucherList: any = [];
  maxVouchersCount: number = 5;

  // JS properties
  restaurantId: string;

  // HTML controller
  isHistoryMode: boolean = false;
  isEditMode: boolean = false;
  toggleHide: boolean = false;

  // Dragula properties
  VOUCHER_LIST = 'VOUCHER_LIST';
  dragSub = new Subscription();
  order: number;
  isOrderChanged: boolean = false;
  newVoucherOrder: any;

  // Controller
  timer: any;
  timer3: any;
  needSpinner: boolean = false;
  disableToggle: boolean = false;

  // Infinite scroll
  needInfiniteScroll: boolean = true;
  pageNum: any = 1;
  pageSize: any = 10;
  finished: boolean = false;
  scrollTimeOut: any;

  constructor(
    public authenticationService: AuthenticationService,
    public voucherViewService: VoucherViewService,
    public voucherService: VoucherService,
    public voucherFormService: VoucherFormService,
    public toastr: ToastrService,
    public hintService: HintService,
    public dragulaService: DragulaService) { }

  ngOnInit() {
    this.restaurantId = this.authenticationService.currentUserValue.restaurantId;
    this.getVoucherList();
    this.listenRefreshVoucherList();
    this.setUpVoucherLeftForm();
    this.listenVoucherDragChanges();
  }

  ngOnDestroy() {
    // Left of untilDestroyed
    clearTimeout(this.timer);
    clearTimeout(this.timer3);
    clearTimeout(this.scrollTimeOut);
  }

  private getVoucherList(refresh?) {
    if (this.restaurantId) {
      this.voucherService.getVoucherList(this.restaurantId, 'active', this.pageSize, 1, refresh).pipe(untilDestroyed(this)).subscribe(val => {
        this.voucherList = val.map(val2 => ({
          id: val2._id,
          name: val2.details.voucherName,
          status: val2.status,
          price: val2.details.newPrice,
          startSellingTime: val2.details.startSellingTime,
          soldOutTime: val2.details.soldOutTime,
        }));
        this.voucherViewService.setVoucherLengthValue(this.voucherList.length);
        this.checkIfListFull();
      });
    } else {
      this.timer = setTimeout(() => this.toastr.error('Need to create a restaurant first'));
    }
  }

  private listenRefreshVoucherList() {
    this.voucherViewService.currentSubmitStatus.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.getVoucherList(true);
      }
    });
  }

  private setUpVoucherLeftForm() {
    this.voucherFormService.currentVoucherLeftForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private getHistoryVoucherList(refresh?) {
    if (this.restaurantId) {
      this.voucherService.getVoucherList(this.restaurantId, 'history', this.pageSize, this.pageNum, refresh).pipe(untilDestroyed(this)).subscribe(val => {
        if (!val.length) {
          this.toastr.error('No record found');
          return;
        }
        const result = val.map(val2 => ({
          id: val2._id,
          name: val2.details.voucherName,
          price: val2.details.newPrice,
        }));

        this.historyVoucherList = [...this.historyVoucherList, ...result];

        this.finished = true;

        if (val.length < this.pageSize) {
          this.pageNum = 1;
          this.needInfiniteScroll = false;
        } else {
          this.pageNum++;
          this.needInfiniteScroll = true;
        }
      });
    } else {
      this.timer3 = setTimeout(() => this.toastr.error('Need to create a restaurant first'));
    }
  }

  toggleChecked(status) {
    switch (status) {
      case 'OP': return true;
      case 'WG': return true;
      case 'SO': return true;
      case 'HD': return false;
    }
  }

  private checkIfListFull() {
    if (this.voucherList.length >= this.maxVouchersCount) {
      this.voucherViewService.changeMessage('full');
    } else {
      return;
    }
  }

  private listenVoucherDragChanges() {
    this.dragSub.add(this.dragulaService.dropModel(this.VOUCHER_LIST)
      .pipe(untilDestroyed(this)).subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        this.newVoucherOrder = targetModel.map(result => result.id);
        this.isOrderChanged = true;
      }));
  }

  onScroll(event: any) {
    if (!this.isHistoryMode) {
      return;
    }
    clearTimeout(this.scrollTimeOut);
    this.scrollTimeOut = setTimeout(() => {
      if (this.needInfiniteScroll) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
          this.finished = false;
          this.getHistoryVoucherList();
        }
      }
    }, 66);
  }

  checkIfStatusSO(status, soldOutTime) {
    switch (status) {
      case 'HD': return isAfter(new Date(), soldOutTime) ? true : false;
      case 'SO': return true;
      default: return false;
    }
  }

  toggleVoucherStatus(id, event, item) {
    const resStatus = this.checkIfHideRestaurant(event.checked, this.voucherList);
    if (resStatus !== 'NV') {
      this.processToggle(id, event, item, resStatus);
      return;
    }
    this.hintService.showModal('Confirm to hide your last voucher?', 'Vouchy need at least one voucher online', 'Confirm', 'No').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        event.source.checked = true;
        return;
      }
      this.processToggle(id, event, item, resStatus);
    });
  }

  private processToggle(id, event, item, resStatus) {
    this.disableToggle = true;
    if (!event.checked) {
      this.changeStatus(id, 'HD', 'Voucher is hidden', resStatus);
      return;
    }
    if (item.startSellingTime && isBefore(new Date(), parseISO(item.startSellingTime))) {
      this.changeStatus(id, 'WG', 'Voucher is waiting for grab', resStatus);
    } else if (item.soldOutTime && isAfter(new Date(), parseISO(item.soldOutTime))) {
      this.changeStatus(id, 'SO', 'Voucher is visible and sold out', resStatus);
    } else {
      this.changeStatus(id, 'OP', 'Voucher is opened for sell', resStatus);
    }
  }

  private checkIfHideRestaurant(isChecked, list) {
    if (list.length === 1) {
      return isChecked ? 'OP' : 'NV';
    }
    let open = 0;
    list.map(val => {
      if (val.status === 'OP' || val.status === 'WG') {
        open++;
      }
    });
    if (!isChecked && open === 1) {
      return 'NV';
    } else if (isChecked && open === 0) {
      return 'OP';
    }
    return undefined;
  }

  private changeStatus(id, status, text, restaurantStatus) {
    this.voucherService.changeVoucherStatus(id, status, this.restaurantId, restaurantStatus).pipe(untilDestroyed(this)).subscribe(val => {
      this.disableToggle = false;
      this.toastr.success(text);
      const result = this.voucherList.find(val2 => val2.id === id);
      result['status'] = status;
    });
  }

  removeVoucher(id, name) {
    const restaurantStatus = this.voucherList.length === 1 ? 'NV' : undefined;
    const subTitle = restaurantStatus === 'NV' ? 'Vouchy need at least one voucher online' : '';
    this.hintService.showModal('Confirm to delete ' + name + '?', subTitle, 'Confirm', 'No').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.voucherService.changeVoucherStatus(id, 'CL', this.restaurantId, restaurantStatus).pipe(untilDestroyed(this)).subscribe(val => {
        this.toastr.success('Voucher Deleted');
        this.voucherList = this.voucherList.filter(val2 => val2.id !== id);
        this.voucherViewService.setVoucherLengthValue(this.voucherList.length);
      });
    });
  }

  toggleHistoryMode() {
    this.isHistoryMode = !this.isHistoryMode;
    if (this.isHistoryMode) {
      this.historyVoucherList = [];
      this.getHistoryVoucherList();
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  addNewVoucher() {
    this.voucherViewService.changeMessage('new');
  }

  viewVoucher(id) {
    this.voucherViewService.changeMessage(id);
  }

  updateVoucherOrder() {
    this.hintService.showModal('Confirm to update voucher\'s order?', '', 'Confirm', 'Not Yet')
      .pipe(untilDestroyed(this)).subscribe(result => {
        if (result !== 'yes') {
          return;
        }
        this.needSpinner = true;
        this.voucherService.updateVoucherOrder(this.newVoucherOrder).pipe(untilDestroyed(this)).subscribe(val => {
          this.needSpinner = false;
          this.toastr.success('Voucher\'s order updated');
          this.isOrderChanged = false;
        });
      });
  }

  voucherHintMessage(status) {
    if (status === 'SO') {
      this.hintSender(36);
    } else {
      this.hintSender(2);
    }
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
