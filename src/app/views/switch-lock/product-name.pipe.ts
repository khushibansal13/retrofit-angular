import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../data/products';

@Pipe({
  name: 'productName',
  standalone: true
})
export class ProductNamePipe implements PipeTransform {
  transform(products: Product[], currentProduct: Product | null): string {
    if (!currentProduct) {
      return `${products.length} options`;
    }

    const count = products.length;
    const currentName = currentProduct.name;

    if (count === 1) {
      return currentName;
    }

    return `${currentName} · ${count - 1} more`;
  }
}
