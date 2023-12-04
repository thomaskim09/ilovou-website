import lo_orderBy from 'lodash/orderBy';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { HintService } from './../../../../../providers/hint/hint.service';
import { VoucherService } from 'src/app/providers/voucher/voucher.service';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';

interface Branch {
  id: string;
  name: string;
}

@Component({
  selector: 'app-v-r-branch',
  templateUrl: './v-r-branch.component.html',
  styleUrls: ['./v-r-branch.component.scss']
})
export class VRBranchComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup;

  // branch properties
  restaurantList: any;

  // ngx select properties
  branchFilterCtrl: FormControl = new FormControl();
  branchOptions: Branch[] = [];
  filteredBranch: ReplaySubject<Branch[]> = new ReplaySubject<Branch[]>(1);

  constructor(
    public hintService: HintService,
    public voucherService: VoucherService,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.restaurantList.length > 1) {
      this.setUpBranch(currentUser);
    }
  }

  ngOnDestroy() {
    // Left of untilDestroyed
  }

  private setUpBranch(currentUser) {
    this.voucherService.getBranchList(currentUser._id).pipe(untilDestroyed(this)).subscribe(res => {
      const list2 = res.filter(val => val._id !== currentUser.restaurantId);
      const list3 = lo_orderBy(list2, [val => val.name.toLowerCase()], ['asc']);
      this.branchOptions = list3.map(val => ({
        id: val._id,
        name: val.name
      }));
      this.filteredBranch.next(this.branchOptions.slice());
      this.branchFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
        this.filteredBranch.next(this.filterTag(this.branchOptions, this.branchFilterCtrl));
      });
    });
  }

  private filterTag(options, formControl) {
    if (!options) {
      return;
    }
    // get the search keyword
    let search = formControl.value;
    if (!search) {
      return options.slice();
    } else {
      search = search.toLowerCase();
    }
    // filter the tags
    return options.filter(tag => tag.name.toLowerCase().indexOf(search) > -1);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
