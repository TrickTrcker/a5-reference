<!-- ref https://stackblitz.com/edit/angular-o1pq84?file=src%2Fapp%2Flist-items.component.html -->
<div id="submodule-pg" class="content-page component_holder">
    <p-menubar [model]="MenuBaritems" styleClass="custom_menubar"></p-menubar>
    <p-scrollPanel [style]="{width: '100%' }" styleClass="custom_scrollpane">
        <div (click)="$event.preventDefault()" class="tree_container content-section modules-div">
            <div class="modules_container">
                <!-- <module-items [(TreeItems)]="ModuleTreeItems" [isRoot]="true">
          </module-items> -->
                <ng-template #recursiveList let-TreeItems let-parentModule='parentModule'>
                    <li [ngClass]="'ZoomLevel_'+ZoomLevel" class="level" [ngClass]="(TreeItems.legoLevel == currentLegoLevel )?'level_one': 
                    (TreeItems.legoLevel == (currentLegoLevel + 1 ) )?'level_two':
                    (TreeItems.legoLevel== (currentLegoLevel + 2 ) )?'level_three' :
                    (TreeItems.legoLevel > (currentLegoLevel + 2 ) )?'level_four' :level_n" *ngIf="TreeItems" [style.width]="getmoduleWidth(TreeItems,'li')">
                        <!-- <div *ngIf="(TreeItems.referencem == true) " class="drag_items main_module ref_module">
                            <div [contextMenu]="refmoduleRightMenu" [contextMenuSubject]="TreeItems">
                                <span class="num-top">{{ TreeItems.mid }}</span>
                                <div class="title-txt-nw">{{ TreeItems.label }} </div>
                                <span class="num-bottom"></span>
                                <span class="num-pad">{{TreeItems.mid}} -
                                    <span *ngIf="item.children;">{{TreeItems.children.length}}</span>
                                </span>
                            </div>
                            <span (click)="addBlink($event)" class="drag_hover" [contextMenu]="CommonModuleRightMenu" [contextMenuSubject]="TreeItems"></span>
                            <span *ngIf="TreeItems.legoLevel == 2" (click)="addBlink($event)" class="drag_hover_vertical" [contextMenu]="CommonModuleRightMenu"
                                [contextMenuSubject]="TreeItems"></span>
                        </div> -->
                        <div [ngClass]="(TreeItems.referenceLegoId != 0)?'ref_module': normal_module" *ngIf="(TreeItems.cType != 'E' && TreeItems.cType != 'D' && TreeItems.cType != null)"
                            class="mdrag_items main_module">
                            <div [contextMenu]="mainmoduleRightMenu" [contextMenuSubject]="[parentModule,TreeItems,false]">
                                <span class="num-top">{{ TreeItems.position }}</span>
                                <div class="title-txt-nw">
                                    <div class="title-txt-div" *ngIf="TreeItems.renamable != true">{{ TreeItems.legoName }} </div>
                                    <input class="compact_textbox" *ngIf="TreeItems.renamable == true" type="text" [attr.value]="TreeItems.legoName" [attr.id]="'renamemodule_' + TreeItems.legoId"
                                        (focusout)="hideRename(parentModule,TreeItems,$event)">
                                </div>
                                <span class="num-bottom"></span>
                                <span class="num-pad">{{TreeItems.legoLevel}} -
                                    <span *ngIf="TreeItems.children;">{{TreeItems.children.length}}</span>
                                </span>
                            </div>
                            <span (click)="addBlink($event)" class="drag_hover" [contextMenu]="CommonModuleRightMenu" [contextMenuSubject]="[parentModule,TreeItems,false]"></span>
                            <span *ngIf=" verticalVisible(TreeItems)" (click)="addBlink($event)" class="drag_hover_vertical" [contextMenu]="CommonModuleRightMenu"
                                [contextMenuSubject]="[parentModule,TreeItems,true]"></span>
                        </div>
                        <!-- <div *ngIf="(TreeItems.type == 'O' || TreeItems.type == 'P') && TreeItems.legoLevel > 2 " class="mdrag_items main_module normal_module">
                            <div (mouseup)="triggerContextmenu($event,submoduleRightMenu,TreeItems)" [contextMenu]="submoduleRightMenu" [contextMenuSubject]="TreeItems">
                                <span class="num-top">{{ in+1 }}</span>
                                <div class="title-txt-nw">
                                    <span *ngIf="TreeItems.renamable != true">{{ TreeItems.legoName }} </span>
                                    <input class="compact_textbox" *ngIf="TreeItems.renamable == true" type="text" [attr.value]="TreeItems.legoName" [attr.id]="'renamemodule_' + TreeItems.legoId"
                                        (keyup.enter)="hideRename(TreeItems,$event)" (focusout)="hideRename(TreeItems,$event)">
                                </div>
                                <span class="num-bottom"></span>
                                <span class="num-pad">{{TreeItems.legoLevel}} -
                                    <span *ngIf="TreeItems.children;">{{TreeItems.children.length}}</span>
                                </span>
                            </div>
                            <span (click)="addBlink($event)" class="drag_hover" [contextMenu]="CommonModuleRightMenu" [contextMenuSubject]="TreeItems"></span>
                        </div> -->
                        <div attr.data-sectionvalue="{{ setSectionValue(TreeItems,false) }}" *ngIf="TreeItems.children && !(TreeItems.legoLevel >= (currentLegoLevel + 2 ))"
                            class="item-child" [sortablejs]="TreeItems.children" [sortablejsOptions]="dragoptions">
                            <li attr.data-sectionvalue="{{ setSectionValue(listChild,true) }}" class="module_level" [ngClass]="(TreeItems.legoLevel == currentLegoLevel )?'ul_level_one': 
                            (TreeItems.legoLevel == (currentLegoLevel + 1 ) )?'ul_level_two':
                            (TreeItems.legoLevel == (currentLegoLevel + 2 ) )?'ul_level_three' :
                            (TreeItems.legoLevel > (currentLegoLevel + 2 ) )?'ul_level_four' :ul_level_n" *ngFor="let listChild of TreeItems.children;let in = index;"
                            >
                                <!-- {{incTreenode(TreeItems,LocalInc)}} -->
                                <ng-container *ngTemplateOutlet="recursiveList; context:{ $implicit: listChild,parentModule:TreeItems }"></ng-container>
                        </li>
                        </div>
                    </li>
                </ng-template>
                <div id="ModuleItems_tree" class="ModuleItems" *ngIf="tree_st_view == false ">
                    <!-- <ng-template *ngIf="ModuleTreeItems != undefined && ModuleTreeItems != null"> -->
                    <!-- {{ testmoduleItem(ModuleTreeItems)}} -->
                    <!-- <ng-container *ngTemplateOutlet="recursiveList; context:{ $implicit: ModuleTreeItems,parentModule : null }"></ng-container> -->
                    <!-- </ng-template> -->
                    <p-tree #treeComponent [value]="[ModuleTreeItems]" draggableNodes="true" droppableNodes="true"
                     dragdropScope="modules" (onNodeDrop)="TreedragModuleProcess($event)">
                    </p-tree>
                </div>
                <div *ngIf="tree_st_view == true ">
                    <p-tree #treeComponent [value]="[ModuleTreeItems]" draggableNodes="true" droppableNodes="true"
                     dragdropScope="modules" (onNodeDrop)="TreedragModuleProcess($event)">
                    </p-tree>
                </div>
            </div>
        </div>
    </p-scrollPanel>
    <div style="position:fixed;top:35px;height:100%;width:100%;display:table; border-collapse: collapse;border:none;outline:none; pointer-events: none">
        <div style="display: table-cell;width:200px;vertical-align: top">
            <div style="position:absolute; top: 20px;">
                <div style="position:fixed;top:200px;left:-200px">
                    <context-menu #mainmoduleRightMenu [disabled]="disableBasicMenu" style="pointer-events:all">
                        <ng-template *ngFor="let action of mainmoduleRightMenuActions" contextMenuItem let-item [visible]="action.visible" [enabled]="action.enabled"
                            [divider]="action.divider" (execute)="action.click($event)">
                            <div [innerHTML]="action.html(item)"></div>
                        </ng-template>
                    </context-menu>
                    <context-menu #refmoduleRightMenu [disabled]="disableBasicMenu" style="pointer-events:all">
                        <ng-template contextMenuItem (execute)="showMessage('Hi, ' + $event.item.label)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-scissors"></i>
                                </span>
                                <span class="context-title">Cut</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem divider="true"></ng-template>
                        <ng-template contextMenuItem (execute)="showMessage('Hi, ' + $event.item.label)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-clipboard"></i>
                                </span>
                                <span class="context-title">Copy</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem (execute)="showMessage('Hi, ' + $event.item.label)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span class="context-title">Delete</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem (execute)="showMessage('Hi, ' + $event.item.label)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span class="context-title">Go to Original Module</span>
                            </div>
                        </ng-template>

                    </context-menu>
                    <context-menu #submoduleRightMenu (open)="processContextMenuCloseEvent($event,submoduleRightMenu)" [disabled]="disableBasicMenu"
                        style="pointer-events:all">
                        <ng-template contextMenuItem (execute)="submoduleContextMenuEvent('open' ,$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span class="context-title">Open</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem (execute)="submoduleContextMenuEvent('delete' ,$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span class="context-title">Delete</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem (execute)="submoduleContextMenuEvent('rename' ,$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-trash"></i>
                                </span>
                                <span class="context-title">Rename</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem (execute)="submoduleContextMenuEvent('cut' ,$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-scissors"></i>
                                </span>
                                <span class="context-title">Cut</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem divider="true"></ng-template>
                        <ng-template contextMenuItem (execute)="submoduleContextMenuEvent('copy' ,$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-clipboard"></i>
                                </span>
                                <span class="context-title">Copy</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem>
                            <div class="context-items">

                                <span class="context-title">Modue Id - 00143</span>
                            </div>
                        </ng-template>


                    </context-menu>
                    <context-menu #CommonModuleRightMenu [disabled]="disableBasicMenu" style="pointer-events:all">
                        <ng-template *ngFor="let action of CommonModuleRightMenuActions" contextMenuItem let-item [visible]="action.visible" [enabled]="action.enabled"
                            [divider]="action.divider" (execute)="action.click($event)">
                            <div [innerHTML]="action.html(item)"></div>
                        </ng-template>
                        <!-- <ng-template contextMenuItem (execute)="CommonModuleRightEvent('add',$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-plus"></i>
                                </span>
                                <span class="context-title">Add New Module1</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem divider="true"></ng-template>
                        <ng-template contextMenuItem (execute)="CommonModuleRightEvent('past',$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-clipboard"></i>
                                </span>
                                <span class="context-title">Paste</span>
                            </div>
                        </ng-template>
                        <ng-template contextMenuItem (execute)="CommonModuleRightEvent('pastref',$event)">
                            <div class="context-items">
                                <span class="context-icon">
                                    <i class="fa fa-clipboard"></i>
                                </span>
                                <span class="context-title">Paste Reference</span>
                            </div>
                        </ng-template> -->

                    </context-menu>
                </div>
            </div>
        </div>
    </div>
    <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle" width="425"></p-confirmDialog>
</div>
