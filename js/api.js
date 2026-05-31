/* ── api.js — Anthropic Claude API integration ───────────── */

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT = `You are a professional music producer and songwriter AI.
Given lyrics and a genre (and optional mood), generate a detailed song concept.
Respond ONLY with valid JSON — no markdown fences, no explanation, no extra text.

Required JSON structure:
{
  "title": "Creative catchy song title (Hindi, English or mix)",
  "mood": "Mood in 2-3 words",
  "tempo": "Slow | Mid | Fast | Very Fast",
  "key": "Musical key e.g. C major, A minor",
  "instruments": ["array", "of", "4-6", "instruments"],
  "hook": "A memorable hook/chorus line extracted or inspired from the lyrics (20-35 words)",
  "description": "2 sentences describing the song's feel, vibe and style",
  "songStructure": ["Intro", "Verse 1", "Chorus", "Verse 2", "Chorus", "Bridge", "Outro"],
  "similarArtists": ["2-3 similar artist names relevant to the genre"]
}`;

async function callClaudeAPI(lyrics, genre, mood) {
  const userContent = [
    `Genre: ${genre}`,
    mood ? `Mood: ${mood}` : '',
    `\nLyrics:\n${lyrics}`
  ].filter(Boolean).join('\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = (data.content || []).map(b => b.text || '').join('');

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    // Fallback if JSON parse fails
    return {
      title: `${genre} Song`,
      mood: mood || 'Soulful',
      tempo: 'Mid',
      key: 'C major',
      instruments: ['Guitar', 'Tabla', 'Piano', 'Synthesizer'],
      hook: lyrics.substring(0, 80) + '...',
      description: 'An emotionally rich song crafted from your lyrics.',
      songStructure: ['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Outro'],
      similarArtists: []
    };
  }
}
