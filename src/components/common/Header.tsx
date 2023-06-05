import { Link } from "react-router-dom";
import styled from "@emotion/styled";

export const Header = () => {
  const location = window.location.href.slice(21, window.location.href.length);

  const linkArray = [];
  switch (location) {
    case "/":
      linkArray.push(["/markdown", "markdown 편집기로 이동하기"]);
      linkArray.push(["/epub", "epub 편집기로 이동하기"]);
      linkArray.push(["/excel", "excel 편집기로 이동하기"]);
      break;
    case "/markdown":
      linkArray.push(["/", "txt 편집기로 이동하기"]);
      linkArray.push(["/epub", "epub 편집기로 이동하기"]);
      linkArray.push(["/excel", "excel 편집기로 이동하기"]);
      break;
    case "/epub":
      linkArray.push(["/", "txt 편집기로 이동하기"]);
      linkArray.push(["/markdown", "markdown 편집기로 이동하기"]);
      linkArray.push(["/excel", "excel 편집기로 이동하기"]);
      break;
    case "/excel":
      linkArray.push(["/", "txt 편집기로 이동하기"]);
      linkArray.push(["/markdown", "markdown 편집기로 이동하기"]);
      linkArray.push(["/epub", "epub 편집기로 이동하기"]);
      break;
    default:
      return <>오류</>;
  }
  return (
    <StyledHeaderContainer>
      {linkArray.map((item) => {
        return (
          <StyledLink key={item[0]} to={item[0]}>
            {item[1]}
          </StyledLink>
        );
      })}
    </StyledHeaderContainer>
  );
};

const StyledHeaderContainer = styled.div`
  width: 700px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    font-weight: bold;
  }
`;
