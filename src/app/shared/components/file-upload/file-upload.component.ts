import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onFileChange(pFileList: any) {
    // this.files = Object.keys(pFileList).map((key: any) => pFileList[key]);
    console.log(pFileList)
  }

}
