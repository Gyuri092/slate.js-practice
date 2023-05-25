export const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "paragraph":
      return <p {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
