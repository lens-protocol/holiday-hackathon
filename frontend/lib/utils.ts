import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const contractAddress='0xc790B7a3b2C76693E5d4982B6a9Fc0CCe7f4a823'