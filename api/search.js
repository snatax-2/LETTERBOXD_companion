export default async function handler(req, res) {
  const { query, id, providers, img, type } = req.query;
  const API_KEY = process.env.TMDB_API_KEY;

  try {
    // 1. Proxy d'image pour contourner CORS
    if (img) {
      const imgRes = await fetch(img);
      const buffer = await imgRes.arrayBuffer();
      res.setHeader('Content-Type', imgRes.headers.get('content-type'));
      return res.send(Buffer.from(buffer));
    }

    // 2. Providers Streaming
    if (id && providers) {
      const provRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`);
      const provData = await provRes.json();
      return res.status(200).json(provData);
    }

    // 3. Détails d'un film précis
    if (id) {
      const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits`);
      const detailData = await detailRes.json();
      return res.status(200).json(detailData);
    }

    // 4. NOUVEAU : Recherche par Acteur / Réalisateur
    if (query && type === 'person') {
      const personRes = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`);
      const personData = await personRes.json();
      
      // Si la personne n'existe pas
      if (!personData.results || personData.results.length === 0) {
        return res.status(200).json({ results: [] });
      }
      
      const personId = personData.results[0].id;
      
      // On cherche les films où cette personne est au casting ou à la réal, triés par popularité
      const moviesRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_people=${personId}&sort_by=popularity.desc&language=fr-FR`);
      const moviesData = await moviesRes.json();
      return res.status(200).json(moviesData);
    }

    // 5. Recherche Classique (Titre du film)
    if (query) {
      const movieRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`);
      const movieData = await movieRes.json();
      return res.status(200).json(movieData);
    }

    res.status(400).json({ error: 'Requête non valide' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
