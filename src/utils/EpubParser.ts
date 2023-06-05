import JSZip from "jszip";

export const parseContentOpf = async (zippedEpub: JSZip) => {
  const contentOpf = Object.values(zippedEpub.files).find(({ name }) =>
    name.endsWith(".opf")
  );
  if (!contentOpf) {
    throw new Error("Invalid epub file");
  }
  const parsedContentOpf = new DOMParser().parseFromString(
    await contentOpf.async("string"),
    "text/xml"
  );
  const spine = parsedContentOpf.getElementsByTagName("spine").item(0);
  if (!spine) {
    throw new Error("Invalid epub file");
  }
  const order = Array.from(spine.getElementsByTagName("itemref"))
    .map((ref) => ref.getAttribute("idref"))
    .filter((idref): idref is string => !!idref);
  return {
    document: parsedContentOpf,
    order,
  };
};
