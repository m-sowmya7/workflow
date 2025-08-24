import React from "react";
import { Box, Input } from "@chakra-ui/react";

export default function SettingsPanel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Box p={3}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Text Node Settings</div>
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder="Enter message..." />
    </Box>
  );
}
