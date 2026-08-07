"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { findProduct, type ProductType } from "@/lib/products";

export interface CartRow {
  id: number;
  product_slug: string;
  product_type: ProductType;
  size: string | null;
  quantity: number;
}

export interface CartLine extends CartRow {
  name: string;
  image: string;
  listPrice: number;
}

export interface LastAdded {
  name: string;
  image: string;
  size: string | null;
  quantity: number;
  listPrice: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  lastAdded: LastAdded | null;
  clearLastAdded: () => void;
  addToCart: (
    productSlug: string,
    productType: ProductType,
    size: string | null,
    quantity?: number
  ) => Promise<{ error: string | null }>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue>({
  lines: [],
  count: 0,
  subtotal: 0,
  loading: true,
  lastAdded: null,
  clearLastAdded: () => {},
  addToCart: async () => ({ error: "not-ready" }),
  updateQuantity: async () => {},
  removeFromCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [rows, setRows] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastAdded, setLastAdded] = useState<LastAdded | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, product_slug, product_type, size, quantity")
      .order("created_at", { ascending: true });

    if (!error && data) setRows(data as CartRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addToCart(
    productSlug: string,
    productType: ProductType,
    size: string | null,
    quantity = 1
  ) {
    if (!user) return { error: "not-authenticated" };

    const product = findProduct(productSlug, productType);
    if (!product) return { error: "product-not-found" };

    const existing = rows.find(
      (r) => r.product_slug === productSlug && r.size === size
    );

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_slug: productSlug,
        product_type: productType,
        size,
        quantity,
      });
      if (error) return { error: error.message };
    }

    await refresh();
    setLastAdded({
      name: product.name,
      image: product.image,
      size,
      quantity,
      listPrice: product.listPrice,
    });
    return { error: null };
  }

  function clearLastAdded() {
    setLastAdded(null);
  }

  async function updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return removeFromCart(id);
    await supabase.from("cart_items").update({ quantity }).eq("id", id);
    await refresh();
  }

  async function removeFromCart(id: number) {
    await supabase.from("cart_items").delete().eq("id", id);
    await refresh();
  }

  const lines: CartLine[] = rows
    .map((row) => {
      const product = findProduct(row.product_slug, row.product_type);
      if (!product) return null;
      return {
        ...row,
        name: product.name,
        image: product.image,
        listPrice: product.listPrice,
      };
    })
    .filter((line): line is CartLine => line !== null);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.listPrice * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        subtotal,
        loading,
        lastAdded,
        clearLastAdded,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
