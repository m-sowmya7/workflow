import { Button } from "@chakra-ui/react";

export default function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button colorScheme="blue" onClick={onClick} w="100%" mt={4}>
      Save Flow
    </Button>
  );
}
