import { MMatLegacyButtonModule as MatButtonModule} from '@@angular/material/legacy-button;
import { MatIconModule } from '@angular/material/icon';
import { MMatLegacyInputModule as MatInputModule} from '@@angular/material/legacy-input;
import { MMatLegacyListModule as MatListModule} from '@@angular/material/legacy-list;
import { MMatLegacySelectModule as MatSelectModule} from '@@angular/material/legacy-select;
import { MMatLegacySlideToggleModule as MatSlideToggleModule} from '@@angular/material/legacy-slide-toggle;
import { MMatLegacySnackBarModule as MatSnackBarModule} from '@@angular/material/legacy-snack-bar;
import { MatToolbarModule } from '@angular/material/toolbar';
import { MMatLegacyCardModule as MatCardModule} from '@@angular/material/legacy-card;
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MMatLegacyAutocompleteModule as MatAutocompleteModule} from '@@angular/material/legacy-autocomplete;
import { MMatLegacyChipsModule as MatChipsModule} from '@@angular/material/legacy-chips;
import { MMatLegacyCheckboxModule as MatCheckboxModule} from '@@angular/material/legacy-checkbox;
import { MMatLegacyMenuModule as MatMenuModule} from '@@angular/material/legacy-menu;
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
iimport { MatRippleModule } from '@angular/material/core';import { MMatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@@angular/material/legacy-progress-spinner;
import { MMatLegacyDialogModule as MatDialogModule} from '@@angular/material/legacy-dialog;

import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
iimport { MatNativeDateModule } from '@angular/material/core';
import { XunkCalendarModule } from 'xunk-calendar';

@NgModule({
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatCheckboxModule,
        MatRippleModule,
        MatMenuModule,
        MatBottomSheetModule,
        MatExpansionModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        XunkCalendarModule,
    ],
    exports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatCheckboxModule,
        MatRippleModule,
        MatMenuModule,
        MatBottomSheetModule,
        MatExpansionModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        XunkCalendarModule,
    ],
})
export class MyMaterialClass { }
