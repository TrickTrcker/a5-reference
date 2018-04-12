import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { PrimengConstant } from '../../app.primeconfig';
@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.component.html',
  styleUrls: ['./getstarted.component.scss']
})
export class GetstartedComponent implements OnInit {
  hotkeyAppSet: Hotkey | Hotkey[];
  hotkeyContacts: Hotkey | Hotkey[];
  hotkeyBrand: Hotkey | Hotkey[];
  hotkeySeqSet: Hotkey | Hotkey[];
  hotkeyLedger: Hotkey | Hotkey[];
  hotkeyCategory: Hotkey | Hotkey[];
  hotkeyBank: Hotkey | Hotkey[];
  constructor(private router: Router,
    private _hotkeysService: HotkeysService) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    // Shortcut Key - APP SETTINGS
    this.hotkeyAppSet = this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.APP_SETTINGS.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['appsetting']);
      return false;
    }, [], shrtkeys.GETSTARTED.APP_SETTINGS.TXT));
    // Shortcut Key - Contacts
    this.hotkeyContacts = this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.CONTACTS.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['parties']);
      return false;
    }, [], shrtkeys.GETSTARTED.CONTACTS.TXT));
    // Shortcut Key - Brand
    this.hotkeyBrand = this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.BRANDS.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['brand']);
      return false;
    }, [], shrtkeys.GETSTARTED.BRANDS.TXT));
    // Shortcut Key - Category
    this.hotkeyCategory = this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.CATEGORY.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['category']);
      return false;
    }, [], shrtkeys.GETSTARTED.CATEGORY.TXT));
    // Shortcut Key - ledger
    this.hotkeyLedger = this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.LEDGERS.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['ledger']);
      return false;
    }, [], shrtkeys.GETSTARTED.LEDGERS.TXT));
    // Shortcut Key - Bank
    this.hotkeyBank = this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.BANK.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['bank']);
      return false;
    }, [], shrtkeys.GETSTARTED.BANK.TXT));
    // Shortcut Key - Sequence Settings
    this.hotkeySeqSet = this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.SEQUENCESETTINGS.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['seqsettings']);
      return false;
    }, [], shrtkeys.GETSTARTED.SEQUENCESETTINGS.TXT));
    // Shortcut Key - Home
    this._hotkeysService.add(new Hotkey(shrtkeys.HOME.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['']);
      return false;
    }, [], shrtkeys.HOME.TXT));
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyAppSet);
    this._hotkeysService.remove(this.hotkeyContacts);
    this._hotkeysService.remove(this.hotkeyBrand);
    this._hotkeysService.remove(this.hotkeySeqSet);
    this._hotkeysService.remove(this.hotkeyBank);
    this._hotkeysService.remove(this.hotkeyLedger);
    this._hotkeysService.remove(this.hotkeyCategory);
  }
}
