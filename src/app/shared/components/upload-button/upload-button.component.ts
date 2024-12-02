import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
  @Input() multiple: boolean = false;
  @Input() uploadText: string = 'upload File';
  @Input() maxFileSize: any = 1000000;
  uploadedFiles: any[] = [];

  constructor() { }

  ngOnInit(): void {}

  onUpload(event: any): void {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  removeItem(event: any): void {
  }

  onError(): void {
  }
  // selectFilesToUpload() {
  //   this.listFileUpload = [];
  //   for (var i = 0; i < this.fileInput.files.length; i++) {
  //     this.listFileUpload.push(this.fileInput.files[i]);
  //   }
  // }
}
