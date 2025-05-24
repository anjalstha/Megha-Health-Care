import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage {

  @ViewChild(IonContent, { static: false })
  content!: IonContent;
  isArrowHidden = false;
  scrollTop!: number;


  contactForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      // Handle form submission, e.g., send data to backend
    }
}

ionViewDidEnter(){
  this.getScrollPosition();
  if (this.content) {
    this.content.ionScroll.subscribe((event) => {
      console.log('Scroll Event:', event);
      console.log('Scroll Top:', event.detail.scrollTop);
    });
  } else {
    console.error('IonContent not found.');
  }
}

async scroll(content: IonContent) {
  const scrollElement = await content.getScrollElement();
  const viewportHeight = scrollElement.clientHeight;
  content.scrollByPoint(0, viewportHeight, 1000);
  console.log(`Scroll by ${viewportHeight} pixels`);
  this.getScrollPosition();
}

getScrollPosition() {
  if (this.content) {
    this.content.getScrollElement().then((scrollElement) => {
      this.scrollTop = scrollElement.scrollTop;
      if(this.scrollTop !== 0){
        this.isArrowHidden = true
      }
      else{
        this.isArrowHidden = false
      }
      console.log('Scroll top:', scrollElement.scrollTop);
    }).catch(error => {
      console.error('Error getting scroll element:', error);
    });
  }
}

handleScroll(event: CustomEvent) {
  console.log('Scroll Event:', event);
  console.log('Scroll Top:', event.detail.scrollTop);
}
}
