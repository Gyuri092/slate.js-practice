import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { processImportedFile } from "../../utils/InsertSlate";
import { setStateFunctionType } from "../../types/type";
import { LoadEpub } from "../../utils/LoadEpub";

const menuItemCss = css`
  box-sizing: border-box;
  padding: 7px 0 7px 18px;

  color: black;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`;

const MenuSubItem = styled.div<{ minWidth?: number }>`
  ${menuItemCss};

  font-weight: 300;
  padding-left: 32px;
  cursor: pointer;
  min-width: ${(props) => props.minWidth ?? 200}px;

  &:hover {
    background-color: lightgray;
  }
`;

const MenuItemDivider = styled.div`
  margin: 7px 0;
  border-bottom: 1px solid lightgray;
`;

const FileInput = styled.input`
  display: none;
`;
const FileInputLabel = styled.label`
  display: block;
  width: 100%;
`;

export const DropDown = (props: {
  accept: string;
  setStateFunction: setStateFunctionType;
  editor: BaseEditor & ReactEditor;
}) => {
  const renderDropDown = (accept: string) => {
    switch (accept) {
      case ".txt":
        return "txt 업로드";
      case ".epub":
        return "ePub 업로드";
      case ".md":
        return "markdown 업로드";
      case ".xlsx":
        return "excel 업로드";
      default:
        break;
    }
  };

  return (
    <>
      <MenuItemDivider />
      <div css={menuItemCss}>유형 변경</div>
      <MenuSubItem>
        <FileInputLabel htmlFor="file">
          {renderDropDown(props.accept)}
        </FileInputLabel>
        <FileInput
          id="file"
          type="file"
          accept={props.accept}
          onChange={
            props.accept === ".epub"
              ? (event) => LoadEpub(event, props.editor, props.setStateFunction)
              : (event) =>
                  processImportedFile(
                    event,
                    props.editor,
                    props.setStateFunction
                  )
          }
        />
      </MenuSubItem>
      <MenuItemDivider />
    </>
  );
};
