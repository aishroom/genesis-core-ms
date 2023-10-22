import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Workspace } from './workspace.entity';
import { Product } from './product.entity';

@Entity('productWorkspace')
export class ProductWorkspace {
  @PrimaryColumn()
  workspaceId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.productWorkspaces)
  workspace: Workspace;

  @ManyToOne(() => Product, (product) => product.productWorkspaces)
  product: Product;
}
