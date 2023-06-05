import { RenderElementProps } from "slate-react";

export const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "paragraph":
      return <p {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
