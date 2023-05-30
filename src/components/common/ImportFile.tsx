import { useSlateStatic } from "slate-react";
import { handleChange, insertFile } from "../../utils/handleChange";
import { setStateFunctionType } from "../../types/type";
import styled from "styled-components";
import ePub, { Book, Rendition } from "epubjs";
import { useEffect, useState } from "react";
import { SpineItem } from "epubjs/types/section";

export const ImportFile = (props: {
  accept: string;
  setStateFunction: setStateFunctionType;
}) => {
  const editor = useSlateStatic();
  const [bookContents, setBookContents] = useState<Rendition | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [importText, setImportText] = useState("");

  const handleEpub = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) {
      return;
    }
    const [file] = files;
    if (!file) {
      return;
    }
    const ePubs = await file
      .arrayBuffer()
      .then((buffer: ArrayBuffer) => ePub(buffer));

    setBookContents(ePubs.renderTo("area"));
    setBook(ePubs);
  };

  useEffect(() => {
    if (book && bookContents) {
      bookContents.display();
    }
  }, [book, bookContents]);

  const htmlArray: string[] = [];
  const handleNextButton = async (setStateFunction: setStateFunctionType) => {
    if (book && bookContents) {
      bookContents.next();
      const spine = book.spine;
      await spine.each((elem: SpineItem) => {
        const section = spine.get(elem.index);
        const contents = section.output;
        htmlArray.push(contents);
      });
      await parsingPlainText();
      await insertFile(editor, importText, setStateFunction);
    }
  };

  const parsingPlainText = () => {
    const setArray = new Set(htmlArray);
    const filteredArray = [...setArray].filter((elem) => elem !== undefined);
    const parsedArray = filteredArray.map((elem) =>
      elem.replace(/<[^>]+>/g, "")
    );
    setImportText(parsedArray.join("\n"));
  };

  return (
    <>
      <input
        type="file"
        accept={props.accept}
        onChange={
          props.accept === ".epub"
            ? () => handleEpub(event)
            : () => handleChange(event, editor, props.setStateFunction)
        }
      />
      {props.accept === ".epub" ? (
        <>
          <StyledButtonContainer>
            <StyledButton onClick={() => bookContents && bookContents.prev()}>
              이전 페이지
            </StyledButton>
            <StyledButton
              onClick={() => handleNextButton(props.setStateFunction)}
            >
              다음 페이지
            </StyledButton>
          </StyledButtonContainer>
          <StyledEpubArea id="area" />
        </>
      ) : null}
    </>
  );
};

const StyledButtonContainer = styled.div`
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const StyledButton = styled.button`
  width: auto;
  height: 40px;
  background-color: gray;
  cursor: pointer;
  &:hover {
    background-color: pink;
  }
`;

const StyledEpubArea = styled.div`
  width: auto;
  height: auto;
  border: 1px solid black;
`;
