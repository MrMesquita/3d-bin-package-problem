import { Injectable } from '@nestjs/common';
import { RequestOptimizeOrdersDto } from './dto/create-order.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { AvailableBoxDto } from './dto/avaiable-box.dto';
import { InternalBox } from './interfaces/internal-box.interface';
import { OptimizedBoxDto } from './dto/optmized-box.dto';
import { OptimizedOrderDto } from './dto/optimized-order.dto';

@Injectable()
export class PackagingService {
  private readonly availableBoxes: AvailableBoxDto[] = [
    {
      name: 'Caixa 1',
      dimensions: { height: 30, width: 40, length: 80 },
    },
    {
      name: 'Caixa 2',
      dimensions: { height: 50, width: 50, length: 40 },
    },
    {
      name: 'Caixa 3',
      dimensions: { height: 50, width: 80, length: 60 },
    },
  ];

  public optimizeOrders(orders: RequestOptimizeOrdersDto): OptimizedOrderDto[] {
    const results: OptimizedOrderDto[] = [];

    for (const order of orders.pedidos) {
      const sortedProducts = [...order.produtos].sort((a, b) =>
        this.sortDecreasingByVolume(a, b),
      );

      const usedBoxes: InternalBox[] = [];

      for (const product of sortedProducts) {
        const bestUsedBox = this.findBestUsedBoxForProduct(product, usedBoxes);
        const bestNewBox = this.findBestBoxForProduct(product);

        const usedBoxWaste = this.calculateWasteForUsedBox(
          product,
          bestUsedBox,
        );
        const newBoxWaste = this.calculateWasteForNewBox(product, bestNewBox);

        if (this.shouldUseExistingBox(bestUsedBox, usedBoxWaste, newBoxWaste)) {
          bestUsedBox!.products.push(product);
        } else if (bestNewBox) {
          const newInternalBox = this.createInternalBox(bestNewBox, product);
          usedBoxes.push(newInternalBox);
        } else {
          const errorBox = this.createErrorBox(product);
          usedBoxes.push(errorBox);
        }
      }

      const optimizedBoxes = this.mapToOptimizedBoxes(usedBoxes);
      results.push({
        pedido_id: order.pedido_id.toString(),
        caixas: optimizedBoxes,
      });
    }

    return results;
  }

  private calculateVolume(
    height: number,
    width: number,
    length: number,
  ): number {
    return height * width * length;
  }

  private sortDecreasingByVolume(
    a: CreateProductDto,
    b: CreateProductDto,
  ): number {
    const volumeA = this.calculateVolume(
      a.dimensoes.altura,
      a.dimensoes.largura,
      a.dimensoes.comprimento,
    );
    const volumeB = this.calculateVolume(
      b.dimensoes.altura,
      b.dimensoes.largura,
      b.dimensoes.comprimento,
    );
    return volumeB - volumeA;
  }

  private productCanFitInAvailableBox(
    product: CreateProductDto,
    box: AvailableBoxDto,
  ): boolean {
    const productDimensions = [
      product.dimensoes.altura,
      product.dimensoes.largura,
      product.dimensoes.comprimento,
    ].sort((a, b) => a - b);

    const boxDimensions = [
      box.dimensions.height,
      box.dimensions.width,
      box.dimensions.length,
    ].sort((a, b) => a - b);

    return (
      productDimensions[0] <= boxDimensions[0] &&
      productDimensions[1] <= boxDimensions[1] &&
      productDimensions[2] <= boxDimensions[2]
    );
  }

  private canAddProductToUsedBox(
    product: CreateProductDto,
    usedBox: InternalBox,
  ): boolean {
    if (!usedBox.dimensions) {
      return false;
    }

    const boxVolume = this.calculateVolume(
      usedBox.dimensions.height,
      usedBox.dimensions.width,
      usedBox.dimensions.length,
    );

    const productVolume = this.calculateVolume(
      product.dimensoes.altura,
      product.dimensoes.largura,
      product.dimensoes.comprimento,
    );

    const usedVolume = usedBox.products.reduce((total, prod) => {
      return (
        total +
        this.calculateVolume(
          prod.dimensoes.altura,
          prod.dimensoes.largura,
          prod.dimensoes.comprimento,
        )
      );
    }, 0);

    return (
      this.productCanFitInAvailableBox(product, {
        name: usedBox.name || 'No box',
        dimensions: usedBox.dimensions,
      }) && usedVolume + productVolume <= boxVolume
    );
  }

  private findBestUsedBoxForProduct(
    product: CreateProductDto,
    usedBoxes: InternalBox[],
  ): InternalBox | null {
    const productVolume = this.calculateProductVolume(product);
    let bestUsedBox: InternalBox | null = null;
    let smallestRemainingSpace = Infinity;

    for (const usedBox of usedBoxes) {
      if (this.canAddProductToUsedBox(product, usedBox)) {
        const boxVolume = this.calculateVolume(
          usedBox.dimensions!.height,
          usedBox.dimensions!.width,
          usedBox.dimensions!.length,
        );

        const usedVolume = this.calculateUsedVolume(usedBox.products);
        const remainingSpace = boxVolume - usedVolume - productVolume;

        if (remainingSpace < smallestRemainingSpace) {
          smallestRemainingSpace = remainingSpace;
          bestUsedBox = usedBox;
        }
      }
    }

    return bestUsedBox;
  }

  private findBestBoxForProduct(
    product: CreateProductDto,
  ): AvailableBoxDto | null {
    const productVolume = this.calculateProductVolume(product);
    let bestBox: AvailableBoxDto | null = null;
    let smallestWastedSpace = Infinity;

    for (const box of this.availableBoxes) {
      if (this.productCanFitInAvailableBox(product, box)) {
        const boxVolume = this.calculateVolume(
          box.dimensions.height,
          box.dimensions.width,
          box.dimensions.length,
        );
        const wastedSpace = boxVolume - productVolume;

        if (wastedSpace < smallestWastedSpace) {
          smallestWastedSpace = wastedSpace;
          bestBox = box;
        }
      }
    }

    return bestBox;
  }

  private calculateWasteForUsedBox(
    product: CreateProductDto,
    usedBox: InternalBox | null,
  ): number {
    if (!usedBox?.dimensions) return Infinity;

    const boxVolume = this.calculateVolume(
      usedBox.dimensions.height,
      usedBox.dimensions.width,
      usedBox.dimensions.length,
    );

    const usedVolume = this.calculateUsedVolume(usedBox.products);
    const productVolume = this.calculateProductVolume(product);

    return boxVolume - usedVolume - productVolume;
  }

  private calculateWasteForNewBox(
    product: CreateProductDto,
    newBox: AvailableBoxDto | null,
  ): number {
    if (!newBox) return Infinity;

    const boxVolume = this.calculateVolume(
      newBox.dimensions.height,
      newBox.dimensions.width,
      newBox.dimensions.length,
    );

    const productVolume = this.calculateProductVolume(product);
    return boxVolume - productVolume;
  }

  private shouldUseExistingBox(
    usedBox: InternalBox | null,
    usedBoxWaste: number,
    newBoxWaste: number,
  ): boolean {
    return !!usedBox && usedBoxWaste <= newBoxWaste;
  }

  private createInternalBox(
    availableBox: AvailableBoxDto,
    product: CreateProductDto,
  ): InternalBox {
    return {
      name: availableBox.name,
      dimensions: { ...availableBox.dimensions },
      products: [product],
    };
  }

  private createErrorBox(product: CreateProductDto): InternalBox {
    return {
      name: null,
      products: [product],
      observations: 'Produto não cabe em nenhuma caixa disponível.',
    };
  }

  private calculateUsedVolume(products: CreateProductDto[]): number {
    return products.reduce((total, prod) => {
      return total + this.calculateProductVolume(prod);
    }, 0);
  }

  private calculateProductVolume(product: CreateProductDto): number {
    return this.calculateVolume(
      product.dimensoes.altura,
      product.dimensoes.largura,
      product.dimensoes.comprimento,
    );
  }

  private mapToOptimizedBoxes(usedBoxes: InternalBox[]): OptimizedBoxDto[] {
    return usedBoxes.map((box) => ({
      caixa_id: box.name || null,
      produtos: box.products.map((prod) => prod.produto_id),
      ...(box.observations && { observacao: box.observations }),
    }));
  }
}
