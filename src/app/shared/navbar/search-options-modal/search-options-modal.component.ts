import {Component, OnInit, ViewChild} from '@angular/core';
import {IonRange, ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category, Condition} from '../../../home/product/model/product';
import {PRODUCT_ACTIONS} from '../../../home/product/store/product.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../reducers';

@Component({
  selector: 'app-search-options-modal',
  templateUrl: './search-options-modal.component.html',
  styleUrls: ['./search-options-modal.component.scss'],
})
export class SearchOptionsModalComponent implements OnInit {
  @ViewChild(IonRange) range: IonRange;
  form: FormGroup;
  prices: any;
  categoryList = Object.values(Category);
  conditionList = Object.values(Condition);

  constructor(private store: Store<AppState>,private modalController: ModalController, private fb: FormBuilder) {
    this.form = fb.group({
      minPrice: [null],
      maxPrice: [null],
      searchTags: [null],
      maxDistance: [null],
      conditionTags: [null],
    });
  }

  ngOnInit() {
  }


  acceptAndClose() {
    this.form.patchValue({minPrice: this.range.value['lower'], maxPrice: this.range.value['upper']});
    this.search()
    this.modalController.dismiss();
  }

  cancelAndClose() {
    this.search()
    this.modalController.dismiss();
  }

  private search() {
    this.deleteFormNullValues();
    const hasSearchFilters = Object.values(this.form.controls).some(
      ({value}) => value
    );

    this.store.dispatch(
      PRODUCT_ACTIONS.setHasSearchFilters({hasSearchFilters})
    );

    hasSearchFilters
      ? this.searchProductsWithParams()
      : this.performFirstProductsLoading();

  }

  private searchProductsWithParams() {
    this.store.dispatch(
      PRODUCT_ACTIONS.searchProducts({searchParams: this.form.value})
    );
  }

  private performFirstProductsLoading() {
    this.store.dispatch(PRODUCT_ACTIONS.resetResultsSkipped());
    this.store.dispatch(PRODUCT_ACTIONS.loadProducts());
  }

  private deleteFormNullValues() {
    Object.keys(this.form.value).forEach(
      (key) => this.form.value[key] === null && delete this.form.value[key]
    );
  }
}
