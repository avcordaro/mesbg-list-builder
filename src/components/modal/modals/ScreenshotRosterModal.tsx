import { DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useStore } from "../../../state/store.ts";

export const ScreenshotRosterModal = () => {
  const { modalContext } = useStore();

  return (
    <DialogContent sx={{ mt: -4 }}>
      <Typography variant="subtitle2">
        The following is a screenshot image of your roster list which you can
        download, or copy to your clipboard as you wish.
      </Typography>
      {modalContext.screenshot != null && (
        <img
          src={modalContext.screenshot}
          alt="roster screenshot"
          style={{
            margin: "1rem 0",
            border: "1px solid black",
            boxShadow: "1px 1px 5px 0px #000000AA",
          }}
        />
      )}
    </DialogContent>
  );
};
