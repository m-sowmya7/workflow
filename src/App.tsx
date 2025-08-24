import { ChakraProvider } from "@chakra-ui/react";
import { ReactFlowProvider } from "reactflow";
import { Toaster } from "react-hot-toast";
import { Workflow } from "./Workflow/Workflow";

function App() {
  return (
    <ChakraProvider>
      <ReactFlowProvider>
        <Workflow />
        <Toaster />
      </ReactFlowProvider>
    </ChakraProvider>
  );
}

export default App;
