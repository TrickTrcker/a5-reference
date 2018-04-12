import { Component, Input, OnInit, EventEmitter, ViewChild, Inject, forwardRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { AppComponent } from './app.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];

    constructor( @Inject(forwardRef(() => AppComponent)) public app: AppComponent) { }

    ngOnInit() {
        this.model = [

            { label: 'Get Started', guard: ['All', 'Master'], icon: 'fa fa-fw fa-lightbulb-o', routerLink: ['/getstarted'] },
            { label: 'Dashboard', icon: 'fa fa-fw fa-home', routerLink: ['/'] },
            {
                label: 'Accounts', guard: ['All', 'Accounts'], icon: 'fa fa-fw fa-book',
                items: [
                    { label: 'Chart of accounts', guard: ['All', 'Chart of Accounts'], icon: 'fa fa-fw fa-columns', routerLink: ['/accounts/chartofaccounts'] },
                    { label: 'Journals', guard: ['All', 'Journals'], icon: 'fa fa-fw fa-folder-open-o', routerLink: ['/accounts/journals/list'] },
                    { label: 'Credit Note', guard: ['All', 'Credit Note'], icon: 'fa fa-fw fa-table', routerLink: ['/accounts/creditnote'] },
                    { label: 'Debit Note', guard: ['All', 'Debit Note'], icon: 'fa fa-fw fa-list-alt', routerLink: ['/accounts/debitnote'] },
                ]
            },
            {
                label: 'Bank', guard: ['All', 'Bank'], icon: 'fa fa-fw fa-university',
                items: [
                    { label: 'Bank', guard: ['All', 'Bank Withdraw'], icon: 'fa fa-fw fa-krw', routerLink: ['/banks/list'] },
                    { label: 'Bank Withdraw', guard: ['All', 'Bank Withdraw'], icon: 'fa fa-fw fa-krw', routerLink: ['/banks/withdraw'] },
                    { label: 'Bank Deposit', guard: ['All', 'Bank Deposit'], icon: 'fa fa-fw fa-inr', routerLink: ['/banks/deposit'] },
                    { label: 'Bank Transfer', guard: ['All', 'Bank Transfer'], icon: 'fa fa-fw fa-retweet', routerLink: ['/banks/transfer'] },
                    // { label: 'BRS',guard:['All','BRS'], icon: 'fa fa-fw fa-file-text', routerLink: ['/banks/brslist'] },
                ]
            },
            { label: 'Products', guard: ['All', 'Products'], icon: 'fa fa-fw fa-shopping-cart', routerLink: ['/products'] },
            {
                label: 'Invoice', guard: ['All', 'Sales'], icon: 'fa fa-fw fa-money',
                items: [
                    { label: 'Sales Invoice', guard: ['All', 'Invoice'], icon: 'fa fa-fw fa-columns', routerLink: ['/sales/list'] },
                    // { label: 'pro-forma Invoice', icon: 'fa fa-fw fa-columns', routerLink: ['/sales/proformainvoice'] },
                    { label: 'Customer Advance', guard: ['All', 'Customer Advance'], icon: 'fa fa-fw fa-repeat', routerLink: ['/sales/customeradvance'] },
                ]
            },
            {
                label: 'Bills', guard: ['All', 'Bills'], icon: 'fa fa-fw fa-file-text',
                items: [
                    { label: 'Purchase Bills', guard: ['All', 'Bills'], icon: 'fa fa-fw fa-columns', routerLink: ['/purchase/list'] },
                    { label: 'Vendor Advance', guard: ['All', 'Vendor Advance'], icon: 'fa fa-fw fa-suitcase', routerLink: ['/purchase/vendoradvance'] },
                ]
            },
            { label: 'Receipts', guard: ['All', 'Receipt'], icon: 'fa fa-fw fa-file-text-o', routerLink: ['/receipts/list'] },

            { label: 'Payments', guard: ['All', 'Payment'], icon: 'fa fa-fw fa-credit-card', routerLink: ['/payment/list'] },
            // {
            //     label: 'GST Filing',guard:'ADMIN', icon: 'fa fa-fw fa-files-o',
            //     items: [
            //         { label: 'Tax Summary',guard:'ADMIN', icon: 'fa fa-fw fa-columns', routerLink: ['/sales/list'] },
            //     ]
            // },
            { label: 'Reports', guard: ['All', 'Reports'], icon: 'fa fa-fw fa-line-chart', routerLink: ['/reports/list'] },
            { label: 'GST Filing', guard: ['All', 'Reports'], icon: 'fa fa-fw fa-files-o', routerLink: ['/reports/gstfiling'] },
        ];
    }

    changeTheme(theme) {
        let themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        themeLink.href = 'assets/theme/theme-' + theme + '.css';
    }

    changeLayout(layout) {
        this.app.layout = layout;
        let layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
        layoutLink.href = 'assets/layout/css/layout-' + layout + '.css';
    }
}

@Component({
    selector: '[app-submenu]',
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass">
            <ng-template [ngxPermissionsOnly]="child.guard">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" *ngIf="!child.routerLink" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                    (mouseenter)="hover=true" (mouseleave)="hover=false">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                </a>
                </ng-template>
                <ng-template [ngxPermissionsOnly]="child.guard">
                <a (click)="itemClick($event,child,i)" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink" [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                    (mouseenter)="hover=true" (mouseleave)="hover=false">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                </a>
                </ng-template>
                <div class="layout-menu-tooltip">
                    <div class="layout-menu-tooltip-arrow"></div>
                    <div class="layout-menu-tooltip-text">{{child.label}}</div>
                </div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"
                    [@children]="app.slimMenu&&root ? isActive(i) ? 'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*'
            })),
            state('hidden', style({
                height: '0px'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenu {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _reset: boolean;

    activeIndex: number;

    hover: boolean;

    constructor( @Inject(forwardRef(() => AppComponent)) public app: AppComponent, public router: Router, public location: Location) { }

    itemClick(event: Event, item: MenuItem, index: number) {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //activate current item and deactivate active sibling if any
        if (item.routerLink || item.items) {
            this.activeIndex = (this.activeIndex === index) ? null : index;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        //prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        //hide menu
        if (!item.items) {
            if (this.app.overlayMenu || this.app.isMobile()) {
                this.app.overlayMenuActive = false;
                this.app.mobileMenuActive = false;
            }

            if (!this.root && this.app.slimMenu) {
                this.app.resetSlim = true;
            }
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    unsubscribe(item: any) {
        if (item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }

        if (item.items) {
            for (let childItem of item.items) {
                this.unsubscribe(childItem);
            }
        }
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && this.app.slimMenu) {
            this.activeIndex = null;
        }
    }
}