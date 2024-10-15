import { XMLParser } from "fast-xml-parser";
// import { FeedEntity } from "@/models/feed-entity";
const xmlParser = new XMLParser({ ignoreAttributes: false });
interface IdInfo {
  arxivId: string;
  doi: string;
  ElsevierPII: string;
  semanticId: string
}
interface FeedEntity {
  title: string;
  mainURL: string;
  authors: string;
  abstract: string;
  feedTime: Date;
  pubTime: string;
  arxiv: string;
  publication: string;
  ids: IdInfo;
}
export function RssParser(rawResponse: string): FeedEntity[] {
  const parsedXML = xmlParser.parse(rawResponse);

  if (parsedXML.rss && parsedXML.rss.channel && parsedXML.rss.channel.title && typeof parsedXML.rss.channel.title === 'string' && parsedXML.rss.channel.title.includes("ScienceDirect")) {
    console.log("Matched ScienceDirect format");
    const result = parseScienceDirectRSSItems((parsedXML as RSS2).rss.channel.item);
    console.log("ScienceDirect parsing result:", result);
    if (result) {
      return result as FeedEntity[];
    }
  } else if (parsedXML["rdf:RDF"]) {
    console.log("Matched RSS 1.0 format");
    const result = parseRSSItems((parsedXML as RSS1)["rdf:RDF"].item);
    console.log("RSS 1.0 parsing result:", result);
    if (result) {
      return result as FeedEntity[];
    }
  } else if (parsedXML.rss) {
    console.log("Matched RSS 2.0 format");
    const result = parseRSSItems((parsedXML as RSS2).rss.channel.item);
    console.log("RSS 2.0 parsing result:", result);
    if (result) {
      return result as FeedEntity[];
    }
  } else if (parsedXML.feed) {
    console.log("Matched Atom format");
    const result = parseAtomItems((parsedXML as Atom).feed.entry);
    console.log("Atom parsing result:", result);
    if (result) {
      return result as FeedEntity[];
    }
  } else {
    console.log("No matching format found");
    return [];
  }
  console.log("Fallback: returning empty array");
  return []
}

function parseRSSItems(items: RSSItem[]) {
  console.log(`开始解析 ${items.length} 个 RSS 项目`);
  let feedEntityDrafts: FeedEntity[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      console.log(`处理第 ${i + 1} 个项目：${item.title}`);
      let feedEntityDraft: FeedEntity = {
        title: item.title || "",
        mainURL: item.link || "",
        ids: {},
      } as FeedEntity;

      if (item.authors) {
        feedEntityDraft.authors = `${item.authors}` || "";
      } else {
        let rawAuthor = item["dc:creator"];
        let author;
        if (rawAuthor && Array.isArray(rawAuthor)) {
          author = (rawAuthor as string[])
            .join(", ")
            .replaceAll(/<[^>]*>/g, "");
        } else {
          author =
            (item["dc:creator"] as string)?.replaceAll(/<[^>]*>/g, "") || "";
        }
        feedEntityDraft.authors = author || "";
      }
      const dcDescription = item["dc:description"] || "";
      const descriptionProps = item.description || {};
      const description = typeof descriptionProps === 'object' && '#text' in descriptionProps
        ? descriptionProps["#text"]
        : `${descriptionProps}`;
      feedEntityDraft.abstract =
        (dcDescription.length > (description as string).length
          ? dcDescription
          : (description as string)) || "";

      feedEntityDraft.feedTime = new Date(item["dc:date"] || new Date());

      if (item["pubDate"]) {
        feedEntityDraft.pubTime = `${new Date(item["pubDate"]).toISOString()}`;
      } else if (item["prism:coverDate"]) {
        feedEntityDraft.pubTime = `${new Date(
          item["prism:coverDate"]
        ).toISOString()}`;
      }

      if (item.link && item.link.includes("arxiv")) {
        const arxivIds = item.link.match(
          new RegExp(
            "(\\d{4}.\\d{4,5}|[a-z\\-] (\\.[A-Z]{2})?\\/\\d{7})(v\\d )?",
            "g"
          )
        );
        if (arxivIds) {
          feedEntityDraft.arxiv = arxivIds[0] || "";
          feedEntityDraft.ids.arxivId = arxivIds[0] || "";
        }
        feedEntityDraft.publication = "arXiv";
        if (feedEntityDraft.pubTime === "") {
          feedEntityDraft.pubTime = `20${feedEntityDraft.arxiv.slice(0, 2)}`;
        }
      }
      if (item.link && item.link.includes("sciencedirect")) {
        feedEntityDraft.ids.ElsevierPII = item["prism:doi"] || "";
        feedEntityDraft.publication = item["prism:publicationName"] || "";
      }
      console.log("Processed feed entity:", feedEntityDraft);
      feedEntityDrafts.push(feedEntityDraft);
      console.log(`成功添加第 ${i + 1} 个项目`);
    } catch (error) {
      console.error(`处理第 ${i + 1} 个项目时出错:`, error);
    }
  }

  console.log(`解析完成，总共添加了 ${feedEntityDrafts.length} 个实体`);
  return feedEntityDrafts;
}
function parseAtomItems(items: AtomItem[]) {
  let feedEntityDrafts: FeedEntity[] = [];
  for (const item of items) {
    const feedEntityDraft: FeedEntity = {
      title: item.title,
    } as FeedEntity;

    if (Array.isArray(item.link)) {
      for (let i = 0; i < item.link.length; i++) {
        const link = item.link[i];
        if (
          link["@_type"] === "application/pdf" ||
          i === item.link.length - 1
        ) {
          feedEntityDraft.mainURL = link["@_href"] || "";
        }
      }
    } else {
      feedEntityDraft.mainURL = item.link["@_href"] || "";
    }

    let rawAuthor = item.author;
    let author;
    if (rawAuthor && Array.isArray(rawAuthor)) {
      author = rawAuthor
        .map((a) => a.name)
        .join(", ")
        .replaceAll(/<[^>]*>/g, "");
    } else {
      author = rawAuthor?.name?.replaceAll(/<[^>]*>/g, "") || "";
    }
    feedEntityDraft.authors = author || "";

    feedEntityDraft.abstract = item.summary || "";

    feedEntityDraft.feedTime = new Date(item["updated"] || new Date());

    if (
      feedEntityDraft.mainURL &&
      feedEntityDraft.mainURL.includes("arxiv")
    ) {
      const arxivIds = feedEntityDraft.mainURL.match(
        new RegExp(
          "(\\d{4}.\\d{4,5}|[a-z\\-] (\\.[A-Z]{2})?\\/\\d{7})(v\\d )?",
          "g"
        )
      );
      if (arxivIds) {
        feedEntityDraft.arxiv = arxivIds[0];
      }
      feedEntityDraft.publication = "arXiv";
    }

    if (item["published"]) {
      feedEntityDraft.pubTime = `${new Date(
        item["published"]
      ).getFullYear()}`;
    }
    feedEntityDrafts.push(feedEntityDraft);
  }

  return feedEntityDrafts;
}

function parseScienceDirectRSSItems(items: RSSItem[]) {
  console.log(`开始解析 ${items.length} 个 ScienceDirect 项目`);
  let feedEntityDrafts: FeedEntity[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      console.log(`处理第 ${i + 1} 个项目：${item.title}`);
      let feedEntityDraft: FeedEntity = {
        title: item.title || "",
        mainURL: item.link || "",
        feedTime: new Date(),
        ids: {},
      } as FeedEntity;

      const pii = item.link;
      if (pii) {
        feedEntityDraft.ids.ElsevierPII = pii;
      }

      if (item.description && typeof item.description === 'string') {
        const descriptionComponents = item.description.match(/<p>(.*?)<\/p>/g) || [];

        for (const component of descriptionComponents) {
          if (component.startsWith("<p>Author(s)")) {
            feedEntityDraft.authors = component.replace("<p>Author(s): ", "").replace("</p>", "");
          }
          if (component.startsWith("<p>Publication date:")) {
            const dateStr = component.replace("<p>Publication date: ", "").replace("</p>", "");
            const date = new Date(dateStr);
            feedEntityDraft.pubTime = `${date.getFullYear()}`;
          }
          if (component.startsWith("<p><b>Source")) {
            const sourceComponents = component
              .replace("<p>", "")
              .replace("</p>", "")
              .replace("<b>Source:</b> ", "")
              .split(",").map(s => s.trim());
            feedEntityDraft.publication = sourceComponents[0];
          }
        }
      }

      feedEntityDrafts.push(feedEntityDraft);
      console.log(`成功添加第 ${i + 1} 个项目`);
    } catch (error) {
      console.error(`处理第 ${i + 1} 个项目时出错:`, error);
    }
  }

  console.log(`解析完成，总共添加了 ${feedEntityDrafts.length} 个实体`);
  return feedEntityDrafts;
}

interface RSSItem {
  "dc:creator"?: string | string[];
  "dc:date"?: string;
  "dc:type"?: string;
  "dc:description"?: string;
  description?: string | { "#text": string; "@_rdf:parseType": string };
  link?: string;
  "prism:coverDate"?: string;
  "prism:doi"?: string;
  "prism:number"?: number;
  "prism:publicationName"?: string;
  "prism:url"?: string;
  "prism:volume"?: number;
  title?: string;
  pubDate?: string;
  authors?: string;
}

interface AtomItem {
  author: { name: string }[] | { name: string };
  link:
  | { "@_href": string; "@_type": string }[]
  | { "@_href": string; "@_type": string };
  id: string;
  published: string;
  summary: string;
  title: string;
  updated: string;
}

interface RSS1 {
  "rdf:RDF": {
    item: RSSItem[];
  };
}

interface RSS2 {
  rss: {
    channel: {
      item: RSSItem[];
    };
  };
}

interface Atom {
  feed: {
    entry: AtomItem[];
  };
}
