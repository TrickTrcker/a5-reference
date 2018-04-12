import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { PrimengConstant } from '../../app.primeconfig';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}


