import fetchElsevierDataByPII from "./Elsevier";
interface IdInfo {
    arxivId: string;
    doi: string;
    ElsevierPII: string;
    semanticId: string
  }
interface ScrapeMetadataProps {
    ids: IdInfo;
    publication: string;
}
export default function ScrapeMetadata(props: ScrapeMetadataProps) {
  if (props.publication === "Elsevier") {
    return fetchElsevierDataByPII(props.ids.ElsevierPII);
  }
  return null;
}

