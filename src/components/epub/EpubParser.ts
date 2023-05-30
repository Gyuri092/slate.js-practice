import JSZip from "jszip";
// Filter Example: https://gist.github.com/hmmhmmhm/f1383a32b904e85cc7b352ad49a8c8e9
// import { applyFilters } from './filter'

export interface ICollectedFile {
  fileName: string;
  fileExt: string;
  filePaths: string[];
  originName: string;
  file: JSZip.JSZipObject;
}

export interface ICollectedData {
  containerXML: string;
  files: ICollectedFile[];
}

/**
 * EPUB 파일을 읽어옵니다.
 */
export const parse = async <T extends ArrayBufferLike>(rawEPUB: T) => {
  const zip = new JSZip();
  await zip.loadAsync(rawEPUB);
  return zip;
};

/**
 * EPUB 파일 버퍼를 생성한 후 내보냅니다.
 */
export const pack = <T extends JSZip>(container: T) => {
  return container.generateAsync({
    compression: "DEFLATE",
    mimeType: "application/epub+zip",
    type: "uint8array",
  });
};

export const getContainerXML = async <T extends JSZip>(epubContainer: T) => {
  const raw = epubContainer.file("META-INF/container.xml");
  if (!raw) throw new Error("Not Matchable");
  return await raw.async("string");
};

/**
 * 최적화를 진행합니다.
 */
export const ignite = async (originEPUBBuffer: ArrayBufferLike) => {
  // EPUB 파일을 해석합니다.
  const epubContainer = await parse(originEPUBBuffer);

  // 필요한 데이터를 수집합니다.
  const data = await collect(epubContainer);

  // 필터들을 적용합니다.
  // await applyFilters({
  //   container: epubContainer,
  //   data,
  //   option: {
  //     styleType: 'basic',
  //   },
  //   state,
  // })
  // return data;
  // EPUB 파일을 시리얼라이즈 합니다.
  return await pack(epubContainer);
};

/**
 * 필요한 데이터들을 획득합니다.
 */
export const collect = async (
  epubContainer: JSZip
): Promise<ICollectedData> => {
  // 필요한 데이터를 수집합니다.
  const containerXML = await getContainerXML(epubContainer);

  // 수집된 데이터들
  const files: ICollectedFile[] = [];

  for (const file of Object.values(epubContainer.files)) {
    // 폴더 자체는 수정하지 않습니다.
    if (file.dir) continue;

    // 경로를 파싱합니다.
    const filePaths = file.name.split("/");
    const fileFullName = filePaths[filePaths.length - 1];
    const [fileName, fileExt] = fileFullName.split(".");

    // 오직 OEBPS 폴더 내 파일만 분석합니다.
    // Open eBook Publication Structure (OEBPS)
    if (filePaths[0] !== "OEBPS") continue;

    // root 폴더와 파일명을 경로에서 제외합니다.
    filePaths.shift();
    filePaths.pop();

    files.push({
      file,
      fileExt,
      originName: file.name,
      fileName,
      filePaths,
    });
  }

  return { containerXML, files };
};
