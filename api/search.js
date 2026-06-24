export default async function handler(req, res) {
  const { query, id, providers } = req.query;
  const TMDB_KEY = process.env.TMDB_KEY;

  try {
    if (id && providers) {
      // Cas 3 : Watch providers pour un film donné, filtrés par région (ex: BE)
      const provRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMDB_KEY}`
      );
      const provData = await provRes.json();
      // Retourner uniquement la région demandée pour alléger la réponse
      const region = providers; // ex: 'BE'
      const regionData = provData.results?.[region] || null;
      return res.status(200).json({
        'watch/providers': {
          results: {
            [region]: regionData
          }
        }
      });
    } else if (id) {
      // Cas 2 : Détails d'un film spécifique (infos + crédits)
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=fr-FR&append_to_response=credits`
      );
      const detailsData = await detailsRes.json();
      return res.status(200).json(detailsData);
    } else {
      // Cas 1 : Recherche par titre
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`
      );
      const searchData = await searchRes.json();
      return res.status(200).json(searchData);
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'appel API" });
  }
}
