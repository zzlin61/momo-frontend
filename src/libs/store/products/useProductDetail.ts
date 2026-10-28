import { useEffect, useState } from 'react';
import type { ProductDetail, ProductRepository } from './productModel';

export type ProductDetailState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'success'; product: ProductDetail };

export function useProductDetail(repository: ProductRepository, productId: string) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    repository: ProductRepository;
    productId: string;
    revision: number;
    state: ProductDetailState;
  } | null>(null);

  useEffect(() => {
    let active = true;
    repository.getById(productId).then(
      product => {
        if (active) setResult({
          repository, productId, revision,
          state: product ? { status: 'success', product } : { status: 'not-found' },
        });
      },
      () => { if (active) setResult({ repository, productId, revision, state: { status: 'error' } }); },
    );
    return () => { active = false; };
  }, [repository, productId, revision]);

  const state: ProductDetailState = result?.repository === repository
    && result.productId === productId && result.revision === revision
    ? result.state : { status: 'loading' };
  return { state, retry: () => setRevision(value => value + 1) };
}
