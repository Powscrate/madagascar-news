import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">M</span>
              <span className="font-serif font-bold text-xl text-white">Madagascar News</span>
            </div>
            <p className="text-sm leading-relaxed">
              Agrégeateur d'actualités indépendant. Nous regroupons les informations des principales sources
              médiatiques de Madagascar pour vous offrir une vue complète de l'actualité.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Catégories</h4>
            <div className="flex flex-col gap-2 text-sm">
              {["Actualités", "Politique", "Technologie", "Économie", "Sport", "Culture"].map((c) => (
                <Link key={c} href={`/categorie/${c.toLowerCase()}`} className="hover:text-emerald-400 transition">{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <p className="text-sm leading-relaxed">
              Madagascar News est un agrégateur de flux RSS publics. Les articles appartiennent à leurs
              sources respectives. En cas de réclamation, contactez-nous.
            </p>
            <p className="text-xs mt-4 text-neutral-500">
              &copy; {new Date().getFullYear()} Madagascar News. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
