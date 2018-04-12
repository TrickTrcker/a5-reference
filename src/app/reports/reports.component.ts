import { Component, OnInit, OnDestroy } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { PrimengConstant } from '../app.primeconfig';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  hotkeyBS: Hotkey | Hotkey[];
  hotkeyPL: Hotkey | Hotkey[];
  hotkeyTBG: Hotkey | Hotkey[];
  hotkeyTBL: Hotkey | Hotkey[];
  hotkeyLedger: Hotkey | Hotkey[];
  hotkeyInvReg: Hotkey | Hotkey[];
  hotkeyBillReg: Hotkey | Hotkey[];
  hotkeyRecReg: Hotkey | Hotkey[];
  hotkeyPymtReg: Hotkey | Hotkey[];
  hotkeyTxSmry: Hotkey | Hotkey[];
  hotkeyBrs: Hotkey | Hotkey[];
  hotkeyDayBk:Hotkey | Hotkey[];
  hotkeyInvTax:Hotkey | Hotkey[];
  hotkeyBillTax:Hotkey | Hotkey[];
  hotkeyOutInv:Hotkey | Hotkey[];
  hotkeyOutPay:Hotkey | Hotkey[];
  hotkeyCredit:Hotkey | Hotkey[];
  hotkeyDebit:Hotkey | Hotkey[];
  hotkeyJourReg:Hotkey | Hotkey[];
  constructor(private router: Router,
    private _hotkeysService: HotkeysService) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    // Shortcut Key - Trail balance - Groups
    this.hotkeyBS = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.BS.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/balancesheet']);
      return false;
    }, [], shrtkeys.REPORT.BS.TXT));
    // Shortcut Key - Profit and Loss
    this.hotkeyPL = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.PL.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/profitloss']);
      return false;
    }, [], shrtkeys.REPORT.PL.TXT));
    // Shortcut Key - Trail balance - Groups
    this.hotkeyTBG = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.TBG.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/trailbalance']);
      return false;
    }, [], shrtkeys.REPORT.TBG.TXT));
    // Shortcut Key - Trail balance - Ledgers
    this.hotkeyTBL = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.TBL.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/detailedtrialbalance']);
      return false;
    }, [], shrtkeys.REPORT.TBL.TXT));
    // Shortcut Key - Ledgers
    this.hotkeyLedger = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.LEDGER.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/ledger']);
      return false;
    }, [], shrtkeys.REPORT.LEDGER.TXT));
    // Shortcut Key - Invoice Register
    this.hotkeyInvReg = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.INV_REG.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/invoiceregister']);
      return false;
    }, [], shrtkeys.REPORT.INV_REG.TXT));
    // Shortcut Key - Bill Register
    this.hotkeyBillReg = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.BILL_REG.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/billregister']);
      return false;
    }, [], shrtkeys.REPORT.BILL_REG.TXT));
    // Shortcut Key - Receipt Register
    this.hotkeyRecReg = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.REC_REG.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/receipt-register']);
      return false;
    }, [], shrtkeys.REPORT.REC_REG.TXT));
    // Shortcut Key - Payment Register
    this.hotkeyPymtReg = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.PYMT_REG.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/paymentregister']);
      return false;
    }, [], shrtkeys.REPORT.PYMT_REG.TXT));
    // Shortcut Key - Tax summary
    this.hotkeyTxSmry = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.TX_SMRY.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/taxsummary']);
      return false;
    }, [], shrtkeys.REPORT.TX_SMRY.TXT));
    // Shortcut Key - BRS REport
    this.hotkeyBrs = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.BRS.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/brsreport']);
      return false;
    }, [], shrtkeys.REPORT.BRS.TXT));
    //Code added on 15-Feb-2018
    // Shortcut Key - Day Book
    this.hotkeyDayBk = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.DAY_BK.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/daybook']);
      return false;
    }, [], shrtkeys.REPORT.DAY_BK.TXT));
    // Shortcut Key - Invoice Taxation
    this.hotkeyInvTax = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.INV_TAX.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/invoicetaxation']);
      return false;
    }, [], shrtkeys.REPORT.INV_TAX.TXT));
    // Shortcut Key -Bill Taxation
    this.hotkeyBillTax = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.BILL_TAX.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/billtaxation']);
      return false;
    }, [], shrtkeys.REPORT.BILL_TAX.TXT));
    // Shortcut Key - Outstanding Invoices
    this.hotkeyOutInv = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.OUT_INV.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/outstandinginvoices']);
      return false;
    }, [], shrtkeys.REPORT.OUT_INV.TXT));
    // Shortcut Key - Outstanding Payments
    this.hotkeyOutPay = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.OUT_PAY.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/outstandingpayments']);
      return false;
    }, [], shrtkeys.REPORT.OUT_PAY.TXT));
     // Shortcut Key - Credit Note Register
     this.hotkeyCredit = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.CREDIT_REG.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/creditnoteregister']);
      return false;
    }, [], shrtkeys.REPORT.CREDIT_REG.TXT));
     // Shortcut Key - Debit Note Register
     this.hotkeyDebit = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.DEBIT_REG.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/debitnoteregister']);
      return false;
    }, [], shrtkeys.REPORT.DEBIT_REG.TXT));
      // Shortcut Key - Journal Register
      this.hotkeyJourReg = this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.JOURNAL_REG.KEY, (event: KeyboardEvent): boolean => {
        this.router.navigate(['reports/journalregister']);
        return false;
      }, [], shrtkeys.REPORT.JOURNAL_REG.TXT));
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyBrs);
    this._hotkeysService.remove(this.hotkeyBS);
    this._hotkeysService.remove(this.hotkeyInvReg);
    this._hotkeysService.remove(this.hotkeyBillReg);
    this._hotkeysService.remove(this.hotkeyRecReg);
    this._hotkeysService.remove(this.hotkeyPymtReg);
    this._hotkeysService.remove(this.hotkeyLedger);
    this._hotkeysService.remove(this.hotkeyPL);
    this._hotkeysService.remove(this.hotkeyTBG);
    this._hotkeysService.remove(this.hotkeyTBL);
    this._hotkeysService.remove(this.hotkeyTxSmry);
    this._hotkeysService.remove(this.hotkeyDayBk);
    this._hotkeysService.remove(this.hotkeyInvTax);
    this._hotkeysService.remove(this.hotkeyBillTax);
    this._hotkeysService.remove(this.hotkeyOutInv);
    this._hotkeysService.remove(this.hotkeyOutPay);
    this._hotkeysService.remove(this.hotkeyCredit);
    this._hotkeysService.remove(this.hotkeyDebit);
    this._hotkeysService.remove(this.hotkeyJourReg);
  }
}
