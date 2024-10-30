import { SimpleTreeView, useTreeViewApiRef } from "@mui/x-tree-view";
import { BeatsListItem } from "./BeatsListItem";
import Box from "@mui/material/Box";
import Song from "./Song";
import { MouseEvent } from "react";

// recursively expand nested songs
function expandNestedSongs(
  song: Song,
  onClickCallback: (e: MouseEvent, id: string, expand: boolean) => void
): JSX.Element {
  var nestedSong: JSX.Element[] = [];
  for (const nested of song.similarSongs) {
    nestedSong.push(expandNestedSongs(nested, onClickCallback));
  }
  return nestedSong.length > 0 ? (
    <BeatsListItem song={song} onClickCallback={onClickCallback}>
      {nestedSong}
    </BeatsListItem>
  ) : (
    // NOTE: makes the jsx element's children undefined so that there will be no dropdown displayed
    <BeatsListItem song={song} />
  );
}

export default function BeatsList(props: { visibleSongs: Song[] }) {
  const apiRef = useTreeViewApiRef();
  const onClickCallback = (e: MouseEvent, id: string, expand: boolean) => {
    apiRef.current!.setItemExpansion(e, id, expand);
  };
  return (
    <Box sx={{ minHeight: 200, minWidth: 250 }}>
      <SimpleTreeView
        defaultExpandedItems={["3"]}
        expansionTrigger="iconContainer"
        apiRef={apiRef}
      >
        {props.visibleSongs.map((song) =>
          expandNestedSongs(song, onClickCallback)
        )}
      </SimpleTreeView>
    </Box>
  );
}
