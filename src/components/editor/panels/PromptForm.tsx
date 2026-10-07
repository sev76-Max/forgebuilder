"use client";

import type { UseGenerationReturn } from "@/hooks/useGeneration";

export function PromptForm({
  prompt,
  onPromptChange,
  generation,
}: {
  prompt: string;
  onPromptChange: (v: string) => void;
  generation: UseGenerationReturn;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        generation.generate(prompt);
      }}
      className="space-y-6 z-10 mb-10"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Votre activité</label>
        <textarea
          rows={3}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-orange-500 focus:outline-none text-white"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={generation.isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg"
      >
        {generation.isLoading ? "Génération..." : "Générer mon site"}
      </button>
    </form>
  );
}