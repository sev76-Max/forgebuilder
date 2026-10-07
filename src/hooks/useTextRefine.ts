"use client";

import { useCallback, useState } from "react";

export function useTextRefine() {
  const [refiningField, setRefiningField] = useState<string | null>(null);

  const refine = useCallback(
    async (fieldKey: string, currentValue: string, updater: (val: string) => void) => {
      if (!currentValue || currentValue.length < 3) return;
      setRefiningField(fieldKey);
      try {
        const res = await fetch("/api/refine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: currentValue, instruction: "Rendre plus professionnel." }),
        });
        const data = await res.json();
        if (res.ok && data.result) updater(data.result);
      } catch (err) {
        console.error(err);
      } finally {
        setRefiningField(null);
      }
    },
    []
  );

  return { refiningField, refine };
}