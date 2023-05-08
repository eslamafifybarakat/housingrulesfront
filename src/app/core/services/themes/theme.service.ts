import { keys } from './../../../shared/configs/localstorage-key';
import { Injectable } from '@angular/core';
import { Theme, light, dark } from './theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() { }
  private active: Theme = light;
  private availableThemes: Theme[] = [light, dark];

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  setLightTheme(): void {
    this.setActiveTheme(light);
    localStorage.setItem(keys?.theme, 'light');
  }
  setDarkTheme(): void {
    this.setActiveTheme(dark);
    localStorage.setItem(keys?.theme, 'dark');
  }

  setColorTheme(color: any): void {
    Object.keys(this.active.properties).forEach((property) => {
      if (property == '--text-main-color' || property == '--bg-main-color') {
        this.active.properties[property] = color;
      }
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
    localStorage.setItem(keys?.theme, 'light');
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;
    Object.keys(this.active.properties).forEach((property) => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}
