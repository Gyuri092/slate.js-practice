import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MarkdownLoader } from "./components/markdown/MarkdownLoader";
import { TextfileLoader } from "./components/textfile/TextfileLoader";
import { EpubLoader } from "./components/epub/EpubLoader";
import { ExcelLoader } from "./components/excel/ExcelLoader";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TextfileLoader />} />
        <Route path="/markdown" element={<MarkdownLoader />} />
        <Route path="/epub" element={<EpubLoader />} />
        <Route path="/excel" element={<ExcelLoader />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
