/* ── ui.js — Render helpers ───────────────────────────────── */

/* ── Toast ─────────────────────────────────────────────── */
let _toastTimer = null;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = 'toast'; }, 3200);
}

/* ── Char counter ──────────────────────────────────────── */
function updateCharCount() {
  const val = document.getElementById('lyricsInput').value;
  document.getElementById('charCounter').textContent =
    `${val.length} character${val.length !== 1 ? 's' : ''}`;
}

/* ── Status bar ────────────────────────────────────────── */
let _statusIndex = 0, _statusInterval = null;
function startStatusCycle() {
  _statusIndex = 0;
  document.getElementById('statusText').textContent = STATUS_MESSAGES[0];
  document.getElementById('statusBar').classList.remove('hidden');
  _statusInterval = setInterval(() => {
    _statusIndex = (_statusIndex + 1) % STATUS_MESSAGES.length;
    document.getElementById('statusText').textContent = STATUS_MESSAGES[_statusIndex];
  }, 1800);
}
function stopStatusCycle() {
  clearInterval(_statusInterval);
  document.getElementById('statusBar').classList.add('hidden');
}

/* ── Genre chips ───────────────────────────────────────── */
function renderGenreChips(selectedGenre, onSelect) {
  const grid = document.getElementById('genreGrid');
  grid.innerHTML = '';
  GENRES.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'genre-chip' + (g === selectedGenre ? ' active' : '');
    btn.textContent = g;
    btn.onclick = () => {
      document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      onSelect(g);
    };
    grid.appendChild(btn);
  });
}

/* ── Mood chips ────────────────────────────────────────── */
function renderMoodChips(selectedMood, onSelect) {
  const row = document.getElementById('moodRow');
  row.innerHTML = '';
  MOODS.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'mood-chip' + (m === selectedMood ? ' active' : '');
    btn.textContent = m;
    btn.onclick = () => {
      if (selectedMood === m) {
        // deselect
        btn.classList.remove('active');
        onSelect(null);
        return;
      }
      document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      onSelect(m);
    };
    row.appendChild(btn);
  });
}

/* ── Play button HTML ──────────────────────────────────── */
function playBtnHTML(isPlaying) {
  if (isPlaying) {
    return `<div class="waveform">
      <div class="wbar"></div><div class="wbar"></div>
      <div class="wbar"></div><div class="wbar"></div><div class="wbar"></div>
    </div>`;
  }
  return `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2l10 6-10 6V2z"/></svg>`;
}

/* ── Song card HTML ────────────────────────────────────── */
function songCardHTML(song) {
  const isPlaying = getPlayingId() === song.id;
  const instrumentsStr = (song.instruments || []).join(' · ');
  return `
    <div class="song-card${isPlaying ? ' playing' : ''}" id="card-${song.id}"
         onclick="handleCardClick(event, '${song.id}')">
      <button class="play-btn" data-songid="${song.id}"
              onclick="handlePlayClick(event, '${song.id}')"
              aria-label="${isPlaying ? 'Pause' : 'Play'} ${escHtml(song.title)}">
        ${playBtnHTML(isPlaying)}
      </button>
      <div class="song-body">
        <div class="song-title">${escHtml(song.title)}</div>
        <div class="song-tags">
          <span class="tag tag--genre">${escHtml(song.genre)}</span>
          ${song.mood    ? `<span class="tag tag--mood">${escHtml(song.mood)}</span>` : ''}
          ${song.tempo   ? `<span class="tag tag--tempo">${escHtml(song.tempo)}</span>` : ''}
          <span class="tag tag--date">${escHtml(song.date)}</span>
        </div>
        ${song.hook ? `<div class="song-hook">"${escHtml(song.hook)}"</div>` : ''}
        ${instrumentsStr ? `<div class="song-instruments">🎸 ${escHtml(instrumentsStr)}</div>` : ''}
      </div>
    </div>`;
}

/* ── Render songs list ─────────────────────────────────── */
function renderSongs(songs, containerId = 'songsGrid') {
  const grid = document.getElementById(containerId);
  const countEl = document.getElementById('songsCountBadge');
  const clearBtn = document.getElementById('clearBtn');
  const emptyState = document.getElementById('emptyState');

  if (countEl) countEl.textContent = songs.length;
  if (clearBtn) clearBtn.style.display = songs.length ? 'inline-flex' : 'none';

  if (!songs.length) {
    grid.innerHTML = containerId === 'songsGrid'
      ? `<div class="empty-state" id="emptyState">
          <div class="empty-icon">🎧</div>
          <p class="empty-title">No songs yet</p>
          <p class="empty-sub">Write some lyrics above and hit Generate!</p>
         </div>`
      : `<div class="empty-state">
          <div class="empty-icon">📂</div>
          <p class="empty-title">Library is empty</p>
          <p class="empty-sub">Generate some songs on the Create tab!</p>
         </div>`;
    return;
  }

  grid.innerHTML = `<div class="songs-grid">${songs.map(songCardHTML).join('')}</div>`;
}

/* ── Modal ─────────────────────────────────────────────── */
function openSongModal(song) {
  const isPlaying = getPlayingId() === song.id;
  const structureStr = (song.songStructure || []).join(' → ');
  const artistsStr   = (song.similarArtists || []).join(', ');

  document.getElementById('modalContent').innerHTML = `
    <p class="modal-title">${escHtml(song.title)}</p>
    <div class="modal-tags">
      <span class="tag tag--genre">${escHtml(song.genre)}</span>
      ${song.mood  ? `<span class="tag tag--mood">${escHtml(song.mood)}</span>` : ''}
      ${song.tempo ? `<span class="tag tag--tempo">${escHtml(song.tempo)}</span>` : ''}
      ${song.key   ? `<span class="tag tag--date">🎹 ${escHtml(song.key)}</span>` : ''}
    </div>

    ${song.hook ? `
    <div class="modal-section">
      <div class="modal-label">Hook / Chorus</div>
      <div class="modal-hook">"${escHtml(song.hook)}"</div>
    </div>` : ''}

    ${song.description ? `
    <div class="modal-section">
      <div class="modal-label">Description</div>
      <div class="modal-text">${escHtml(song.description)}</div>
    </div>` : ''}

    ${song.instruments?.length ? `
    <div class="modal-section">
      <div class="modal-label">Instruments</div>
      <div class="modal-instruments">
        ${song.instruments.map(i => `<span class="instr-tag">🎵 ${escHtml(i)}</span>`).join('')}
      </div>
    </div>` : ''}

    ${structureStr ? `
    <div class="modal-section">
      <div class="modal-label">Song Structure</div>
      <div class="modal-text" style="font-size:0.85rem">${escHtml(structureStr)}</div>
    </div>` : ''}

    ${artistsStr ? `
    <div class="modal-section">
      <div class="modal-label">Similar Artists</div>
      <div class="modal-text">${escHtml(artistsStr)}</div>
    </div>` : ''}

    ${song.lyricsSnippet ? `
    <div class="modal-section">
      <div class="modal-label">Your Lyrics</div>
      <div class="modal-lyrics">${escHtml(song.lyricsSnippet)}</div>
    </div>` : ''}

    <button class="modal-play-btn" onclick="handleModalPlay('${song.id}')">
      <span>${isPlaying ? '⏸' : '▶'}</span>
      <span id="modalPlayLabel">${isPlaying ? 'Pause Preview' : 'Play Audio Preview'}</span>
    </button>
  `;

  document.getElementById('modalOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ── Credits pill ──────────────────────────────────────── */
function updateCreditsPill(credits) {
  const pill = document.getElementById('creditsPill');
  const text = document.getElementById('creditsText');
  text.textContent = credits <= 0 ? 'No Credits' : `${credits} Credit${credits === 1 ? '' : 's'}`;
  pill.classList.toggle('empty', credits <= 0);
}

/* ── Escape HTML ───────────────────────────────────────── */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Tab switcher ──────────────────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.toggle('hidden', el.id !== `tab-${tab}`);
    el.classList.toggle('active', el.id === `tab-${tab}`);
  });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  if (tab === 'library') renderLibrary();
}
