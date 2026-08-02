"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { findProduct, type ProductType } from "@/lib/products";

export interface FavoriteRow {
  id: number;
  product_slug: string;
  product_type: ProductType;
}

export interface FavoriteLine extends FavoriteRow {
  name: string;
  image: string;
  originalPrice: number;
  finalPrice: number;
  offPercent: number;
}

interface FavoritesContextValue {
  lines: FavoriteLine[];
  loading: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (
    productSlug: string,
    productType: ProductType
  ) => Promise<{ error: string | null }>;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  lines: [],
  loading: true,
  isFavorite: () => false,
  toggleFavorite: async () => ({ error: "not-ready" }),
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [rows, setRows] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("favorites")
      .select("id, product_slug, product_type")
      .order("created_at", { ascending: true });

    if (!error && data) setRows(data as FavoriteRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function isFavorite(slug: string) {
    return rows.some((r) => r.product_slug === slug);
  }

  async function toggleFavorite(productSlug: string, productType: ProductType) {
    if (!user) return { error: "not-authenticated" };

    const existing = rows.find((r) => r.product_slug === productSlug);
    if (existing) {
      const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        product_slug: productSlug,
        product_type: productType,
      });
      if (error) return { error: error.message };
    }

    await refresh();
    return { error: null };
  }

  const lines: FavoriteLine[] = rows
    .map((row) => {
      const product = findProduct(row.product_slug, row.product_type);
      if (!product) return null;
      return {
        ...row,
        name: product.name,
        image: product.image,
        originalPrice: product.originalPrice,
        finalPrice: product.finalPrice,
        offPercent: product.offPercent,
      };
    })
    .filter((line): line is FavoriteLine => line !== null);

  return (
    <FavoritesContext.Provider value={{ lines, loading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
