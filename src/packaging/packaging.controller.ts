import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { PackagingService } from './packaging.service';
import { RequestOptimizeOrdersDto } from './dto/create-order.dto';
import { OptimizedOrderDto } from './dto/optimized-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('packaging')
@ApiBearerAuth('JWT-auth')
@Controller('packaging')
@UseGuards(JwtAuthGuard)
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post('optimize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Otimizar embalagem de pedidos',
    description:
      'Aplica algoritmo Best Fit 3D para otimizar o empacotamento de produtos em caixas disponíveis, maximizando a eficiência do espaço e minimizando o número de caixas necessárias',
  })
  @ApiBody({
    type: RequestOptimizeOrdersDto,
    description: 'Lista de pedidos com produtos para otimização',
    examples: {
      'Pedido Simples': {
        value: {
          pedidos: [
            {
              pedido_id: 12345,
              produtos: [
                {
                  produto_id: 'PROD001',
                  dimensoes: {
                    altura: 5,
                    largura: 10,
                    comprimento: 3,
                  },
                },
                {
                  produto_id: 'PROD002',
                  dimensoes: {
                    altura: 8,
                    largura: 4,
                    comprimento: 2,
                  },
                },
              ],
            },
          ],
        },
      },
      'Múltiplos Pedidos': {
        value: {
          pedidos: [
            {
              pedido_id: 12345,
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
            {
              pedido_id: 67890,
              produtos: [
                {
                  produto_id: 'PROD003',
                  dimensoes: {
                    altura: 15,
                    largura: 20,
                    comprimento: 10,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Otimização realizada com sucesso',
    type: [OptimizedOrderDto],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          pedido_id: {
            type: 'string',
            description: 'ID do pedido otimizado',
            example: '12345',
          },
          caixas: {
            type: 'array',
            description: 'Lista de caixas otimizadas',
            items: {
              type: 'object',
              properties: {
                caixa_id: {
                  type: 'string',
                  description: 'ID da caixa utilizada',
                  example: 'CAIXA001',
                  nullable: true,
                },
                produtos: {
                  type: 'array',
                  description: 'Lista de IDs dos produtos na caixa',
                  items: {
                    type: 'string',
                    example: 'PROD001',
                  },
                },
                observacao: {
                  type: 'string',
                  description: 'Observações sobre a otimização',
                  example: 'Otimização realizada com sucesso',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou ausente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'pedidos must be an array',
            'pedido_id should not be empty',
            'produtos must be an array',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  public optimizeOrders(@Body() order: RequestOptimizeOrdersDto) {
    return this.packagingService.optimizeOrders(order);
  }
}
