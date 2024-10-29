export default interface Song {
  id: string;
  name: string;
  plays: number;
  waveform: number[];
  expanded?: boolean;
  similarSongs: Song[];
}
