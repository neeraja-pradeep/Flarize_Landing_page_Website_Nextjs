import { ImageIcon } from "./icons";

export interface ImagePlaceholderProps {
  label: string;
}

/** Dashed drop-zone shown until an approved photo is supplied. */
export function ImagePlaceholder({ label }: ImagePlaceholderProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-dashed border-ink/35 bg-[rgb(127_127_127/0.08)] p-3 text-center font-[system-ui,-apple-system,sans-serif] text-[13px] leading-[1.3] font-medium tracking-[0.01em] text-ink/75">
      <ImageIcon size={28} className="opacity-45" />
      <span className="max-w-[90%]">{label}</span>
    </div>
  );
}
