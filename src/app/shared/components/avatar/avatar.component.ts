import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
@Input() label:any;
@Input() icon:any;
@Input() image:any;
@Input() size:any;
@Input() shape:any;
@Input() style:any;
@Input() styleClass:any;
  constructor() { }

  ngOnInit(): void {
  }

}
