import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OptimizedBoxDto {
  @ApiProperty({
    description: 'ID da caixa utilizada',
    example: 'CAIXA001',
    type: String,
    nullable: true,
  })
  caixa_id: string | null;

  @ApiProperty({
    description: 'Lista de IDs dos produtos na caixa',
    type: [String],
    example: ['PROD001', 'PROD002'],
  })
  produtos: string[];

  @ApiPropertyOptional({
    description: 'Observações sobre a otimização',
    example: 'Produtos muito grandes para caixas disponíveis',
    type: String,
  })
  observacao?: string;
}
