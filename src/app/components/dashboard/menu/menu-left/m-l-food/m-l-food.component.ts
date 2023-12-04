import lo_isEmpty from 'lodash/isEmpty';
import lo_sortBy from 'lodash/sortBy';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { DragulaService } from 'ng2-dragula';
import { FormControl, FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { MenuService } from 'src/app/providers/menu/menu.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-m-l-food',
  templateUrl: './m-l-food.component.html',
  styleUrls: ['./m-l-food.component.scss']
})
export class MLFoodComponent implements OnInit, OnDestroy {

  // form properties
  form: FormGroup;

  menuId: string;
  categoryId: string;

  tabs = ['Category'];
  selected = new FormControl(0);
  isEditMode: boolean = false;

  // Dragula properties
  CATEGORY_LIST = 'CATEGORY_LIST';
  isCategoryOrderChanged: boolean = false;
  newCategoryOrder: any;
  categoryDragSub = new Subscription();

  FOOD_LIST = 'FOOD_LIST';
  isFoodOrderChanged: boolean = false;
  newFoodOrder: any;
  foodDragSub = new Subscription();
  order: number;

  categoryList = [];
  foodList = [];

  // Controller
  timer: any;
  timer2: any;
  needSpinner: boolean = false;
  disableToggle: boolean = false;

  constructor(
    public menuService: MenuService,
    public menuFormService: MenuFormService,
    public dataService: DataService,
    public hintService: HintService,
    public authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public dragulaService: DragulaService) { }

  ngOnInit() {
    this.setUpForm();
    this.menuId = this.authenticationService.currentUserValue.menuId;
    if (this.menuId) {
      this.listenCategoryDragChanges();
      this.listenFoodDragChanges();
      this.refreshCategoryList();
      this.listenToMLRefresh();
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  private setUpForm() {
    this.menuFormService.currentMenuLeftFoodForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private listenCategoryDragChanges() {
    this.categoryDragSub.add(this.dragulaService.dropModel(this.CATEGORY_LIST).pipe(untilDestroyed(this))
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        this.newCategoryOrder = targetModel.map(result => result._id);
        this.isCategoryOrderChanged = true;
      })
    );
  }

  private listenFoodDragChanges() {
    this.foodDragSub.add(this.dragulaService.dropModel(this.FOOD_LIST).pipe(untilDestroyed(this))
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        this.newFoodOrder = targetModel.map(result => result._id);
        this.isFoodOrderChanged = true;
      })
    );
  }

  private listenToMLRefresh() {
    this.dataService.currentFoodContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (!val.toComponent.includes('MLFood')) {
        return;
      }
      if (val.MLFoodRefresh) {
        this.refreshFoodList(val.categoryId, true);
      } else if (val.MLCategoryRefresh) {
        this.refreshCategoryList(true);
      }
    });
  }

  private refreshCategoryList(refresh?) {
    this.menuService.getCategory(this.menuId, refresh).pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.categoryList = lo_sortBy(val.categoryDetails, ['order']);
      }
    });
  }

  private refreshFoodList(categoryId, refresh?) {
    this.menuService.getFoodList(this.menuId, categoryId, refresh).pipe(untilDestroyed(this)).subscribe(val => {
      this.foodList = val.length !== 0 ? lo_sortBy(val[0].itemDetails, ['order']) : [];
    });
  }

  // Category section
  addNewCategory() {
    this.dataService.changeFoodsContent({
      toComponent: ['menu', 'hint', 'MRCategory'],
      // Menu component
      needMenuRight: true,
      needFoodForm: false,
      needCategoryForm: true,
      // Hint component
      type: 'Category',
      categoryId: undefined,
      categoryOrder: this.categoryList.length,
      isFirstCreate: true,
      isFormChanged: false
    });
  }

  viewCategoryTab(id, name) {
    this.tabs.push(name);
    this.selected.setValue(this.tabs.length - 1);
    this.dataService.changeFoodsContent({
      toComponent: ['menu', 'hint'],
      // Menu component
      needMenuRight: false,
      needCategoryForm: false,
      // Hint component
      isFirstCreate: false,
      isFormChanged: false,
    });
    this.categoryId = id;
    this.refreshFoodList(id);
    this.turnOffController();
  }

  viewCategory(id, item, order) {
    this.dataService.changeFoodsContent({
      toComponent: ['menu', 'MRCategory', 'hint'],
      // Menu component
      needMenuRight: true,
      needCategoryForm: true,
      // Hint component
      type: 'Category',
      categoryId: id,
      categoryName: item.categoryName,
      categoryOrder: order,
      isFirstCreate: false,
      isFormChanged: false,
      // MR component
      categoryContent: item,
    });
  }

  removeCategory(id, name) {
    const title = `Confirm to delete ${name}?`;
    const message = 'Warning, deleting category will also delete all items in this category too. Please proceed with caution :)';
    this.hintService.showModal(title, message, 'Confirm', 'No').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.menuService.deleteCategory(this.menuId, id).pipe(untilDestroyed(this)).subscribe(val => {
        this.toastr.success('Category deleted');
        this.dataService.changeFoodsContent({
          toComponent: ['menu', 'MLFood', 'MRCategory'],
          MLCategoryRefresh: true,
          needMenuRight: false,
          needCategoryForm: false
        });
      });
    });
  }

  toggleCategoryStatus(id, event) {
    this.disableToggle = true;
    if (!event.checked) {
      this.changeCategoryStatus(id, 'HD', 'Category is hidden');
    } else {
      this.changeCategoryStatus(id, 'OP', 'Category is open for viewing');
    }
  }

  private changeCategoryStatus(catId, status, text) {
    this.menuService.changeCategoryStatus(this.menuId, catId, status).pipe(untilDestroyed(this)).subscribe(val => {
      this.disableToggle = false;
      this.toastr.success(text);
    });
  }

  updateCategoryOrder() {
    this.hintService.showModal('Confirm to update category\'s order?', '', 'Confirm', 'Not Yet')
      .pipe(untilDestroyed(this)).subscribe(result => {
        if (result !== 'yes') {
          return;
        }
        this.needSpinner = true;
        this.menuService.updateCategoryOrder(this.menuId, this.newCategoryOrder).pipe(untilDestroyed(this)).subscribe(val => {
          this.needSpinner = false;
          this.toastr.success('Category\'s order updated');
          this.isCategoryOrderChanged = false;
        });
      });
  }

  // Food section
  addNewFood() {
    this.dataService.changeFoodsContent({
      toComponent: ['menu', 'hint', 'MRFood'],
      // For menu component
      needMenuRight: true,
      needFoodForm: true,
      needCategoryForm: false,
      // For hint component & MRFood
      type: 'Food',
      foodOrder: this.foodList.length,
      isFormChanged: false,
      isFirstCreate: true,
    });
  }

  viewFood(id, order) {
    this.dataService.changeFoodsContent({
      toComponent: ['menu', 'hint', 'MRFood'],
      // For menu component
      needMenuRight: true,
      needFoodForm: true,
      // For hint component & MRFood
      type: 'Food',
      isFirstCreate: false,
      foodId: id,
      foodOrder: order
    });
  }

  removeFood(id, name) {
    const title = `Confirm to delete ${name}?`;
    this.hintService.showModal(title, '', 'Confirm', 'No').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.menuService.deleteFood(this.menuId, id, this.categoryId).pipe(untilDestroyed(this)).subscribe(val => {
        this.toastr.success('Item deleted');
        this.dataService.changeFoodsContent({
          toComponent: ['MLFood'],
          MLFoodRefresh: true,
          needMenuRight: false,
          needFoodForm: false,
          categoryId: this.categoryId,
        });
      });
    });
  }

  toggleFoodStatus(id, event) {
    this.disableToggle = true;
    if (!event.checked) {
      this.changeFoodStatus(id, 'HD', 'Item is hidden');
    } else {
      this.changeFoodStatus(id, 'OP', 'Item is open for viewing');
    }
  }

  private changeFoodStatus(foodId, status, text) {
    this.menuService.changeFoodStatus(this.menuId, foodId, status, this.categoryId).pipe(untilDestroyed(this)).subscribe(val => {
      this.disableToggle = false;
      this.toastr.success(text);
    });
  }

  updateFoodOrder() {
    const title = 'Confirm to update food\'s order?';
    const message = 'Please confirm voucher\'s details, because it cannot be modified after created';
    this.hintService.showModal(title, message, 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      this.menuService.updateFoodOrder(this.menuId, this.newFoodOrder, this.categoryId).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.toastr.success('Food\'s order updated');
        this.isFoodOrderChanged = false;
      });
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  tabChange(ev) {
    if (ev.index === 0) {
      this.tabs.splice(1, 1);
      this.dataService.changeFoodsContent({
        toComponent: ['menu', 'hint'],
        needMenuRight: false,
        needFoodForm: false,
        isFormChanged: true
      });
      this.turnOffController();
    }
  }

  toggleStatus(status) {
    return status === 'OP' ? true : false;
  }

  private turnOffController() {
    this.isEditMode = false;
    this.isCategoryOrderChanged = false;
    this.isFoodOrderChanged = false;
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
