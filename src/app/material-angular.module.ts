import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule, ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule, ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
})
export class MyMaterialClass { }
