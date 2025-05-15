"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface NetworkIconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function NetworkIcon({
  src,
  alt,
  size = 20,
  className,
}: NetworkIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
