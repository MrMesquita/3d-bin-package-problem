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

  private createNewBoxForProduct(
    product: CreateProductDto,
  ): InternalBox | null {
    for (const box of this.availableBoxes) {
      if (this.productCanFitInAvailableBox(product, box)) {
        return {
          name: box.name,
          dimensions: { ...box.dimensions },
          products: [product],
        };
      }
    }

    return {
      name: null,
      products: [product],
      observations: 'Produto não cabe em nenhuma caixa disponível.',
    };
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

  public optimizeOrders(orders: RequestOptimizeOrdersDto): OptimizedOrderDto[] {
    const results: OptimizedOrderDto[] = [];

    for (const order of orders.pedidos) {
      const sortedProducts = [...order.produtos].sort((a, b) =>
        this.sortDecreasingByVolume(a, b),
      );

      const usedBoxes: InternalBox[] = [];

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

      const optmizedBoxes: OptimizedBoxDto[] = usedBoxes.map((box) => ({
        caixa_id: box.name || null,
        produtos: box.products.map((prod) => prod.produto_id),
        observacao: box.observations || undefined,
      }));

      results.push({
        pedido_id: order.pedido_id.toString(),
        caixas: optmizedBoxes,
      });
    }

    return results;
  }
}
