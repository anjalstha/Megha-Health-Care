import { CommonService } from './../services/common.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  stickytoolbar = true;
  collapse = false;
  showDropdown = false;
  iconsVisible = false;
  private subscriptions: Subscription[] = [];

  constructor(public commonService: CommonService, private router: Router) {}

  currentSlide = 0;
  slides = [
    'assets/images/1.jpeg',
    'assets/images/2.jpeg',
    'assets/images/3.jpeg',
    'assets/images/4.jpeg',
  ];

  get slidesPerView() {
    if (window.innerWidth >= 769) return 3;
    if (window.innerWidth >= 577) return 2;
    return 1;
  }

  get totalSlides() {
    return this.slides.length;
  }

  ngOnInit() {
    // Subscribe to collapse$ and dropdown$ from the service
    this.subscriptions.push(
      this.commonService.collapse$.subscribe((isCollapsed) => {
        this.collapse = isCollapsed;
        if (!isCollapsed) {
          this.commonService.closeDropdown(); // Close dropdown on larger screens
        }
      }),

      this.commonService.dropdown$.subscribe((isDropdownVisible) => {
        this.showDropdown = isDropdownVisible;
      }),

      this.commonService.iconsVisible$.subscribe((isVisible) => {
        this.iconsVisible = isVisible;
      }),

      // Subscribe to route changes to close the dropdown
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.commonService.closeDropdown();
        }
      })
    );
  }

  toggleDropdown() {
    this.commonService.toggleDropdown();
  }

  ngAfterViewInit() {
    this.content.getScrollElement().then((scrollElement) => {
      scrollElement.addEventListener('scroll', this.onScroll);
    });
  }

  onScroll = (event: any) => {
    const scrollPosition = event.target.scrollTop;
    console.log('Scroll position during scroll:', scrollPosition);
    if (scrollPosition > 50) {
      this.stickytoolbar = false;
    } else {
      this.stickytoolbar = true;
    }
  };

  scrollToTop() {
    this.content.scrollToTop(500);
  }

  nextSlide() {
    if (this.currentSlide + this.slidesPerView < this.totalSlides) {
      this.currentSlide += this.slidesPerView;
    }
  }

  prevSlide() {
    if (this.currentSlide >= this.slidesPerView) {
      this.currentSlide -= this.slidesPerView;
    }
  }

  get visibleSlides() {
    return this.slides.slice(
      this.currentSlide,
      this.currentSlide + this.slidesPerView
    );
  }

  @HostListener('window:resize')
  onResize() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
