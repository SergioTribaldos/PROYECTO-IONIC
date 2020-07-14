import { Component, OnInit } from '@angular/core';
import { AuthState } from './auth/store/auth.reducers';
import { Store, select } from '@ngrx/store';
import { AuthActions } from './auth/store/action-types';
import { AuthService } from './auth/services/auth.service';
import { AppState } from './reducers';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import {Platform} from "@ionic/angular";
import {StatusBar} from "@ionic-native/status-bar/ngx";
import {SplashScreen} from "@ionic-native/splash-screen/ngx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  isLoggedOut$: Observable<boolean>;
  constructor(private store: Store<AppState>,    private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(): void {
    const userProfile = localStorage.getItem('userToken');

    if (userProfile) {
      this.store.dispatch(
        AuthActions.checkToken({ token: JSON.parse(userProfile) })
      );
    }
  }
}
