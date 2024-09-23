import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BugReportIcon from "@mui/icons-material/BugReport";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import SecurityIcon from "@mui/icons-material/Security";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Version = string;

// Inspired by https://keepachangelog.com/en/1.1.0/
type ReleaseNotes = {
  added?: string[];
  changed?: string[];
  bugfixes?: string[];
  security?: string[];
};

const releases: Record<Version, ReleaseNotes> = {
  "6.4": {
    added: [
      "Added extra warning messages to indicate required warband sizes for heroless warbands in the following armies: Wildmen of Druadan, Dark denizens of Mirkwood & Sharkey's Rogues.",
    ],
    bugfixes: [
      "Fixed a typo in the keywords of the Dernhelm and Rider of Rohan profile cards.",
      "Fixed an issue with the unit selector after importing a roster from file/json",
      "Fixed incorrectly deselect-able options for certain legendary legions",
    ],
  },
  "6.3": {
    changed: [
      "Updated the text share format to fit Reddit formatting even better",
    ],
  },
};

const sectionIcons = {
  added: <AutoAwesomeIcon />,
  changed: <PublishedWithChangesIcon />,
  bugfixes: <BugReportIcon />,
  security: <SecurityIcon />,
};

export const Changelog = () => (
  <Stack spacing={2}>
    {Object.entries(releases).map(([version, releaseNotes]) => {
      return (
        <Box key={version}>
          <Typography variant="h6" fontWeight="bolder">
            Release {version}
          </Typography>
          {Object.entries(releaseNotes).map(([section, items]) => (
            <Box key={`${version}-${section}`}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  gap: 1.5,
                  mt: 1,
                }}
              >
                {sectionIcons[section]} {section}
              </Typography>
              <ul style={{ marginLeft: "1rem" }}>
                {items.map((item, index) => (
                  <li key={`${version}-${section}-item-${index}`}>{item}</li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>
      );
    })}
  </Stack>
);
