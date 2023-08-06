import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent {
  intervalId: any;
  originalText: any;
  letters: any;
  darkMode = false;

  constructor(public router: Router) {
    this.darkMode =
      document.documentElement.getAttribute('data-theme') == 'dark';
  }

  getRandomCharacter() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  }

  shuffleText(event) {
    const textElement = event.currentTarget;
    this.originalText = event.currentTarget.textContent;
    this.letters = this.originalText.split('');

    let counter = 0;
    const shuffleCount = 2;
    const shuffleInterval = 100;

    this.intervalId = setInterval(() => {
      textElement.textContent = this.letters
        .map((char, i) => {
          if (char.match(/[a-zA-Z0-9]/)) {
            const randomCharacter = this.getRandomCharacter();
            const cyclesToRevert = i - Math.floor(counter / shuffleCount);
            if (counter >= cyclesToRevert * shuffleCount) {
              return this.originalText[i];
            }
            return randomCharacter;
          }
          return char;
        })
        .join('');

      counter++;
      if (counter >= (shuffleCount + 1) * this.letters.length) {
        clearInterval(this.intervalId);
        textElement.textContent = this.originalText;
      }
    }, shuffleInterval);
  }

  stopShuffleText(event) {
    clearInterval(this.intervalId);
    event.currentTarget.textContent = this.originalText;
  }

  setTheme() {
    this.darkMode = !this.darkMode;
    document.documentElement.setAttribute(
      'data-theme',
      this.darkMode ? 'dark' : 'light'
    );
    document.documentElement.style.colorScheme = this.darkMode
      ? 'dark'
      : 'light';
  }
}
