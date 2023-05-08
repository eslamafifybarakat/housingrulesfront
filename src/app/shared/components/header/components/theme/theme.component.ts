import { keys } from './../../../../configs/localstorage-key';
import { ThemeService } from './../../../../../core/services/themes/theme.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  currentTheme = window?.localStorage?.getItem(keys?.theme);
  theme: any = "true";

  constructor(
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.theme = window?.localStorage?.getItem(keys?.theme);

  }

  light(): void {
    this.themeService?.setLightTheme();
    this.currentTheme = window?.localStorage?.getItem(keys?.theme);
  }
  dark(): void {
    this.themeService?.setDarkTheme();
    this.currentTheme = window?.localStorage?.getItem(keys?.theme);
  }
  color(color: string): void {
    this.themeService?.setColorTheme(color);
    this.currentTheme = window?.localStorage?.getItem(keys?.theme);
  }
}

