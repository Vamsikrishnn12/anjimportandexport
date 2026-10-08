"use client";

type BrandLoaderProps = {
  active: boolean;
};

export default function BrandLoader({ active }: BrandLoaderProps) {
  return (
    <div
      className={`brand-loader${active ? " is-active" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={active ? "Loading page" : undefined}
      aria-hidden={!active}
    >
      <div className="brand-loader__mark">
        <img src="/anj-global-logo-transparent.png" alt="" />
        <span className="brand-loader__line" />
      </div>
    </div>
  );
}
