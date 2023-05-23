import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TextfileLoader } from "./components/TextfileLoader";
import { MarkdownLoader } from "./components/MarkdownLoader";

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
