import { useState, type ImgHTMLAttributes } from "react";
import { colourById, img, type ColourId } from "@/data/collection";

/** Image that removes its containing tile when it fails to load. */
export function SafeImg({ onHide, ...props }: ImgHTMLAttributes<HTMLImageElement> & { onHide?: () => void }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      {...props}
      onError={() => {
        setFailed(true);
        onHide?.();
      }}
    />
  );
}

/** 20px swatch showing a zoomed crop of the colour's real photo. */
export function Swatch({ colour, soldOut, size = 20 }: { colour: ColourId; soldOut?: boolean; size?: number }) {
  const c = colourById(colour);
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/25"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--frame)",
        backgroundImage: `url("${img(c.photo, 200)}")`,
        backgroundSize: "500%",
        backgroundPosition: "50% 50%",
        opacity: soldOut ? 0.4 : 1,
      }}
      aria-hidden
    >
      {soldOut && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="block h-px w-[140%] rotate-45 bg-foreground" />
        </span>
      )}
    </span>
  );
}
