import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DoorConfig } from '../../app';
import { ALL_PRODUCTS, COMMON_BOM, Product } from '../../data/products';

@Component({
  selector: 'app-bom-quote',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './bom-quote.component.html',
  styleUrls: ['./bom-quote.component.css'],
})
export class BomQuoteComponent {
  @Input({ required: true }) config!: DoorConfig;
  @Output() configChange = new EventEmitter<DoorConfig>();

  submitted = false;

  get product(): Product | null {
    return ALL_PRODUCTS.find(p => p.id === this.config.product) ?? null;
  }

  get accessories(): string[] {
    return this.product?.bomAccessories ?? [];
  }

  get quantity(): number {
    const value = Number(this.config.quantity);
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  setQuantity(value: string | number): void {
    const quantity = Math.max(1, Number(value) || 1);

    this.configChange.emit({
      ...this.config,
      quantity: String(quantity),
    });
  }

  get commonBom(): string[] {
    return COMMON_BOM[this.config.material as 'Wood' | 'Glass'] ?? [];
  }

  get totalItems(): number {
    return (
      this.commonBom.length +
      this.accessories.length
    ) * this.quantity;
  }

  submitQuote(): void {
    this.submitted = true;

    this.configChange.emit({
      ...this.config,
      orderStatus: 'submitted',
    });
  }

  resetSubmission(): void {
    this.submitted = false;
  }
}
