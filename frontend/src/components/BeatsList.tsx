import { SimpleTreeView, useTreeViewApiRef } from "@mui/x-tree-view";
import { BeatsListItem } from "./BeatsListItem";
import Box from "@mui/material/Box";
import Song from "./Song";

// recursively expand nested songs
function expandNestedSongs(song: Song): JSX.Element {
  var nestedSong: JSX.Element[] = [];
  for (const nested of song.similarSongs) {
    nestedSong.push(expandNestedSongs(nested));
  }
  return nestedSong.length > 0 ? (
    <BeatsListItem song={song}> {nestedSong}</BeatsListItem>
  ) : (
    // NOTE: makes the jsx element's children undefined so that there will be no dropdown displayed
    <BeatsListItem song={song} />
  );
}

export default function BeatsList(props: { visibleSongs: Song[] }) {
  return (
    <Box sx={{ minHeight: 200, minWidth: 250 }}>
      <SimpleTreeView
        defaultExpandedItems={["3"]}
        expansionTrigger="iconContainer"
      >
        {props.visibleSongs.map((song) => expandNestedSongs(song))}
      </SimpleTreeView>
    </Box>
  );
}
