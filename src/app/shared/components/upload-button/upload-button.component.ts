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

  ngOnInit(): void {
    // let upload = document.getElementById('upload');
    // let uploadbtn = document.querySelector('.p-fileupload-choose');
    // console.log(uploadbtn);
    // console.log(upload);

  }

  onUpload(event: any): void {
    console.log(event.files);
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    console.log(this.uploadedFiles);
  }

  removeItem(event: any): void {
    console.log(event.file);
  }

  onError(): void {
    console.log(this.uploadedFiles);
  }
  // selectFilesToUpload() {
  //   this.listFileUpload = [];
  //   for (var i = 0; i < this.fileInput.files.length; i++) {
  //     this.listFileUpload.push(this.fileInput.files[i]);
  //   }
  // }
}
