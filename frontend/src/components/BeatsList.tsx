import { SimpleTreeView } from "@mui/x-tree-view";
import { BeatsListItem } from "./BeatsListItem";
import Box from "@mui/material/Box";

export default function BeatsList() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 250 }}>
      <SimpleTreeView defaultExpandedItems={["3"]}>
        <BeatsListItem itemId="1" label="Amelia Hart">
          <BeatsListItem itemId="2" label="Jane Fisher" />
        </BeatsListItem>
        <BeatsListItem itemId="3" label="Bailey Monroe">
          <BeatsListItem itemId="4" label="Freddie Reed" />
          <BeatsListItem itemId="5" label="Georgia Johnson">
            <BeatsListItem itemId="6" label="Samantha Malone" />
          </BeatsListItem>
        </BeatsListItem>
      </SimpleTreeView>
    </Box>
  );
}
