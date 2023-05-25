import { useSlateStatic } from "slate-react";
import { handleChange } from "../../utils/handleChange";
import { setStateFunctionType } from "../../types/type";
import styled from "styled-components";
import ePub, { Rendition } from "epubjs";
import { useEffect, useState } from "react";

export const ImportFile = (props: {
  accept: string;
  setStateFunction: setStateFunctionType;
}) => {
  const editor = useSlateStatic();
  const [bookContents, setBookContents] = useState<Rendition | null>(null);

  const handleEpub = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) {
      return;
    }
    const [file] = files;
    if (!file) {
      return;
    }
    const book = await file
      .arrayBuffer()
      .then((buffer: ArrayBuffer) => ePub(buffer));

    setBookContents(book.renderTo("area"));
    book.renderTo("area").display();
  };
  useEffect(() => {
    if (bookContents) {
      bookContents.display().then((contents) => console.log(contents));
      // 여기서부터 생각해보기. 렌더링된 페이지의 text만을 추출하는 메소드가있는지 확인해보고 없으면 html객체라도 받을수있게 해보기.
    }
  }, [bookContents]);

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
