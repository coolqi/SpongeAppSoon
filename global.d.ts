declare module 'buffer-layout' {
  const value: any;
  export = value;
}

declare module '@solana/buffer-layout-utils' {
  import { Layout } from 'buffer-layout';

  // 声明 u64 是一个 Layout（用于解析 64 位整数）
  export function u64(property?: string): Layout<bigint>;
}