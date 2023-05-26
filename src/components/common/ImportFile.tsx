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
    // book.renderTo("area").display();
  };
  useEffect(() => {
    if (bookContents && book) {
      bookContents.display().then(() => {
        /*
        section 속성
        content : html을 string으로 변환한 상태
          document : dom 
          element : html 객체
        */
        const spine = book.spine;
        spine.each((elem: SpineItem) => {
          // console.log("spinItem Index : ", elem.index);
          // console.log("get Item on Index : ", spine.get(elem.index));
          const section = spine.get(elem.index);
          const contents = section.output;
          console.log(contents);
        });
      });
    }
  }, [book, bookContents]);
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
            <StyledButton onClick={() => bookContents && bookContents.next()}>
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
