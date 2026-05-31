/* ── app.js — Main application logic ────────────────────── */

/* ── State ─────────────────────────────────────────────── */
let selectedGenre = 'Bollywood';
let selectedMood  = null;
let songs         = [];
let credits       = FREE_CREDITS;
let _openModalSongId = null;

/* ── Init ──────────────────────────────────────────────── */
function init() {
  loadFromStorage();
  renderGenreChips(selectedGenre, g => { selectedGenre = g; });
  renderMoodChips(selectedMood, m => { selectedMood = m; });
  renderSongs(songs, 'songsGrid');
  updateCreditsPill(credits);
}

/* ── Storage ───────────────────────────────────────────── */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SONGS);
    songs = raw ? JSON.parse(raw) : [];
  } catch { songs = []; }

  try {
    const c = localStorage.getItem(STORAGE_KEY_CREDITS);
    credits = c !== null ? parseInt(c, 10) : FREE_CREDITS;
    if (isNaN(credits)) credits = FREE_CREDITS;
  } catch { credits = FREE_CREDITS; }
}

function saveToStorage() {
  try { localStorage.setItem(STORAGE_KEY_SONGS,   JSON.stringify(songs)); }   catch {}
  try { localStorage.setItem(STORAGE_KEY_CREDITS, String(credits)); }          catch {}
}

/* ── Generate Song ─────────────────────────────────────── */
async function generateSong() {
  const lyrics = document.getElementById('lyricsInput').value.trim();

  if (!lyrics) {
    showToast('Please enter some lyrics first!', 'error');
    return;
  }
  if (credits <= 0) {
    showToast('No credits remaining. Refresh the page to reset.', 'error');
    return;
  }

  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  document.getElementById('btnContent').innerHTML =
    `<span class="spinner"></span> Generating...`;

  startStatusCycle();

  try {
    const songData = await callClaudeAPI(lyrics, selectedGenre, selectedMood);

    const audioIndex = songs.length % AUDIO_SAMPLES.length;
    const newSong = {
      id:            Date.now().toString(),
      title:         songData.title         || `${selectedGenre} Song`,
      genre:         selectedGenre,
      mood:          songData.mood          || selectedMood || '',
      tempo:         songData.tempo         || '',
      key:           songData.key           || '',
      instruments:   songData.instruments   || [],
      hook:          songData.hook          || '',
      description:   songData.description   || '',
      songStructure: songData.songStructure || [],
      similarArtists:songData.similarArtists|| [],
      lyricsSnippet: lyrics,
      audioUrl:      AUDIO_SAMPLES[audioIndex],
      date:          new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    };

    songs = [newSong, ...songs];
    credits = Math.max(0, credits - 1);
    saveToStorage();

    renderSongs(songs, 'songsGrid');
    updateCreditsPill(credits);
    showToast('🎵 Song generated successfully!', 'success');
    document.getElementById('lyricsInput').value = '';
    updateCharCount();

  } catch (err) {
    console.error('Generation error:', err);
    showToast('Something went wrong. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    document.getElementById('btnContent').innerHTML = '<span>🚀</span> Generate Song';
    stopStatusCycle();
  }
}

/* ── Play handlers ─────────────────────────────────────── */
async function handlePlayClick(e, songId) {
  e.stopPropagation(); // prevent card click → modal

  const song = songs.find(s => s.id === songId);
  if (!song) return;

  const wasPlaying = getPlayingId() === songId;
  const playing = await playSong(songId, song.audioUrl, () => {
    // on song end — re-render to reset play button
    renderSongs(songs, 'songsGrid');
    if (_openModalSongId === songId) refreshModalPlayBtn(false);
  });

  renderSongs(songs, 'songsGrid');
  if (_openModalSongId === songId) refreshModalPlayBtn(!wasPlaying && playing);
}

async function handleModalPlay(songId) {
  const song = songs.find(s => s.id === songId);
  if (!song) return;

  const wasPlaying = getPlayingId() === songId;
  await playSong(songId, song.audioUrl, () => {
    renderSongs(songs, 'songsGrid');
    refreshModalPlayBtn(false);
  });

  renderSongs(songs, 'songsGrid');
  refreshModalPlayBtn(!wasPlaying);
}

function refreshModalPlayBtn(isPlaying) {
  const btn   = document.querySelector('.modal-play-btn');
  const label = document.getElementById('modalPlayLabel');
  if (!btn || !label) return;
  btn.querySelector('span').textContent = isPlaying ? '⏸' : '▶';
  label.textContent = isPlaying ? 'Pause Preview' : 'Play Audio Preview';
}

/* ── Card click → open modal ───────────────────────────── */
function handleCardClick(e, songId) {
  // Don't open modal if the play button was clicked
  if (e.target.closest('.play-btn')) return;
  const song = songs.find(s => s.id === songId);
  if (!song) return;
  _openModalSongId = songId;
  openSongModal(song);
}

function handleModalClick(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    _openModalSongId = null;
    closeModal(e);
  }
}

/* ── Clear all songs ───────────────────────────────────── */
function clearSongs() {
  if (!confirm('Delete all generated songs?')) return;
  stopAll();
  songs = [];
  saveToStorage();
  renderSongs(songs, 'songsGrid');
  showToast('All songs cleared.');
}

/* ── Library tab ───────────────────────────────────────── */
function renderLibrary() {
  renderSongs(songs, 'libraryGrid');
}

/* ── Keyboard: close modal on Escape ──────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    _openModalSongId = null;
    document.getElementById('modalOverlay').classList.add('hidden');
    document.body.style.overflow = '';
  }
});

/* ── Boot ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);
