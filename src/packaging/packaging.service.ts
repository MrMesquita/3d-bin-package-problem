import { Injectable } from '@nestjs/common';
import { BoxDto } from './dto/box.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PackedBoxDto, PackedOrderDto } from './dto/packed-order.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class PackagingService {
  private readonly availableBoxes: BoxDto[] = [
    { name: 'Caixa 1', height: 30, width: 40, length: 80 },
    { name: 'Caixa 2', height: 50, width: 50, length: 40 },
    { name: 'Caixa 3', height: 50, width: 80, length: 60 },
  ];

  private calculateVolume(
    height: number,
    width: number,
    length: number,
  ): number {
    return height * width * length;
  }

  private sortDecrasingByVolume(
    a: CreateProductDto,
    b: CreateProductDto,
  ): number {
    const volumeA = this.calculateVolume(
      a.dimensions.height,
      a.dimensions.width,
      a.dimensions.length,
    );
    const volumeB = this.calculateVolume(
      b.dimensions.height,
      b.dimensions.width,
      b.dimensions.length,
    );
    return volumeB - volumeA;
  }

  private productCanFitInBox(product: CreateProductDto, box: BoxDto): boolean {
    const productDimensions = [
      product.dimensions.height,
      product.dimensions.width,
      product.dimensions.length,
    ].sort((a, b) => a - b);

    const boxDimensions = [box.height, box.width, box.length].sort(
      (a, b) => a - b,
    );

    return (
      productDimensions[0] <= boxDimensions[0] &&
      productDimensions[1] <= boxDimensions[1] &&
      productDimensions[2] <= boxDimensions[2]
    );
  }

  private createNewBoxForProduct(
    product: CreateProductDto,
  ): PackedBoxDto | null {
    for (const box of this.availableBoxes) {
      if (this.productCanFitInBox(product, box)) {
        return {
          name: box.name,
          dimensions: {
            height: box.height,
            width: box.width,
            length: box.length,
          },
          products: [product],
        };
      }
    }
    return null;
  }

  private canAddProductToUsedBox(
    product: CreateProductDto,
    usedBox: PackedBoxDto,
  ): boolean {
    const boxVolume = this.calculateVolume(
      usedBox.dimensions.height,
      usedBox.dimensions.width,
      usedBox.dimensions.length,
    );

    const productVolume = this.calculateVolume(
      product.dimensions.height,
      product.dimensions.width,
      product.dimensions.length,
    );

    const usedVolume = usedBox.products.reduce((total, prod) => {
      return (
        total +
        this.calculateVolume(
          prod.dimensions.height,
          prod.dimensions.width,
          prod.dimensions.length,
        )
      );
    }, 0);

    return usedVolume + productVolume <= boxVolume;
  }

  public packOrders(order: CreateOrderDto): PackedOrderDto {
    const sortedProducts = [...order.products].sort((a, b) =>
      this.sortDecrasingByVolume(a, b),
    );

    const usedBoxes: PackedBoxDto[] = [];

    for (const product of sortedProducts) {
      let productPlaced = false;

      for (const usedBox of usedBoxes) {
        if (this.canAddProductToUsedBox(product, usedBox)) {
          usedBox.products.push(product);
          productPlaced = true;
          break;
        }
      }

      if (!productPlaced) {
        const newBox = this.createNewBoxForProduct(product);
        if (newBox) {
          usedBoxes.push(newBox);
        }
      }
    }

    return {
      orderId: order.orderId,
      boxes: usedBoxes,
    };
  }
}
