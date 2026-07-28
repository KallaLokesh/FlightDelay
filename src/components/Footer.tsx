import { Plane, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-ink-800/60 bg-ink-950/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-ink-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 -rotate-45 text-accent-500" />
          <span>
            SkyDelay — Explainable flight delay intelligence, built with a
            transparent logistic model.
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Explanations are exact SHAP decompositions of a linear model</span>
          <Heart className="h-3.5 w-3.5 text-danger-500" />
        </div>
      </div>
    </footer>
  );
}
