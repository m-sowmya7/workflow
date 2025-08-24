import { ChakraProvider } from "@chakra-ui/react";
import { ReactFlowProvider } from "reactflow";
import { Workflow } from "./Workflow/Workflow";

function App() {
  return (
    <ChakraProvider>
      <ReactFlowProvider>
        <Workflow />
      </ReactFlowProvider>
    </ChakraProvider>
  );
}

export default App;
