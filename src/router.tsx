import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TextfileLoader } from "./components/TextfileLoader";
import { MarkdownLoader } from "./components/MarkdownLoader";

const Router = () => {
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "markdown 텍스트를 수정해보세요." }],
    },
  ];
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
