/* ── audio.js — Audio playback management ────────────────── */

let _currentAudio = null;
let _playingId    = null;

function getPlayingId() { return _playingId; }

async function playSong(songId, audioUrl, onEnd) {
  // Stop current if any
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.src = '';
    _currentAudio = null;
  }

  // If same song — toggle off
  if (_playingId === songId) {
    _playingId = null;
    return false; // signal: stopped
  }

  _playingId = songId;

  const audio = new Audio(audioUrl);
  _currentAudio = audio;

  try {
    await audio.play();
  } catch (e) {
    console.warn('Audio play error:', e);
    _playingId = null;
    _currentAudio = null;
    return false;
  }

  audio.onended = () => {
    _playingId = null;
    _currentAudio = null;
    if (typeof onEnd === 'function') onEnd();
  };

  audio.onerror = () => {
    _playingId = null;
    _currentAudio = null;
    if (typeof onEnd === 'function') onEnd();
  };

  return true; // signal: playing
}

function stopAll() {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.src = '';
    _currentAudio = null;
  }
  _playingId = null;
}
