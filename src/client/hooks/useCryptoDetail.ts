import React from "react";
import type { Cryptocurrency, CryptoPrice, TradingPair } from "../../types";
import { fetchJson, emitApiError } from "../lib/apiClient";
import { normalizeCryptoPrice, normalizeTradingPair } from "../lib/normalize";

type ExchangeListing = { exchange: string; totalVolume: number };

export function useCryptoDetail(cryptoId: string | undefined) {
  const [crypto, setCrypto] = React.useState<Cryptocurrency | null>(null);
  const [priceData, setPriceData] = React.useState<CryptoPrice | null>(null);
  const [tradingPairs, setTradingPairs] = React.useState<TradingPair[]>([]);
  const [exchangeListings, setExchangeListings] = React.useState<ExchangeListing[]>([]);
  const [news, setNews] = React.useState<
    Array<{
      id?: number | string;
      title?: string;
      description?: string;
      source?: string;
      publishedAt?: string;
      url?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!cryptoId) return;
    setIsLoading(true);
    setError(null);
    const id = cryptoId.toLowerCase();

    try {
      const [cRes, pRes, pairsRes, exchRes, newsRes] = await Promise.all([
        fetchJson<Cryptocurrency>(`/cryptos/${encodeURIComponent(id)}`),
        fetchJson<Record<string, unknown>>(`/cryptos/${encodeURIComponent(id)}/price`).catch(() => null),
        fetchJson<Record<string, unknown>[]>(`/cryptos/${encodeURIComponent(id)}/pairs?limit=15`).catch(() => ({
          success: true,
          data: [],
        })),
        fetchJson<ExchangeListing[]>(`/cryptos/${encodeURIComponent(id)}/exchanges?limit=10`).catch(() => ({
          success: true,
          data: [],
        })),
        fetchJson<unknown[]>(`/cryptos/${encodeURIComponent(id)}/news?limit=10`).catch(() => ({
          success: true,
          data: [],
        })),
      ]);

      if (cRes.data) setCrypto(cRes.data);
      if (pRes?.data) setPriceData(normalizeCryptoPrice(pRes.data));
      if (pairsRes.data?.length) {
        setTradingPairs(pairsRes.data.map((r) => normalizeTradingPair(r as Record<string, unknown>)));
      } else {
        setTradingPairs([]);
      }
      if (exchRes.data?.length) {
        setExchangeListings(
          exchRes.data.map((ex) => ({
            exchange: ex.exchange,
            totalVolume: Number(ex.totalVolume) || 0,
          }))
        );
      } else {
        setExchangeListings([]);
      }
      if (newsRes.data?.length) setNews(newsRes.data as typeof news);
      else setNews([]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load cryptocurrency";
      setError(msg);
      emitApiError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [cryptoId]);

  React.useEffect(() => {
    load();
  }, [load]);

  return {
    crypto,
    priceData,
    tradingPairs,
    exchangeListings,
    news,
    isLoading,
    error,
    retry: load,
  };
}
