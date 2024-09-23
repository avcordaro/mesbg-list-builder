import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BugReportIcon from "@mui/icons-material/BugReport";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SecurityIcon from "@mui/icons-material/Security";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import changelog from "../../../../CHANGELOG.json";

type Version = string;

// Inspired by https://keepachangelog.com/en/1.1.0/
type ReleaseNotes = {
  added?: string[];
  changed?: string[];
  bugfixes?: string[];
  security?: string[];
};

const releases: Record<Version, ReleaseNotes> = changelog;

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
          {Object.entries(releaseNotes).length === 0 ? (
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                display: "flex",
                gap: 1.5,
                mt: 1,
              }}
            >
              <QuestionMarkIcon /> No changes...
            </Typography>
          ) : (
            Object.entries(releaseNotes).map(([section, items]) => (
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
            ))
          )}
        </Box>
      );
    })}
  </Stack>
);
