import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a GitHub repository name by replacing hyphens/underscores with spaces,
 * removing special characters, and capitalizing the first letter of each word.
 */
export function formatRepoName(name: string): string {
  return name
    .replace(/[_-]/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
