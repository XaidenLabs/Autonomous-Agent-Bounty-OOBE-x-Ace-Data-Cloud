// src/types/bn.d.ts
// Local type declaration for bn.js — avoids needing @types/bn.js installed.
// This satisfies TypeScript without modifying node_modules.

declare module "bn.js" {
  class BN {
    constructor(value: number | string | BN, base?: number | "hex", endian?: string);
    add(b: BN): BN;
    sub(b: BN): BN;
    mul(b: BN): BN;
    div(b: BN): BN;
    mod(b: BN): BN;
    neg(): BN;
    abs(): BN;
    cmp(b: BN): -1 | 0 | 1;
    lt(b: BN): boolean;
    lte(b: BN): boolean;
    gt(b: BN): boolean;
    gte(b: BN): boolean;
    eq(b: BN): boolean;
    toNumber(): number;
    toString(base?: number | "hex"): string;
    toArray(endian?: string, length?: number): number[];
    toArrayLike(type: typeof Buffer, endian?: "le" | "be", length?: number): Buffer;
    toBuffer(endian?: "le" | "be", length?: number): Buffer;
    isNeg(): boolean;
    isZero(): boolean;
    bitLength(): number;
    byteLength(): number;
    static isBN(b: unknown): b is BN;
  }
  export = BN;
}
