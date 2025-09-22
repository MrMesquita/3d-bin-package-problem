import { ApiProperty } from '@nestjs/swagger';
import { OptimizedBoxDto } from './optmized-box.dto';

export class OptimizedOrderDto {
  @ApiProperty({
    description: 'ID do pedido otimizado',
    example: '12345',
    type: String,
  })
  pedido_id: string;

  @ApiProperty({
    description: 'Lista de caixas otimizadas para este pedido',
    type: [OptimizedBoxDto],
    example: [
      {
        caixa_id: 'CAIXA001',
        produtos: ['PROD001', 'PROD002'],
        observacao: 'Otimização realizada com sucesso',
      },
    ],
  })
  caixas: OptimizedBoxDto[];
}
