import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private toastController: ToastController) {
  }

  async showNotification(message, status) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: status === 'ok' ? 'success' : 'danger'
    });
    toast.present();
  }
}
