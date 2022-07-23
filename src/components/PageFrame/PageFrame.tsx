import { observer } from "mobx-react";
import { Box } from "@mui/material";
import { Footer } from "../Footer/Copyright";
import { arrangementPageSubTabs, SubTab } from "../../interfaces/pages.meta";
import { Header } from "./Header";

interface PageBaseProps {
  pageComponent: React.ElementType;
  subtabs: SubTab[];
}

export const PageFrame = observer((props: PageBaseProps) => {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* ******** BLUE HEADER **********  */}
      <Header subTabs={props.subtabs} />

      {/* ********* MAIN BODY ***********  */}
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}>
        {<props.pageComponent />}
      </Box>

      {/* ********* FOOTER **************  */}
      <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
        <Footer />
      </Box>
    </Box>
  );
});
