import { useSlateStatic } from "slate-react";
import { handleChange } from "../../utils/handleChange";
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
    if (bookContents && book) {
      bookContents.display();
    }
  }, [book, bookContents]);
  const htmlArray: string[] = [];
  const handleNextButton = () => {
    bookContents && bookContents.next();
    if (book) {
      const spine = book.spine;
      spine.each(async (elem: SpineItem) => {
        const section = await spine.get(elem.index);
        const contents = await section.output;
        htmlArray.push(contents);
      });
      parsingText();
    }
  };

  const parsingText = () => {
    const setArray = new Set(htmlArray);
    const filteredArray = [...setArray].filter((elem) => elem);
    const parsedArray = filteredArray.map((elem) =>
      elem.replace(/<[^>]+>/g, "")
    );
    console.log(parsedArray);
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
            <StyledButton onClick={handleNextButton}>다음 페이지</StyledButton>
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
