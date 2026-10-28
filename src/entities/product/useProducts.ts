import { useEffect, useState } from 'react';
import type { Product } from './Product';
import type { ProductRepository } from './ProductRepository';

export type ProductState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; products: Product[] };

export function useProducts(repository: ProductRepository, keyword?: string) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{ keyword?: string; revision: number; state: ProductState }>({
    keyword, revision, state: { status: 'loading' },
  });
  useEffect(() => {
    let active = true;
    const request = keyword === undefined ? repository.listFeatured() : repository.search(keyword);
    request.then(
      products => { if (active) setResult({ keyword, revision, state: { status: 'success', products } }); },
      () => { if (active) setResult({ keyword, revision, state: { status: 'error' } }); },
    );
    return () => { active = false; };
  }, [repository, keyword, revision]);
  const state: ProductState = result.keyword === keyword && result.revision === revision
    ? result.state : { status: 'loading' };
  return { state, retry: () => setRevision(value => value + 1) };
}
