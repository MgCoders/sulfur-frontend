import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent {

  constructor(public dialogRef: MatDialogRef<DialogInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string[]) { }

  Close() {
    this.dialogRef.close();
  }
}
