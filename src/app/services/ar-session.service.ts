import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArSessionService {
  private doorImageUrl: string | null = null;

  setDoorImage(file: File): void {
    this.clearDoorImage();

    this.doorImageUrl = URL.createObjectURL(file);
  }

  getDoorImageUrl(): string | null {
    return this.doorImageUrl;
  }

  clearDoorImage(): void {
    if (this.doorImageUrl) {
      URL.revokeObjectURL(this.doorImageUrl);
      this.doorImageUrl = null;
    }
  }
}
