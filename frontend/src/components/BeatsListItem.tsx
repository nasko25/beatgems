import { useState, forwardRef } from "react";
import {
  useTreeItem2,
  UseTreeItem2Parameters,
} from "@mui/x-tree-view/useTreeItem2";

import { Play, Pause, Upload } from "lucide-react";
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
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import Song from "./Song";
import AudioPlayer from "./AudioPlayer";
import UploadModal from "./FileUpload";

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, "rootRef" | "itemId" | "label">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {
  song: Song;
  onClickCallback?: any; // TODO: type
}

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

export const BeatsListItem = forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, disabled, children, song, onClickCallback, ...other } = props;

  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <TreeItem2Provider itemId={song.id}>
        <TreeItem2Root
          {...getRootProps(other)}
          style={{ backgroundColor: "#e5e7eb" }}
        >
          <CustomTreeItemContent
            {...getContentProps()}
            style={{ paddingBottom: 0, backgroundColor: "white" }}
          >
            <div
              key={song.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] song-item items-center border-b border-muted hover:bg-muted/50 w-full select-none"
              onClick={(e) => {
                onClickCallback?.(e, song.id, !status.expanded);
              }}
            >
              <div className="w-full max-w-96">
                <AudioPlayer title={song.name} src={song.url} />
              </div>
              {/* <div className="font-medium">{song.name}</div> */}
              {/* should somehow be able to indicate which beats have a very good human-created beat.
            Maybe instead of plays this number could be next to the dropdown arrow and could indicate how liked the beats originating
            from this AI beat are? Maybe like a sum => higher is better. And could be sorted based on that. */}
              <div className="text-sm text-muted-foreground ml-auto">
                {song.plays}
              </div>
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
                <Button
                  size="sm"
                  variant="dark"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                  }}
                >
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
      <UploadModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
});
