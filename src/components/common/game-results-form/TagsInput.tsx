import { TextField, Chip, Box } from "@mui/material";
import { useState, KeyboardEvent, FunctionComponent, FormEvent } from "react";

type AdditionalTagsInputProps = {
  values: string[];
  onChange: (values: string[]) => void;
};

export const AdditionalTagsInput: FunctionComponent<
  AdditionalTagsInputProps
> = ({ values: tags, onChange }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["Enter", "Tab"].includes(e.key) && input.trim() !== "") {
      e.preventDefault();
      onChange([...tags, input.trim()]);
      setInput("");
    }
  };

  const handleOnInput = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    const value: string = e.target["value"];
    const lastChar = value[value.length - 1];
    if ([",", ";"].includes(lastChar)) {
      onChange([...tags, input.trim()]);
      // Set timeout allows us to wait for 1 javascript event cycle and update the state directly after.
      setTimeout(() => setInput(() => ""));
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
        placeholder="Comma sperated tags"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onInput={handleOnInput}
        onKeyDown={handleKeyDown}
        sx={{ mt: 1 }}
        size="small"
      />
    </Box>
  );
};
