import { useState, forwardRef } from "react";
import {
  useTreeItem2,
  UseTreeItem2Parameters,
} from "@mui/x-tree-view/useTreeItem2";

import { Play, Pause } from "lucide-react";
import Button from "react-bootstrap/Button";
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2GroupTransition,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2Checkbox,
} from "@mui/x-tree-view/TreeItem2";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import Song from "./Song";
import zIndex from "@mui/material/styles/zIndex";

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, "rootRef" | "itemId" | "label">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {
  song: Song;
}

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

export const BeatsListItem = forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, disabled, children, song, ...other } = props;

  const [playingSong, setPlayingSong] = useState<string | null>(null);

  console.log("children of " + song.name + ": " + children);
  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem2({
    id,
    itemId: song.id,
    children,
    label: song.name,
    disabled,
    rootRef: ref,
  });

  const togglePlay = (id: string) => {
    setPlayingSong(playingSong === id ? null : id);
  };

  return (
    <TreeItem2Provider itemId={song.id}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <div
            key={song.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 items-center border-b border-muted hover:bg-muted/50 w-full"
          >
            <Button variant="ghost" onClick={() => togglePlay(song.id)}>
              {playingSong === song.id ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <svg className="w-auto h-12" viewBox="0 0 100 20">
              {song.waveform.map((value, index) => (
                <rect
                  key={index}
                  x={index * 2}
                  y={10 - value / 2}
                  width="1"
                  height={value}
                  fill="currentColor"
                  className="text-primary"
                />
              ))}
            </svg>
            {/* <div className="font-medium">{song.name}</div> */}
            {/* should somehow be able to indicate which beats have a very good human-created beat.
            Maybe instead of plays this number could be next to the dropdown arrow and could indicate how liked the beats originating
            from this AI beat are? Maybe like a sum => higher is better. And could be sorted based on that. */}
            <div className="text-sm text-muted-foreground">{song.plays}</div>
            <div className="flex space-x-2">
              {/* <Button
                size="sm"
                variant={likes[song.id] ? "default" : "outline"}
                onClick={() => handleLike(song.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button
                size="sm"
                variant={dislikes[song.id] ? "default" : "outline"}
                onClick={() => handleDislike(song.id)}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Dislike
              </Button> */}
              <Button size="sm" variant="dark">
                Improve
              </Button>
            </div>
            {/* <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  Similar <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-2 space-y-2">
                  {song.similarSongs.map((similarSong) => (
                    <li
                      key={similarSong.id}
                      className="text-sm text-muted-foreground"
                    >
                      {similarSong.name}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible> */}
            <TreeItem2IconContainer {...getIconContainerProps()}>
              <TreeItem2Icon status={status} />
            </TreeItem2IconContainer>
          </div>
        </CustomTreeItemContent>
        {children && (
          <TreeItem2GroupTransition {...getGroupTransitionProps()} />
        )}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});
