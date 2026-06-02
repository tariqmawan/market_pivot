// Generic local-first CRUD store factory for admin modules.
// Backs every entity with localStorage via zustand/persist so admins get
// instant feedback without depending on the backend. Backend sync can be
// layered on later via the optional `remoteSync` callback.

import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CrudEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface CrudStoreState<T extends CrudEntity> {
  items: T[];
  loading: boolean;
  error: string | null;
  lastSyncedAt: number | null;
  selection: string[];

  add: (input: Omit<T, "id" | "createdAt" | "updatedAt">) => T;
  addMany: (inputs: Array<Omit<T, "id" | "createdAt" | "updatedAt">>) => T[];
  update: (id: string, patch: Partial<Omit<T, "id" | "createdAt">>) => T | null;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;
  replaceAll: (items: T[]) => void;
  reset: () => void;
}

export interface CrudStoreOptions<T extends CrudEntity> {
  /** localStorage key — must be unique per entity */
  name: string;
  /** Initial seed records (used when no persisted state exists) */
  seed?: T[];
  /** Optional id prefix (default: derived from `name`) */
  idPrefix?: string;
}

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function createCrudStore<T extends CrudEntity>(opts: CrudStoreOptions<T>) {
  const prefix = opts.idPrefix ?? opts.name.replace(/[^a-z0-9]+/gi, "-").slice(0, 4);

  const initializer: StateCreator<CrudStoreState<T>> = (set, get) => ({
    items: opts.seed ?? [],
    loading: false,
    error: null,
    lastSyncedAt: null,
    selection: [],

    add: (input) => {
      const now = Date.now();
      const item = {
        ...(input as object),
        id: makeId(prefix),
        createdAt: now,
        updatedAt: now,
      } as T;
      set((s) => ({ items: [item, ...s.items] }));
      return item;
    },

    addMany: (inputs) => {
      const now = Date.now();
      const created: T[] = inputs.map(
        (i) =>
          ({
            ...(i as object),
            id: makeId(prefix),
            createdAt: now,
            updatedAt: now,
          } as T)
      );
      set((s) => ({ items: [...created, ...s.items] }));
      return created;
    },

    update: (id, patch) => {
      let updated: T | null = null;
      set((s) => ({
        items: s.items.map((item) => {
          if (item.id !== id) return item;
          updated = { ...item, ...patch, updatedAt: Date.now() } as T;
          return updated;
        }),
      }));
      return updated;
    },

    remove: (id) => {
      set((s) => ({
        items: s.items.filter((i) => i.id !== id),
        selection: s.selection.filter((sid) => sid !== id),
      }));
    },

    removeMany: (ids) => {
      const set_ = new Set(ids);
      set((s) => ({
        items: s.items.filter((i) => !set_.has(i.id)),
        selection: s.selection.filter((sid) => !set_.has(sid)),
      }));
    },

    toggleSelection: (id) => {
      const sel = get().selection;
      set({
        selection: sel.includes(id)
          ? sel.filter((sid) => sid !== id)
          : [...sel, id],
      });
    },

    setSelection: (ids) => set({ selection: ids }),
    clearSelection: () => set({ selection: [] }),

    replaceAll: (items) => set({ items, lastSyncedAt: Date.now() }),
    reset: () => set({ items: opts.seed ?? [], selection: [], error: null }),
  });

  return create<CrudStoreState<T>>()(
    persist(initializer, {
      name: opts.name,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        lastSyncedAt: s.lastSyncedAt,
      }) as Partial<CrudStoreState<T>>,
    })
  );
}
