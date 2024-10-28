import { DialogContent } from "@mui/material";
import { useAppState } from "../../../state/app";

export function ChartsModal() {
  const {
    modalContext: { selectedChart },
  } = useAppState();

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
