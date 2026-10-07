"use client";

export function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xl text-orange-500 font-bold">L'IA forge votre site...</p>
    </div>
  );
}

export function PaymentOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xl text-green-400 font-bold">Enregistrement de votre paiement...</p>
      <p className="text-gray-400 mt-2">Quelques secondes, merci de patienter.</p>
    </div>
  );
}