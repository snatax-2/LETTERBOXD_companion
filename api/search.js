// api/search.js
export default async function handler(req, res) {
  const { query } = req.query;
  const TMDB_KEY = process.env.TMDB_KEY; // La clé sera gérée par Vercel

  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`);
  const data = await response.json();
  
  res.status(200).json(data);
}
