import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-item-details-dialog',
  standalone: false,
  templateUrl: './item-details-dialog.component.html',
  styleUrl: './item-details-dialog.component.scss'
})
export class ItemDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
