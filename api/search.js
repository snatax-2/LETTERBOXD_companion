// api/search.js
export default async function handler(req, res) {
  const { query } = req.query;
  const TMDB_KEY = process.env.TMDB_KEY;

  // 1. Chercher le film pour trouver son ID
  const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`);
  const searchData = await searchRes.json();
  
  if (!searchData.results || searchData.results.length === 0) {
    return res.status(404).json({ error: "Film non trouvé" });
  }

  // 2. Prendre le premier résultat et chercher ses détails complets
  const movieId = searchData.results[0].id;
  const detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&language=fr-FR`);
  const detailsData = await detailsRes.json();

  // On renvoie les détails complets au frontend
  res.status(200).json(detailsData);
}
