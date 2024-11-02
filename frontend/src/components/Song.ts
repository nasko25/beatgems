export default interface Song {
  id: string;
  name: string;
  plays: number;
  url: string;
  expanded?: boolean;
  similarSongs: Song[];
}
