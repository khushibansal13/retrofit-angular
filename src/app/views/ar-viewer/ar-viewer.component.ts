import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';

import { ArSessionService } from '../../services/ar-session.service';
import { Product, ALL_PRODUCTS } from '../../data/products';

@Component({
  selector: 'app-ar-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ar-viewer.component.html',
  styleUrl: './ar-viewer.component.css',
})
export class ArViewerComponent implements OnDestroy {
  private readonly arSession = inject(ArSessionService);

  @ViewChild('stage', { static: true })
  stage!: ElementRef<HTMLDivElement>;

  doorImageUrl: string | null = null;

  selectedProduct: Product | null = null;
  readonly ALL_PRODUCTS = ALL_PRODUCTS;

  placement = {
    x: 50,
    y: 50,
    scale: 1,
    rotation: 0,
  };

  isDragging = false;
  isSaving = false;
  savedMessage = '';

  private dragStart = {
    x: 0,
    y: 0,
    placementX: 50,
    placementY: 50,
  };

  ngOnInit(): void {
    this.doorImageUrl = this.arSession.getDoorImageUrl();

    this.loadSelectedProduct();
  }

  ngOnDestroy(): void {
    // The session service owns the object URL.
  }

  private loadSelectedProduct(): void {
    const selectedProductId = this.getSelectedProductId();

    if (!selectedProductId) {
      this.selectedProduct = ALL_PRODUCTS[0] ?? null;
      return;
    }

    this.selectedProduct =
      ALL_PRODUCTS.find(product => product.id === selectedProductId) ??
      ALL_PRODUCTS[0] ??
      null;
  }

  private getSelectedProductId(): string | null {
    /*
     * The current DoorConfig stores only the product ID.
     *
     * The AR page is intentionally independent from the Wizard state,
     * so we use the saved browser session value when available.
     */
    try {
      return sessionStorage.getItem('retrofit-selected-product');
    } catch {
      return null;
    }
  }

  get placementLeft(): string {
    return `${this.placement.x}%`;
  }

  get placementTop(): string {
    return `${this.placement.y}%`;
  }

  get placementTransform(): string {
    return [
      'translate(-50%, -50%)',
      `scale(${this.placement.scale})`,
      `rotate(${this.placement.rotation}deg)`,
    ].join(' ');
  }

  get productImage(): string {
    return this.selectedProduct?.imageUrl ?? '';
  }

  get productName(): string {
    return this.selectedProduct?.name ?? 'SALTO lock';
  }

  get productFinish(): string {
    return this.selectedProduct?.finishes?.[0] ?? 'Standard finish';
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;

    try {
      sessionStorage.setItem(
        'retrofit-selected-product',
        product.id,
      );
    } catch {
      // Session storage is optional.
    }

    this.resetPlacement();
  }

  startDrag(event: PointerEvent): void {
    event.preventDefault();

    this.isDragging = true;

    this.dragStart = {
      x: event.clientX,
      y: event.clientY,
      placementX: this.placement.x,
      placementY: this.placement.y,
    };

    const target = event.currentTarget as HTMLElement;

    target.setPointerCapture?.(event.pointerId);
  }

  onDrag(event: PointerEvent): void {
    if (!this.isDragging) {
      return;
    }

    const stage = this.stage.nativeElement;

    const rect = stage.getBoundingClientRect();

    const deltaX =
      ((event.clientX - this.dragStart.x) / rect.width) * 100;

    const deltaY =
      ((event.clientY - this.dragStart.y) / rect.height) * 100;

    this.placement.x = this.clamp(
      this.dragStart.placementX + deltaX,
      5,
      95,
    );

    this.placement.y = this.clamp(
      this.dragStart.placementY + deltaY,
      5,
      95,
    );
  }

  stopDrag(): void {
    this.isDragging = false;
  }

  zoomIn(): void {
    this.placement.scale = this.clamp(
      this.placement.scale + 0.1,
      0.4,
      2.5,
    );
  }

  zoomOut(): void {
    this.placement.scale = this.clamp(
      this.placement.scale - 0.1,
      0.4,
      2.5,
    );
  }

  rotateLeft(): void {
    this.placement.rotation -= 5;
  }

  rotateRight(): void {
    this.placement.rotation += 5;
  }

  resetPlacement(): void {
    this.placement = {
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
  }

  async saveView(): Promise<void> {
    /*
     * We deliberately don't pretend to create a screenshot here.
     * The AR stage can contain external product images, which may
     * prevent canvas export because of browser CORS restrictions.
     *
     * For now this saves the current placement state in the session.
     */
    this.isSaving = true;
    this.savedMessage = '';

    try {
      sessionStorage.setItem(
        'retrofit-ar-placement',
        JSON.stringify(this.placement),
      );

      await new Promise(resolve => setTimeout(resolve, 300));

      this.savedMessage = 'AR placement saved for this session.';
    } finally {
      this.isSaving = false;
    }
  }

  hasDoorImage(): boolean {
    return !!this.doorImageUrl;
  }

  private clamp(
    value: number,
    min: number,
    max: number,
  ): number {
    return Math.min(Math.max(value, min), max);
  }

  @HostListener('window:pointerup')
  onWindowPointerUp(): void {
    this.stopDrag();
  }
}
