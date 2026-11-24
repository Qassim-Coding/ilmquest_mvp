/**
 * Lecture des audios des Noms : un seul lecteur pour toute l'app.
 *
 * - playName(id) : bouton « Écouter » d'un Nom (Liste, Cartes, fiche). Un 2e appui pendant la lecture l'arrête.
 * - startListening(ids) : « Écouter tous les noms » dans la Liste. Les Noms passent l'un après l'autre,
 *   en continu (le suivant part seul après une courte pause) ou Nom par Nom (on avance avec « Suivant »).
 *   La barre de lecture (ListenBar.tsx) pilote cette lecture : pause, précédent, suivant, fermer.
 * - useNameAudio() : l'état du lecteur pour les écrans (Nom en cours, en lecture ou en pause...).
 *
 * Seuls les Noms listés dans src/data/nameAudio.ts ont un audio (hasNameAudio).
 * Les fichiers sont dans public/audio/noms/<id>.mp3. Un fichier chargé une fois est gardé en mémoire
 * pendant la visite : réécouter un Nom ne le recharge pas.
 */
import { useSyncExternalStore } from 'react';
import { NAME_AUDIO } from '../data/nameAudio';

/** Pause entre deux Noms en lecture continue, en millisecondes */
export const GAP_BETWEEN_NAMES_MS = 1500;

/**
 * - 'playing' : un Nom est en train d'être chargé ou joué
 * - 'gap' : pause entre deux Noms (lecture continue)
 * - 'paused' : mis en pause par l'utilisateur
 * - 'idle' : rien ne joue (en mode Nom par Nom : on attend « Suivant »)
 */
export type AudioPhase = 'playing' | 'gap' | 'paused' | 'idle';

export interface NameAudioState {
  /** Nom en cours : celui qui joue, ou dans la lecture de la liste celui où l'on s'est arrêté. null = aucun */
  currentId: number | null;
  /** Lecture de la liste : les Noms à lire, dans l'ordre. null = pas de lecture de la liste */
  queue: number[] | null;
  /** Place du Nom en cours dans queue */
  index: number;
  phase: AudioPhase;
  /** true = en continu ; false = Nom par Nom. Le choix est gardé jusqu'à la fermeture de l'app. */
  continuous: boolean;
}

let state: NameAudioState = { currentId: null, queue: null, index: 0, phase: 'idle', continuous: true };
const listeners = new Set<() => void>();

function setState(patch: Partial<NameAudioState>): void {
  state = { ...state, ...patch };
  listeners.forEach(listener => listener());
}

/** Vrai si ce Nom a un audio validé */
export function hasNameAudio(id: number): boolean {
  return Object.prototype.hasOwnProperty.call(NAME_AUDIO, id);
}

/** Adresse du fichier ; ?v= change quand le fichier change (voir src/data/nameAudio.ts) */
export function nameAudioUrl(id: number): string {
  return `/audio/noms/${id}.mp3?v=${NAME_AUDIO[id] ?? ''}`;
}

// ------------------------------------------------------------------
// Lecteur
// ------------------------------------------------------------------

let player: HTMLAudioElement | null = null;
// Fichiers déjà chargés : id → adresse en mémoire
const loadedClips = new Map<number, string>();
// Chaque nouvelle lecture invalide les chargements encore en cours
let playToken = 0;
let gapTimer: ReturnType<typeof setTimeout> | null = null;
// La pause a été demandée pendant la pause entre deux Noms (et non pendant un Nom)
let pausedInGap = false;
// Fichiers qui n'ont pas pu être lus d'affilée (ex. hors ligne) : au 3e, la lecture s'arrête
let failuresInARow = 0;
let unlocked = false;

function getPlayer(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.preload = 'auto';
    player.addEventListener('ended', () => {
      // La fin du petit son silencieux de déverrouillage (voir unlock) ne compte pas
      if (player?.src.startsWith('blob:')) onClipEnded();
    });
    player.addEventListener('playing', () => {
      failuresInARow = 0;
    });
    player.addEventListener('error', () => {
      // Une erreur sur le petit son silencieux de déverrouillage ne compte pas
      if (state.phase === 'playing' && player?.src.startsWith('blob:')) onClipFailed();
    });
  }
  return player;
}

/** Son silencieux de 20 ms (WAV) */
function silentWav(): string {
  const samples = 160;
  const bytes = new Uint8Array(44 + samples);
  const view = new DataView(bytes.buffer);
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) bytes[offset + i] = value.charCodeAt(i);
  };
  text(0, 'RIFF');
  view.setUint32(4, 36 + samples, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 8000, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  text(36, 'data');
  view.setUint32(40, samples, true);
  bytes.fill(128, 44);
  let binary = '';
  bytes.forEach(byte => (binary += String.fromCharCode(byte)));
  return `data:audio/wav;base64,${btoa(binary)}`;
}

/**
 * À appeler directement dans un appui de l'utilisateur, avant tout chargement.
 * Safari (iPhone) ne laisse un lecteur jouer seul qu'après une première lecture lancée par un appui :
 * on lui fait jouer un silence au premier appui, ensuite les Noms peuvent s'enchaîner.
 */
function unlock(): void {
  if (unlocked) return;
  unlocked = true;
  const audio = getPlayer();
  audio.src = silentWav();
  audio.play().catch(() => {});
}

async function loadClip(id: number): Promise<string> {
  const loaded = loadedClips.get(id);
  if (loaded) return loaded;
  const response = await fetch(nameAudioUrl(id));
  if (!response.ok) throw new Error(`Audio du Nom ${id} : ${response.status}`);
  const url = URL.createObjectURL(await response.blob());
  loadedClips.set(id, url);
  return url;
}

function clearGap(): void {
  if (gapTimer !== null) {
    clearTimeout(gapTimer);
    gapTimer = null;
  }
}

function playClip(id: number): void {
  const token = ++playToken;
  clearGap();
  const audio = getPlayer();
  const start = (url: string) => {
    if (token !== playToken) return;
    audio.src = url;
    audio.play().catch((error: unknown) => {
      // AbortError : une autre lecture a pris la place, ce n'est pas une panne
      if (token === playToken && (error as { name?: string })?.name !== 'AbortError') onClipFailed();
    });
  };
  const loaded = loadedClips.get(id);
  // Déjà chargé : on joue tout de suite, encore dans l'appui de l'utilisateur
  if (loaded) start(loaded);
  else loadClip(id).then(start, () => token === playToken && onClipFailed());
}

function goToIndex(index: number): void {
  const queue = state.queue;
  if (!queue) return;
  const safeIndex = Math.min(Math.max(index, 0), queue.length - 1);
  pausedInGap = false;
  setState({ index: safeIndex, currentId: queue[safeIndex], phase: 'playing' });
  playClip(queue[safeIndex]);
}

/** Pause entre deux Noms, puis Nom suivant. On charge déjà le suivant pendant la pause. */
function waitThenNext(): void {
  const queue = state.queue;
  if (!queue) return;
  if (state.index >= queue.length - 1) {
    stopAudio();
    return;
  }
  setState({ phase: 'gap' });
  loadClip(queue[state.index + 1]).catch(() => {});
  clearGap();
  gapTimer = setTimeout(() => {
    gapTimer = null;
    goToIndex(state.index + 1);
  }, GAP_BETWEEN_NAMES_MS);
}

function onClipEnded(): void {
  if (state.phase !== 'playing') return;
  if (state.queue === null) {
    setState({ currentId: null, phase: 'idle' });
  } else if (state.continuous) {
    waitThenNext();
  } else {
    setState({ phase: 'idle' });
  }
}

function onClipFailed(): void {
  failuresInARow += 1;
  if (state.queue === null) {
    setState({ currentId: null, phase: 'idle' });
  } else if (state.continuous && failuresInARow < 3) {
    // Un fichier illisible : on passe au Nom suivant
    waitThenNext();
  } else {
    setState({ phase: 'idle' });
  }
}

// ------------------------------------------------------------------
// Ce que les écrans appellent
// ------------------------------------------------------------------

/**
 * Bouton « Écouter » d'un Nom.
 * Hors lecture de la liste : joue le Nom, ou l'arrête s'il est déjà en train de jouer.
 * Pendant la lecture de la liste : la lecture saute à ce Nom.
 */
export function playName(id: number): void {
  if (!hasNameAudio(id)) return;
  unlock();
  if (state.queue) {
    const index = state.queue.indexOf(id);
    if (index !== -1) {
      goToIndex(index);
      return;
    }
    stopAudio();
  }
  if (state.currentId === id && state.phase === 'playing') {
    stopAudio();
    return;
  }
  failuresInARow = 0;
  setState({ currentId: id, phase: 'playing' });
  playClip(id);
}

/** « Écouter tous les noms » : lit ces Noms dans l'ordre (seulement ceux qui ont un audio) */
export function startListening(ids: number[]): void {
  const queue = ids.filter(hasNameAudio);
  if (queue.length === 0) return;
  unlock();
  stopAudio();
  failuresInARow = 0;
  setState({ queue });
  goToIndex(0);
}

/** Bouton lecture / pause de la barre de lecture */
export function toggleListening(): void {
  if (!state.queue) return;
  unlock();
  switch (state.phase) {
    case 'playing':
      playToken++;
      getPlayer().pause();
      pausedInGap = false;
      setState({ phase: 'paused' });
      break;
    case 'gap':
      clearGap();
      pausedInGap = true;
      setState({ phase: 'paused' });
      break;
    case 'paused':
      if (pausedInGap) {
        waitThenNext();
      } else {
        // On reprend le Nom en cours depuis le début : il dure une ou deux secondes
        goToIndex(state.index);
      }
      break;
    case 'idle':
      // Nom par Nom : réécouter le Nom en cours
      goToIndex(state.index);
      break;
  }
}

export function nextName(): void {
  if (!state.queue || state.index >= state.queue.length - 1) return;
  unlock();
  goToIndex(state.index + 1);
}

export function previousName(): void {
  if (!state.queue || state.index === 0) return;
  unlock();
  goToIndex(state.index - 1);
}

/** En continu (true) ou Nom par Nom (false) */
export function setContinuous(continuous: boolean): void {
  if (continuous === state.continuous) return;
  // Passage à Nom par Nom pendant la pause entre deux Noms : on reste sur le Nom qui vient d'être lu
  if (!continuous && state.phase === 'gap') {
    clearGap();
    setState({ continuous, phase: 'idle' });
    return;
  }
  setState({ continuous });
}

/** Arrête tout : un Nom seul ou la lecture de la liste (la barre de lecture se ferme) */
export function stopAudio(): void {
  playToken++;
  clearGap();
  pausedInGap = false;
  player?.pause();
  if (state.currentId !== null || state.queue !== null || state.phase !== 'idle') {
    setState({ currentId: null, queue: null, index: 0, phase: 'idle' });
  }
}

/** État du lecteur, sans s'y abonner (hors des écrans) */
export function getNameAudioState(): NameAudioState {
  return state;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** État du lecteur ; l'écran se met à jour à chaque changement */
export function useNameAudio(): NameAudioState {
  return useSyncExternalStore(subscribe, getNameAudioState, getNameAudioState);
}

// App mise en arrière-plan (autre app, écran éteint) : la lecture de la liste se met en pause,
// un Nom seul s'arrête. Au retour, « Lecture » reprend où l'on en était.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return;
    if (state.queue && (state.phase === 'playing' || state.phase === 'gap')) toggleListening();
    else if (state.queue === null && state.phase === 'playing') stopAudio();
  });
}
