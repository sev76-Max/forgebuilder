export default function FooterBlock({ siteName }: { siteName: string }) {
  return (
    <footer className="bg-black text-gray-400 py-8 text-center text-sm border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <p>© {new Date().getFullYear()} {siteName}. Tous droits réservés.</p>
        <p className="mt-2">Propulsé par <span className="text-orange-500 font-bold">ForgeBuilder</span>.</p>
      </div>
    </footer>
  );
}