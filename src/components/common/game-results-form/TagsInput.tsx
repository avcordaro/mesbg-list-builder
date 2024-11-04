import { TextField, Chip, Box } from "@mui/material";
import { useState, KeyboardEvent, FunctionComponent } from "react";

type AdditionalTagsInputProps = {
  values: string[];
  onChange: (values: string[]) => void;
};

export const AdditionalTagsInput: FunctionComponent<
  AdditionalTagsInputProps
> = ({ values: tags, onChange }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["Enter", ",", ";", "Tab"].includes(e.key) && input.trim() !== "") {
      e.preventDefault();
      onChange([...tags, input.trim()]);
      setInput("");
    }
  };

  const handleDelete = (tagToDelete: string) => {
    onChange(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {tags.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDelete(tag)}
              variant="filled"
            />
          ))}
        </Box>
      )}
      <TextField
        variant="outlined"
        placeholder="Add additional tags"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ mt: 1 }}
        size="small"
      />
    </Box>
  );
};
