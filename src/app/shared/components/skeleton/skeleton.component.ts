import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
  @Input() type: string = '';
  @Input() items: any;
  @Input() tableItems: any;
  skeletonItems: any = [5, 8, 9, 7, 9, 7];
  constructor() { }

  ngOnInit(): void {
  }

}
