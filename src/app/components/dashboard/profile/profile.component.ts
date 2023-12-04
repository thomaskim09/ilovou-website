import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ProfileFormService } from 'src/app/providers/profile/profileForm/profile-form.service';
import { ProfileService } from 'src/app/providers/profile/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

// interface for select drop down
interface Tag {
  id: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {

  // form properties
  form: FormGroup;

  constructor(
    public profileFormService: ProfileFormService,
    public profileService: ProfileService,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.setUpForm();
    this.setUpRestaurantDetails();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    this.profileFormService.currentProfileForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private setUpRestaurantDetails() {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.restaurantId) {
      this.profileService.getRestaurantDetails(currentUser.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
        if (val) {
          const de = val.details;
          // Check if is hidden future restaurant
          if (de.businessHours.length === 0) {
            return;
          }

          const stringRoutineRestDay = de.routineRestDay.map(val2 => String(val2));
          this.setUpBusinessHoursForm(de.businessHours);
          this.deleteExtraSection(de.businessHours, de.routineRestDay);
          this.form.patchValue({
            restaurantName: de.restaurantName,
            restaurantType: de.restaurantType,
            contact: de.contact,
            restriction: de.restriction,
            isVegetarian: de.isVegetarian,
            restaurantImage: de.restaurantImage,
            restaurantImageList: de.restaurantImageList,
            restDayModel: stringRoutineRestDay,
            businessHours: de.businessHours,
            country: de.address.country,
            state: de.address.state,
            city: de.address.city,
            postcode: de.address.postcode,
            area: de.address.area,
            street: de.address.street,
            place: de.place,
            foodType: val.searchTags,
            shortAreaName: de.shortAreaName,
            fullAddress: de.fullAddress,
            longitude: de.location.coordinates[0],
            latitude: de.location.coordinates[1],
            locationTemp: 'Longitude: ' + de.location.coordinates[0].toFixed(2) +
              ' Latitude: ' + de.location.coordinates[1].toFixed(2)
          }, { emitEvent: false, onlySelf: true });

          if (de.routineRestDay[0] !== 0) {
            this.disableSelectedRestDay(stringRoutineRestDay);
          }
          this.profileFormService.changeProfileForm(this.form);
        }
      });
    }
  }

  private disableSelectedRestDay(valueObject) {
    for (const item of valueObject) {
      const day = +item;
      const section = (this.form.controls['businessHours'] as FormArray).at(day - 1).get('section') as FormArray;
      for (let j = 0; j < section.controls.length; j++) {
        section.controls[j].get('openTime').disable({ emitEvent: false });
        section.controls[j].get('closeTime').disable({ emitEvent: false });
        section.controls[j].get('openTime').setValue('', { emitEvent: false });
        section.controls[j].get('closeTime').setValue('', { emitEvent: false });
      }
    }
  }

  private setUpBusinessHoursForm(businessHours) {
    for (let i = 0; i <= 6; ++i) {
      for (let j = 1; j < businessHours[i].section.length; j++) {
        this.profileFormService.addSection(i);
      }
    }
  }

  private deleteExtraSection(businessHours, routineRestDay) {
    for (let i = 0; i <= 6; ++i) {
      const sectionLength = businessHours[i].section.length;
      const k = i;
      if (routineRestDay.includes(k + 1)) {
        continue;
      } else {
        this.profileFormService.deleteSection(i, sectionLength);
      }
    }
  }
}
