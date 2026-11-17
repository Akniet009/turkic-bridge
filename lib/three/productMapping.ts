import { Product } from '@/lib/types';
import { FabricWeaveId } from './fabricTextures';
import { ModelTypeId } from './models';

export interface Product3DConfig {
  model: ModelTypeId;
  weave: FabricWeaveId;
  colorId: string;
}

const BY_PRODUCT_ID: Record<string, Product3DConfig> = {
  'prod-101': { model: 'bed', weave: 'ranforce', colorId: 'sand' },
  'prod-102': { model: 'bed', weave: 'stripe_satin', colorId: 'ivory' },
  'prod-103': { model: 'towels', weave: 'terry', colorId: 'ocean' },
  'prod-104': { model: 'towels', weave: 'terry', colorId: 'sage' },
  'prod-105': { model: 'sofa', weave: 'waffle', colorId: 'terracotta' },
  'prod-201': { model: 'bed', weave: 'jacquard', colorId: 'ivory' },
  'prod-202': { model: 'bed', weave: 'linen', colorId: 'sand' },
  'prod-203': { model: 'sofa', weave: 'tartan', colorId: 'emerald' },
  'prod-204': { model: 'chair', weave: 'jacquard', colorId: 'emerald' },
  'prod-205': { model: 'drape', weave: 'linen', colorId: 'terracotta' },
  'prod-301': { model: 'towels', weave: 'terry', colorId: 'ivory' },
  'prod-302': { model: 'towels', weave: 'terry', colorId: 'graphite' },
  'prod-303': { model: 'chair', weave: 'terry', colorId: 'ivory' },
  'prod-304': { model: 'bed', weave: 'stripe_satin', colorId: 'sage' },
  'prod-305': { model: 'sofa', weave: 'velvet_sherpa', colorId: 'blush' },
};

export function getProduct3DConfig(product: Product): Product3DConfig {
  if (BY_PRODUCT_ID[product.id]) {
    return BY_PRODUCT_ID[product.id];
  }

  const text = `${product.title_ru} ${product.composition || ''}`.toLowerCase();

  let weave: FabricWeaveId = 'ranforce';
  if (text.includes('сатин') || text.includes('satin')) weave = 'stripe_satin';
  else if (text.includes('махр') || text.includes('havlu')) weave = 'terry';
  else if (text.includes('вафел') || text.includes('waffle')) weave = 'waffle';
  else if (text.includes('жаккард') || text.includes('jakar')) weave = 'jacquard';
  else if (text.includes('лен') || text.includes('лён') || text.includes('keten')) weave = 'linen';
  else if (text.includes('шерст') || text.includes('тартан') || text.includes('клетк')) weave = 'tartan';
  else if (text.includes('бархат') || text.includes('велюр') || text.includes('шерпа')) weave = 'velvet_sherpa';

  let model: ModelTypeId = 'sofa';
  if (product.category === 'bedding') model = 'bed';
  else if (product.category === 'towels') model = 'towels';
  else if (product.category === 'fabrics') model = 'drape';
  else if (product.category === 'apparel') model = 'chair';

  return {
    model,
    weave,
    colorId: 'emerald',
  };
}
