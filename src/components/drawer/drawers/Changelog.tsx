import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BugReportIcon from "@mui/icons-material/BugReport";
import DeleteIcon from "@mui/icons-material/Delete";
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
  removed?: string[];
};

const releases: Record<Version, ReleaseNotes> = changelog;

const sectionIcons = {
  added: <AutoAwesomeIcon />,
  changed: <PublishedWithChangesIcon />,
  bugfixes: <BugReportIcon />,
  security: <SecurityIcon />,
  removed: <DeleteIcon />,
};

export const Changelog = () => {
  return (
    <Stack
      spacing={2}
      sx={{
        pb: 10,
      }}
    >
      {Object.entries(releases).map(
        ([version, releaseNotes], _, allReleases) => {
          const sections = Object.entries(releaseNotes);
          if (version === "main" && sections.length === 0) return <></>;
          return (
            <Box key={version}>
              <Typography variant="h6" fontWeight="bolder">
                {version === "main"
                  ? `Post-release ${allReleases[1][0]} updates`
                  : `Release ${version}`}
              </Typography>
              {sections.length === 0 ? (
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
                sections.map(([section, items]) => (
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
                        <li
                          key={`${version}-${section}-item-${index}`}
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      ))}
                    </ul>
                  </Box>
                ))
              )}
            </Box>
          );
        },
      )}
    </Stack>
  );
};
