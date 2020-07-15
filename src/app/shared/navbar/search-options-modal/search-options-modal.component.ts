import {Component, OnInit, ViewChild} from '@angular/core';
import {IonRange, ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category, Condition} from '../../../home/product/model/product';

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

  constructor(private modalController: ModalController, private fb: FormBuilder) {
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

  priceChanged($event: any) {
    console.log(this.range.value);
  }

  dismissModal() {
    this.form.patchValue({minPrice: this.range.value['lower'], maxPrice: this.range.value['upper']});
    console.log(this.form.getRawValue());
    this.modalController.dismiss({});
  }
}
