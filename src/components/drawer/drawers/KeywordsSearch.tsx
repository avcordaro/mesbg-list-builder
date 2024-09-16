import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Fragment, useState } from "react";
import keywords from "../../../assets/data/keywords.json";

export const KeywordsSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keywordList, setKeywordList] = useState(keywords);
  const theme = useTheme();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const newKeywordList = keywords.filter((kw) =>
      kw.name.toLowerCase().includes(e.target.value.trim().toLowerCase()),
    );
    setKeywordList(newKeywordList);
  };

  const chips = {
    special_rule: (
      <Chip
        label="Special Rule"
        sx={{
          background: theme.palette.secondary.light,
        }}
      />
    ),
    magical_power: (
      <Chip
        label="Magical Power"
        sx={{
          background: theme.palette.info.light,
        }}
      />
    ),
    heroic_action: (
      <Chip
        label="Heroic Action"
        sx={{
          background: theme.palette.success.light,
        }}
      />
    ),
  };

  return (
    <Fragment>
      <Typography variant="body2">
        Use the search bar below to find definitions for special rules, heroic
        actions and magical powers that you see on profile cards.
      </Typography>
      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search..."
        />
      </Box>
      {keywordList.map((kw) => (
        <Fragment key={kw.name}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1" component="div">
                {kw.name} {chips[kw.type]}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <span
                  dangerouslySetInnerHTML={{
                    __html: kw.description.replaceAll("\n", "<br />"),
                  }}
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Fragment>
      ))}
    </Fragment>
  );
};
