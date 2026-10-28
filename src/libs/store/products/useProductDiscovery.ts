import { useEffect, useState } from 'react';
import { readRecentProductIds, writeRecentProductIds } from '../../apiservices/products/recentProductStorage';
import type { Product, ProductDetail, ProductRepository, ProductState } from './productModel';
import { recordRecentProduct, selectRecommendations } from './productDiscoveryRules';

// Share only in-flight work; retry and later visits always get fresh repository data.
const requests = new WeakMap<ProductRepository, Map<string, Promise<unknown>>>();
function requestOnce<T>(repository: ProductRepository, key: string, run: () => Promise<T>): Promise<T> {
  let pending = requests.get(repository);
  if (!pending) { pending = new Map(); requests.set(repository, pending); }
  const existing = pending.get(key);
  if (existing) return existing as Promise<T>;
  const request = Promise.resolve().then(run);
  pending.set(key, request);
  void request.then(() => pending.delete(key), () => pending.delete(key));
  return request;
}

export function useProductDiscovery(product: ProductDetail, repository: ProductRepository) {
  const [ids, setIds] = useState(() => readRecentProductIds());
  const [revision, setRevision] = useState(0);
  const [recommendationResult, setRecommendations] = useState<{
    repository: ProductRepository; id: string; revision: number; state: ProductState;
  } | null>(null);
  const [historyResult, setHistory] = useState<{ ids: string[]; repository: ProductRepository; products: Product[] } | null>(null);

  useEffect(() => {
    const next = recordRecentProduct(readRecentProductIds(), product.id);
    writeRecentProductIds(next);
    setIds(next);
  }, [product.id]);

  useEffect(() => {
    let active = true;
    requestOnce(repository, 'featured', () => repository.listFeatured()).then(
      products => { if (active) setRecommendations({ repository, id: product.id, revision,
        state: { status: 'success', products: selectRecommendations(products, product) } }); },
      () => { if (active) setRecommendations({ repository, id: product.id, revision, state: { status: 'error' } }); },
    );
    return () => { active = false; };
  }, [repository, product, revision]);

  useEffect(() => {
    let active = true;
    const visibleIds = ids.filter(id => id !== product.id).slice(0, 8);
    Promise.all(visibleIds.map(id => requestOnce(repository, 'detail:' + id,
      () => repository.getById(id)).catch(() => null))).then(products => {
      if (active) setHistory({ ids, repository, products: products.filter((item): item is ProductDetail => item !== null)
        .filter((item, index, all) => item.id !== product.id && all.findIndex(other => other.id === item.id) === index) });
    });
    return () => { active = false; };
  }, [ids, repository, product.id]);

  const recommendations: ProductState = recommendationResult?.repository === repository
    && recommendationResult.id === product.id && recommendationResult.revision === revision
    ? recommendationResult.state : { status: 'loading' };
  const historyIds = ids.filter(id => id !== product.id);
  const history = historyResult?.ids === ids && historyResult.repository === repository ? historyResult.products : [];
  return {
    recommendations, history,
    historyLoading: historyIds.length > 0 && (historyResult?.ids !== ids || historyResult.repository !== repository),
    retry: () => setRevision(value => value + 1),
    clearHistory: () => { writeRecentProductIds([]); setIds([]); },
  };
}
