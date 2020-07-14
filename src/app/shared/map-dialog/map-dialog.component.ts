import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ModalController} from '@ionic/angular';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css'],
})
export class MapDialogComponent implements OnInit {
  @Input() coordinates;
  isLoadingContent = true;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  toggleLoading() {
    this.isLoadingContent = false;
  }
  setCoordinates(coords) {
    this.coordinates = coords;
  }
  cancelAndClose() {
    this.modalController.dismiss({
      coordinates: null
    });
  }

  acceptAndClose() {
    this.modalController.dismiss({
      coordinates: this.coordinates
    });
  }

}
