import { DialogContent } from "@mui/material";
import { useStore } from "../../../state/store.ts";

export function ChartsModal() {
  const {
    modalContext: { selectedChart },
  } = useStore();

  return (
    <DialogContent>
      <center>
        <img
          src={"./assets/images/charts/" + selectedChart + ".png"}
          alt={selectedChart}
          style={{
            maxWidth: "100%",
            border: "1px solid #6C757D",
          }}
        />
      </center>
    </DialogContent>
  );
}
