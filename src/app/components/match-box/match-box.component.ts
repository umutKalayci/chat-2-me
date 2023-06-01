import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-match-box',
  templateUrl: './match-box.component.html',
  styleUrls: ['./match-box.component.scss'],
})
export class MatchBoxComponent implements OnInit {
  @ViewChild('text1')
  text1!: ElementRef;
  @ViewChild('text2') text2!: ElementRef;

  @Input() texts: any;

  // texts = ['You', 'Match!', 'Click Me!'];

  morphTime = 2;
  cooldownTime = 0.5;

  textIndex: any;
  time = new Date();
  morph = 0;
  cooldown = this.cooldownTime;

  constructor() {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.textIndex = this.texts.length - 1;
    this.text1.nativeElement.textContent =
      this.texts[this.textIndex % this.texts.length];
    this.text2.nativeElement.textContent =
      this.texts[(this.textIndex + 1) % this.texts.length];

    this.animate();
  }

  doMorph() {
    this.morph -= this.cooldown;
    this.cooldown = 0;

    let fraction = this.morph / this.morphTime;

    if (fraction > 1) {
      this.cooldown = this.cooldownTime;
      fraction = 1;
    }

    this.setMorph(fraction);
  }

  setMorph(fraction: any) {
    this.text2.nativeElement.style.filter = `blur(${Math.min(
      8 / fraction - 8,
      100
    )}px)`;
    this.text2.nativeElement.style.opacity = `${
      Math.pow(fraction, 0.4) * 100
    }%`;

    fraction = 1 - fraction;
    this.text1.nativeElement.style.filter = `blur(${Math.min(
      8 / fraction - 8,
      100
    )}px)`;
    this.text1.nativeElement.style.opacity = `${
      Math.pow(fraction, 0.4) * 100
    }%`;

    this.text1.nativeElement.textContent =
      this.texts[this.textIndex % this.texts.length];
    this.text2.nativeElement.textContent =
      this.texts[(this.textIndex + 1) % this.texts.length];
  }

  doCooldown() {
    this.morph = 0;

    this.text2.nativeElement.style.filter = '';
    this.text2.nativeElement.style.opacity = '100%';

    this.text1.nativeElement.style.filter = '';
    this.text1.nativeElement.style.opacity = '0%';
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());

    let newTime = new Date();
    let shouldIncrementIndex = this.cooldown > 0;
    let dt = (newTime.getTime() - this.time.getTime()) / 1000;
    this.time = newTime;

    this.cooldown -= dt;

    if (this.cooldown <= 0) {
      if (shouldIncrementIndex) {
        this.textIndex++;
      }

      this.doMorph();
    } else {
      this.doCooldown();
    }
  }
}
