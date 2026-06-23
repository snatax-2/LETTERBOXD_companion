export default async function handler(req, res) {
  const { query, id } = req.query; // On accepte soit 'query' (recherche), soit 'id' (détails)
  const TMDB_KEY = process.env.TMDB_KEY;

  try {
    if (id) {
      // Cas 2 : On veut les détails d'un film spécifique
      const detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=fr-FR`);
      const detailsData = await detailsRes.json();
      return res.status(200).json(detailsData);
    } else {
      // Cas 1 : On veut faire une recherche
      const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`);
      const searchData = await searchRes.json();
      return res.status(200).json(searchData);
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'appel API" });
  }
}
