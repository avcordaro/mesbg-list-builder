import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1c1c1e",
        color: "white",
        p: 1,
        textAlign: "center",
        position: "sticky",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2" sx={{ display: "block", m: 1 }}>
        Unofficial | {BUILD_VERSION} | updated {BUILD_DATE}
      </Typography>
      <Typography variant="body2" sx={{ display: "block", m: 1 }}>
        Developed by avcordaro & mhollink | © 2024
      </Typography>
    </Box>
  );
};
