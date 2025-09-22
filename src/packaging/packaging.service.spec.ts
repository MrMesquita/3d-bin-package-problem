import { Test, TestingModule } from '@nestjs/testing';
import { PackagingService } from './packaging.service';
import { RequestOptimizeOrdersDto } from './dto/create-order.dto';
import { CreateProductDto } from './dto/create-product.dto';

describe('PackagingService', () => {
  let service: PackagingService;

  const mockSmallProduct: CreateProductDto = {
    produto_id: 'PROD001',
    dimensoes: {
      altura: 5,
      largura: 10,
      comprimento: 3,
    },
  };

  const mockMediumProduct: CreateProductDto = {
    produto_id: 'PROD002',
    dimensoes: {
      altura: 15,
      largura: 20,
      comprimento: 10,
    },
  };

  const mockLargeProduct: CreateProductDto = {
    produto_id: 'PROD003',
    dimensoes: {
      altura: 60,
      largura: 90,
      comprimento: 100,
    },
  };

  const mockOrderWithSingleProduct: RequestOptimizeOrdersDto = {
    pedidos: [
      {
        pedido_id: 1,
        produtos: [mockSmallProduct],
      },
    ],
  };

  const mockOrderWithMultipleProducts: RequestOptimizeOrdersDto = {
    pedidos: [
      {
        pedido_id: 2,
        produtos: [mockSmallProduct, mockMediumProduct],
      },
    ],
  };

  const mockOrderWithOversizedProduct: RequestOptimizeOrdersDto = {
    pedidos: [
      {
        pedido_id: 3,
        produtos: [mockLargeProduct],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagingService],
    }).compile();

    service = module.get<PackagingService>(PackagingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('optimizeOrders', () => {
    it('should optimize single product that fits in smallest box', () => {
      const result = service.optimizeOrders(mockOrderWithSingleProduct);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        pedido_id: '1',
        caixas: [
          {
            caixa_id: 'Caixa 1',
            produtos: ['PROD001'],
          },
        ],
      });
    });

    it('should optimize multiple products efficiently', () => {
      const result = service.optimizeOrders(mockOrderWithMultipleProducts);

      expect(result).toHaveLength(1);
      expect(result[0].pedido_id).toBe('2');
      expect(result[0].caixas).toHaveLength(1);
      expect(result[0].caixas[0].produtos).toEqual(['PROD002', 'PROD001']);
    });

    it('should handle oversized products with error observations', () => {
      const result = service.optimizeOrders(mockOrderWithOversizedProduct);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        pedido_id: '3',
        caixas: [
          {
            caixa_id: null,
            produtos: ['PROD003'],
            observacao: 'Produto não cabe em nenhuma caixa disponível.',
          },
        ],
      });
    });

    it('should pack multiple small products in same box when possible', () => {
      const multipleSmallProducts: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 4,
            produtos: [
              {
                produto_id: 'SMALL1',
                dimensoes: { altura: 2, largura: 3, comprimento: 2 },
              },
              {
                produto_id: 'SMALL2',
                dimensoes: { altura: 2, largura: 3, comprimento: 2 },
              },
            ],
          },
        ],
      };

      const result = service.optimizeOrders(multipleSmallProducts);

      expect(result[0].caixas).toHaveLength(1);
      expect(result[0].caixas[0].produtos).toEqual(['SMALL1', 'SMALL2']);
    });

    it('should process multiple orders independently', () => {
      const multipleOrders: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 5,
            produtos: [mockSmallProduct],
          },
          {
            pedido_id: 6,
            produtos: [mockMediumProduct],
          },
        ],
      };

      const result = service.optimizeOrders(multipleOrders);

      expect(result).toHaveLength(2);
      expect(result[0].pedido_id).toBe('5');
      expect(result[1].pedido_id).toBe('6');
    });

    it('should sort products by volume in descending order', () => {
      const mixedSizeProducts: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 7,
            produtos: [
              {
                produto_id: 'TINY',
                dimensoes: { altura: 1, largura: 1, comprimento: 1 },
              },
              {
                produto_id: 'LARGE',
                dimensoes: { altura: 10, largura: 15, comprimento: 8 },
              },
              {
                produto_id: 'MEDIUM',
                dimensoes: { altura: 5, largura: 8, comprimento: 6 },
              },
            ],
          },
        ],
      };

      const result = service.optimizeOrders(mixedSizeProducts);
      const firstBox = result[0].caixas[0];

      expect(firstBox.produtos[0]).toBe('LARGE');
    });

    it('should handle empty product lists', () => {
      const emptyOrder: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 8,
            produtos: [],
          },
        ],
      };

      const result = service.optimizeOrders(emptyOrder);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        pedido_id: '8',
        caixas: [],
      });
    });

    it('should choose best fitting box for product dimensions', () => {
      const perfectFitProduct: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 9,
            produtos: [
              {
                produto_id: 'PERFECT',
                dimensoes: { altura: 50, largura: 50, comprimento: 40 },
              },
            ],
          },
        ],
      };

      const result = service.optimizeOrders(perfectFitProduct);

      expect(result[0].caixas[0].caixa_id).toBe('Caixa 2');
    });

    it('should reuse boxes when adding products saves space', () => {
      const efficientPackingOrder: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 10,
            produtos: [
              {
                produto_id: 'BASE',
                dimensoes: { altura: 20, largura: 30, comprimento: 35 },
              },
              {
                produto_id: 'ADDON',
                dimensoes: { altura: 5, largura: 5, comprimento: 5 },
              },
            ],
          },
        ],
      };

      const result = service.optimizeOrders(efficientPackingOrder);

      expect(result[0].caixas).toHaveLength(1);
      expect(result[0].caixas[0].produtos).toEqual(['BASE', 'ADDON']);
    });
  });
});
