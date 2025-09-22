import { OptimizedBoxDto } from './optmized-box.dto';

export class OptimizedOrderDto {
  pedido_id: string;
  caixas: OptimizedBoxDto[];
}
