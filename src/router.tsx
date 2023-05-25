import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MarkdownLoader } from "./components/markdown/MarkdownLoader";
import { TextfileLoader } from "./components/textfile/TextfileLoader";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TextfileLoader />} />
        <Route path="/markdown" element={<MarkdownLoader />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
