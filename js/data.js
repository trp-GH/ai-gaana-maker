/* ── data.js — All static app data ──────────────────────── */

const GENRES = [
  'Bollywood', 'Pop', 'Rock', 'Rap / Hip-Hop',
  'Ghazal', 'Qawwali', 'EDM', 'Bhajan',
  'Classical', 'Punjabi Folk', 'Romantic', 'Sad',
  'House', 'Techno'
];

const MOODS = [
  '😢 Sad', '😊 Happy', '🔥 Intense', '💕 Romantic',
  '😤 Angry', '✨ Dreamy', '🌙 Melancholic', '🎉 Celebratory'
];

const AUDIO_SAMPLES = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
];

const STATUS_MESSAGES = [
  'Analyzing your lyrics...',
  'Detecting mood and emotion...',
  'Crafting melody structure...',
  'Selecting instruments for the genre...',
  'Writing your hook line...',
  'Finalizing the song concept...',
];

const STORAGE_KEY_SONGS    = 'gaana_songs_v1';
const STORAGE_KEY_CREDITS  = 'gaana_credits_v1';
const FREE_CREDITS         = 5;
