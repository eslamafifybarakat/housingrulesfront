import { PublicService } from './../../../shared/services/public.service';
import { keys } from './../../../shared/configs/localstorage-key';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-dashboard',
  templateUrl: './welcome-dashboard.component.html',
  styleUrls: ['./welcome-dashboard.component.scss']
})
export class WelcomeDashboardComponent implements OnInit {

  userData: any = JSON.parse(window?.localStorage?.getItem(keys?.userData) || '{}');
  userName: string = '';

  cardsData: any = [
    {
      icon: 'pi-pause',
      number: 66.986,
      type: this.publicService?.translateTextFromJson('welcome.banks'),
      color: 'primary'
    },
    {
      icon: 'pi-users',
      number: 236,
      type: this.publicService?.translateTextFromJson('welcome.users'),
      color: 'danger'
    },
    {
      icon: 'pi-file',
      number: 23.88,
      type: this.publicService?.translateTextFromJson('welcome.articles'),
      color: 'warning'
    },

  ]

  targets: any = [
    {
      title: this.publicService?.translateTextFromJson('welcome.courses'),
      percentage: 75,
      color: 'courses'
    },
    {
      title: this.publicService?.translateTextFromJson('welcome.exams'),
      percentage: 60,
      color: 'exams'
    },
    {
      title: this.publicService?.translateTextFromJson('welcome.articleNotes'),
      percentage: 40,
      color: 'articleNotes'
    },
  ]

  constructor(
    private publicService: PublicService
  ) { }

  ngOnInit(): void {
    this.userName = 'Eslam';
    // this.userName = this.userData?.name;

  }

}

