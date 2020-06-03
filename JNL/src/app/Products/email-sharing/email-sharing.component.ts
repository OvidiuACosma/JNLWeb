import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IProductShareByEmail } from 'src/app/_models';
import { ValidatorEmailListOfMax3 } from 'src/app/_validators';
import { ProductsService } from 'src/app/_services';
import { CommonDialogComponent } from 'src/app/Main/common-dialog/common-dialog.component';

@Component({
  selector: 'app-email-sharing',
  templateUrl: './email-sharing.component.html',
  styleUrls: ['./email-sharing.component.scss']
})
export class EmailSharingComponent implements OnInit {

  productShareByMail: IProductShareByEmail;
  productForm: FormGroup;
  submitted = false;

  constructor(public dialogRef: MatDialogRef<EmailSharingComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private productsService: ProductsService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.productShareByMail = this.data.product;
    this.resetForm();
  }

  createForm() {
    this.productForm = this.fb.group({
      product: '',
      imageUrl: '',
      senderName: new FormControl('', [Validators.required]),
      senderEmail: new FormControl('', [Validators.email, Validators.required]),
      recipientEmails: new FormControl('', [Validators.required, ValidatorEmailListOfMax3()]),
      message: ''
    });
  }

  resetForm() {
    this.productForm.reset({
      product: this.productShareByMail.product,
      imageUrl: this.productShareByMail.imageUrl
    });
    this.submitted = false;
  }

  get f() { return this.productForm.controls; }

  sendEmail(product: IProductShareByEmail) {
    this.productsService.shareProductByEmail(product)
    .subscribe(resp => {
      this.dialogRef.close('Email sent!');
      this.openDialog('Email sent', 'Your email haev been sent succesfully!\nThank you!');
    });
  }

  openDialog(answerTitle: string, answerText: string): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '375px',
      data: {
        title: answerTitle,
        text: answerText,
        buttons: [0]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      return;
    });
  }

  getEmailsArrayFromCsvList(emailsList: string): string[] {
    const emailsListArray = emailsList.split(',')
    .map(m => m.trim());
    return emailsListArray;
  }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.invalid) { return; }
    const formData = this.productForm.value;
    this.productShareByMail.senderName = formData.senderName;
    this.productShareByMail.senderEmail = formData.senderEmail;
    this.productShareByMail.message = formData.message;
    this.productShareByMail.recipientEmails = this.getEmailsArrayFromCsvList(formData.recipientEmails);
    this.sendEmail(this.productShareByMail);
  }

  close() {
    this.submitted = false;
    this.dialogRef.close('cancel');
  }
}
