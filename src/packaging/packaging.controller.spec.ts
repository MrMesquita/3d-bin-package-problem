import { Test, TestingModule } from '@nestjs/testing';
import { PackagingController } from './packaging.controller';
import { PackagingService } from './packaging.service';
import { RequestOptimizeOrdersDto } from './dto/create-order.dto';
import { OptimizedOrderDto } from './dto/optimized-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('PackagingController', () => {
  let controller: PackagingController;
  let packagingService: jest.Mocked<PackagingService>;

  const mockRequestOrder: RequestOptimizeOrdersDto = {
    pedidos: [
      {
        pedido_id: 1,
        produtos: [
          {
            produto_id: 'PROD001',
            dimensoes: {
              altura: 5,
              largura: 10,
              comprimento: 3,
            },
          },
        ],
      },
    ],
  };

  const mockOptimizedResponse: OptimizedOrderDto[] = [
    {
      pedido_id: '1',
      caixas: [
        {
          caixa_id: 'Caixa 1',
          produtos: ['PROD001'],
        },
      ],
    },
  ];

  const mockMultipleOrdersRequest: RequestOptimizeOrdersDto = {
    pedidos: [
      {
        pedido_id: 1,
        produtos: [
          {
            produto_id: 'PROD001',
            dimensoes: { altura: 5, largura: 10, comprimento: 3 },
          },
        ],
      },
      {
        pedido_id: 2,
        produtos: [
          {
            produto_id: 'PROD002',
            dimensoes: { altura: 15, largura: 20, comprimento: 10 },
          },
        ],
      },
    ],
  };

  const mockMultipleOrdersResponse: OptimizedOrderDto[] = [
    {
      pedido_id: '1',
      caixas: [
        {
          caixa_id: 'Caixa 1',
          produtos: ['PROD001'],
        },
      ],
    },
    {
      pedido_id: '2',
      caixas: [
        {
          caixa_id: 'Caixa 3',
          produtos: ['PROD002'],
        },
      ],
    },
  ];

  const mockOversizedProductRequest: RequestOptimizeOrdersDto = {
    pedidos: [
      {
        pedido_id: 3,
        produtos: [
          {
            produto_id: 'OVERSIZED',
            dimensoes: { altura: 100, largura: 200, comprimento: 300 },
          },
        ],
      },
    ],
  };

  const mockOversizedProductResponse: OptimizedOrderDto[] = [
    {
      pedido_id: '3',
      caixas: [
        {
          caixa_id: null,
          produtos: ['OVERSIZED'],
          observacao: 'Produto não cabe em nenhuma caixa disponível.',
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagingController],
      providers: [
        {
          provide: PackagingService,
          useValue: {
            optimizeOrders: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PackagingController>(PackagingController);
    packagingService = module.get(PackagingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('optimizeOrders', () => {
    it('should return optimized order for single product', () => {
      packagingService.optimizeOrders.mockReturnValue(mockOptimizedResponse);

      const result = controller.optimizeOrders(mockRequestOrder);

      expect(result).toEqual(mockOptimizedResponse);
      expect(packagingService.optimizeOrders).toHaveBeenCalledWith(
        mockRequestOrder,
      );
    });

    it('should handle multiple orders optimization', () => {
      packagingService.optimizeOrders.mockReturnValue(
        mockMultipleOrdersResponse,
      );

      const result = controller.optimizeOrders(mockMultipleOrdersRequest);

      expect(result).toEqual(mockMultipleOrdersResponse);
      expect(packagingService.optimizeOrders).toHaveBeenCalledWith(
        mockMultipleOrdersRequest,
      );
    });

    it('should handle oversized products with observations', () => {
      packagingService.optimizeOrders.mockReturnValue(
        mockOversizedProductResponse,
      );

      const result = controller.optimizeOrders(mockOversizedProductRequest);

      expect(result).toEqual(mockOversizedProductResponse);
      expect(result[0].caixas[0]).toHaveProperty('observacao');
    });

    it('should handle empty orders list', () => {
      const emptyRequest: RequestOptimizeOrdersDto = { pedidos: [] };
      const emptyResponse: OptimizedOrderDto[] = [];

      packagingService.optimizeOrders.mockReturnValue(emptyResponse);

      const result = controller.optimizeOrders(emptyRequest);

      expect(result).toEqual(emptyResponse);
      expect(packagingService.optimizeOrders).toHaveBeenCalledWith(
        emptyRequest,
      );
    });

    it('should handle orders with no products', () => {
      const noProductsRequest: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 999,
            produtos: [],
          },
        ],
      };

      const noProductsResponse: OptimizedOrderDto[] = [
        {
          pedido_id: '999',
          caixas: [],
        },
      ];

      packagingService.optimizeOrders.mockReturnValue(noProductsResponse);

      const result = controller.optimizeOrders(noProductsRequest);

      expect(result).toEqual(noProductsResponse);
      expect(result[0].caixas).toHaveLength(0);
    });

    it('should pass through service optimization logic', () => {
      const complexRequest: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 100,
            produtos: [
              {
                produto_id: 'A',
                dimensoes: { altura: 5, largura: 5, comprimento: 5 },
              },
              {
                produto_id: 'B',
                dimensoes: { altura: 10, largura: 10, comprimento: 10 },
              },
              {
                produto_id: 'C',
                dimensoes: { altura: 15, largura: 15, comprimento: 15 },
              },
            ],
          },
        ],
      };

      const complexResponse: OptimizedOrderDto[] = [
        {
          pedido_id: '100',
          caixas: [
            {
              caixa_id: 'Caixa 2',
              produtos: ['C', 'A'],
            },
            {
              caixa_id: 'Caixa 1',
              produtos: ['B'],
            },
          ],
        },
      ];

      packagingService.optimizeOrders.mockReturnValue(complexResponse);

      const result = controller.optimizeOrders(complexRequest);

      expect(result).toEqual(complexResponse);
      expect(packagingService.optimizeOrders).toHaveBeenCalledTimes(1);
      expect(packagingService.optimizeOrders).toHaveBeenCalledWith(
        complexRequest,
      );
    });

    it('should handle service errors gracefully', () => {
      packagingService.optimizeOrders.mockImplementation(() => {
        throw new Error('Service optimization failed');
      });

      expect(() => controller.optimizeOrders(mockRequestOrder)).toThrow(
        'Service optimization failed',
      );
    });

    it('should maintain order ID as string in response', () => {
      const numericOrderRequest: RequestOptimizeOrdersDto = {
        pedidos: [
          {
            pedido_id: 12345,
            produtos: [
              {
                produto_id: 'TEST',
                dimensoes: { altura: 1, largura: 1, comprimento: 1 },
              },
            ],
          },
        ],
      };

      const stringOrderResponse: OptimizedOrderDto[] = [
        {
          pedido_id: '12345',
          caixas: [
            {
              caixa_id: 'Caixa 1',
              produtos: ['TEST'],
            },
          ],
        },
      ];

      packagingService.optimizeOrders.mockReturnValue(stringOrderResponse);

      const result = controller.optimizeOrders(numericOrderRequest);

      expect(result[0].pedido_id).toBe('12345');
      expect(typeof result[0].pedido_id).toBe('string');
    });
  });
});
