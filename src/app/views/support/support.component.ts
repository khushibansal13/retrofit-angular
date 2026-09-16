import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { DoorConfig } from '../../app';
import { ALL_PRODUCTS } from '../../data/products';

interface FAQ {
  q: string;
  a: string;
}

interface ContactOption {
  icon: string;
  label: string;
  sub: string;
  color: string;
  bg: string;
  action: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  @Input() config!: DoorConfig;

  selectedTopic = '';
  message = '';
  submitted = false;

  readonly ticketReference = Math.floor(Math.random() * 90000) + 10000;

  readonly topics = [
    'Installation help',
    'Lock not pairing',
    'App connectivity',
    'Battery issue',
    'Warranty claim',
    'Book an engineer',
    'Other'
  ];

  readonly faqs: FAQ[] = [
    {
      q: "My lock won't pair with the app",
      a: 'Ensure Bluetooth is enabled on your phone and you are within 2 metres of the lock. Hold the pair button for 5 seconds until the LED pulses blue. If it still fails, perform a factory reset by holding the button for 15 seconds, then retry pairing.'
    },
    {
      q: 'The lock responds slowly or misses commands',
      a: 'This usually indicates a low battery (below 15%) or weak Bluetooth signal. Replace batteries first — if the issue persists, check for Bluetooth interference from other devices and try moving your router away from the door.'
    },
    {
      q: 'How do I add or remove user access?',
      a: "Open the Access Platform app → Devices → select your lock → Users. Tap '+ Add user', enter their email or phone number, and select an access schedule. To remove access, swipe left on the user and tap Remove."
    },
    {
      q: 'Can I get a professional installer?',
      a: 'Yes — we have a network of certified installers across the UK. Book directly through the app or call our support line. Installations are typically scheduled within 2 business days.'
    },
    {
      q: 'What is covered under warranty?',
      a: "All Access Platform hardware carries a 2-year manufacturer's warranty covering defects in materials and workmanship. Physical damage, battery wear, and improper installation are excluded. Register your product in the app to activate the warranty."
    },
    {
      q: 'How do I update the lock firmware?',
      a: "Open the app → Devices → your lock → Settings → Firmware. If an update is available you'll see a banner. Tap Update and keep the app open and your phone within 1 metre until the update completes (approx. 3 minutes)."
    }
  ];

  readonly contactOptions: ContactOption[] = [
    {
      icon: 'chat',
      label: 'Live Chat',
      sub: 'Avg. response < 2 min',
      color: '#1565C0',
      bg: '#E3F2FD',
      action: 'Start chat'
    },
    {
      icon: 'phone',
      label: 'Call Us',
      sub: 'Mon–Fri 8am–6pm',
      color: '#2E7D32',
      bg: '#E8F5E9',
      action: '0800 123 4567'
    },
    {
      icon: 'email',
      label: 'Email',
      sub: 'Reply within 4 hours',
      color: '#E65100',
      bg: '#FFF3E0',
      action: 'Send email'
    },
    {
      icon: 'calendar_month',
      label: 'Book Engineer',
      sub: 'On-site within 2 days',
      color: '#6A1B9A',
      bg: '#F3E5F5',
      action: 'Book now'
    }
  ];

  readonly warrantyItems = [
    ['Hardware warranty', '2 years from purchase'],
    ['Return window', '30 days, unopened'],
    ['Defective product', 'Free replacement within warranty'],
    ['Register product', 'Required to activate warranty']
  ];

  constructor(private readonly snackBar: MatSnackBar) {}

  get productName(): string {
    if (!this.config?.product) {
      return '';
    }

    return ALL_PRODUCTS.find(product => product.id === this.config.product)?.name
      ?? this.config.product;
  }

  sendMessage(): void {
    if (!this.message.trim()) {
      return;
    }

    this.submitted = true;

    this.snackBar.open(
      "Message received — we'll reply within 4 hours.",
      'Close',
      {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );
  }

  sendAnother(): void {
    this.submitted = false;
    this.message = '';
    this.selectedTopic = '';
  }
}
