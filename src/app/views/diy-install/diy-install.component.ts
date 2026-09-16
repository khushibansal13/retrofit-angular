import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DoorConfig } from '../../app';
import { ALL_PRODUCTS, Product } from '../../data/products';

interface InstallStep {
  title: string;
  description: string;
  icon: string;
  warning?: string;
}

@Component({
  selector: 'app-diy-install',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './diy-install.component.html',
  styleUrls: ['./diy-install.component.css'],
})
export class DiyInstallComponent {
  @Input({ required: true }) config!: DoorConfig;

  currentStep = 0;

  get product(): Product | null {
    return ALL_PRODUCTS.find(
      product => product.id === this.config.product,
    ) ?? null;
  }

  get productName(): string {
    return this.product?.name ?? 'SALTO XS4 One';
  }

  get steps(): InstallStep[] {
    return [
      {
        title: 'Prepare the door',
        description:
          'Remove the existing lock and make sure the door edge and mounting area are clean and accessible.',
        icon: 'construction',
      },
      {
        title: 'Check the dimensions',
        description:
          `Confirm the door is ${this.config.width} × ${this.config.height}mm with a thickness of ${this.config.thickness}mm before installing the lock.`,
        icon: 'straighten',
        warning:
          'Do not continue if the measured dimensions differ from your approved configuration.',
      },
      {
        title: 'Install the lock body',
        description:
          'Position the lock body in the prepared opening. Keep the mechanism aligned and make sure it moves freely before tightening the screws.',
        icon: 'lock',
      },
      {
        title: 'Install the handle and reader',
        description:
          `Install the ${this.productName} exterior components according to the supplied mounting instructions.`,
        icon: 'settings',
      },
      {
        title: 'Connect and test',
        description:
          'Check the handle movement, latch operation and electronic reader. Test the door several times before putting it into service.',
        icon: 'check_circle',
      },
    ];
  }

  get currentInstallStep(): InstallStep {
    return this.steps[this.currentStep];
  }

  get isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  next(): void {
    if (!this.isLastStep) {
      this.currentStep++;
    }
  }

  previous(): void {
    if (!this.isFirstStep) {
      this.currentStep--;
    }
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep = index;
    }
  }

  restart(): void {
    this.currentStep = 0;
  }
}
