import { XMLParser } from "fast-xml-parser";
// import { FeedEntity } from "@/models/feed-entity";
const xmlParser = new XMLParser({ ignoreAttributes: false });
interface FeedEntity {
  title: string;
  mainURL: string;
  authors: string;
  abstract: string;
  feedTime: Date;
  pubTime: string;
  arxiv: string;
  publication: string;
  doi: string;
  volume: string;
  number: string;
}
export function RssParser(rawResponse: string) {
  const parsedXML = xmlParser.parse(rawResponse);
  if (parsedXML.rss && parsedXML.rss.channel && parsedXML.rss.channel.title && typeof parsedXML.rss.channel.title === 'string' && parsedXML.rss.channel.title.includes("ScienceDirect")) {
    return parseScienceDirectRSSItems((parsedXML as RSS2).rss.channel.item);
  } else if (parsedXML["rdf:RDF"]) {
    return parseRSSItems((parsedXML as RSS1)["rdf:RDF"].item);
  } else if (parsedXML.rss) {
    return parseRSSItems((parsedXML as RSS2).rss.channel.item);
  } else if (parsedXML.feed) {
    return parseAtomItems((parsedXML as Atom).feed.entry);
  } else {
    return [];
  }
}

function parseRSSItems(items: RSSItem[]) {
  let feedEntityDrafts: FeedEntity[] = [];
  for (const item of items) {
    let feedEntityDraft: FeedEntity = {
        title: item.title || "",
        mainURL: item.link || "",
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
      feedEntityDraft.pubTime = `${new Date(item["pubDate"]).getFullYear()}`;
    } else if (item["prism:coverDate"]) {
      feedEntityDraft.pubTime = `${new Date(
        item["prism:coverDate"]
      ).getFullYear()}`;
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
      }
      feedEntityDraft.publication = "arXiv";
      if (feedEntityDraft.pubTime === "") {
        feedEntityDraft.pubTime = `20${feedEntityDraft.arxiv.slice(0, 2)}`;
      }
    }

    feedEntityDraft.doi = item["prism:doi"] || "";
    feedEntityDraft.publication = item["prism:publicationName"] || "";
    feedEntityDraft.volume = `${item["prism:volume"]}`;
    feedEntityDraft.number = `${item["prism:number"]}`;

    feedEntityDrafts.push(feedEntityDraft);
  }

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
  let feedEntityDrafts: FeedEntity[] = [];
  for (const item of items) {
    let feedEntityDraft: FeedEntity = {
      title: item.title || "",
      mainURL: item.link || "",
      authors: "",
      abstract: "",
      feedTime: new Date(),
      pubTime: "",
      arxiv: "",
      publication: "",
      doi: "",
      volume: "",
      number: ""
    };

    if (item.description) {
      // get field between <p> </p>
      const descriptionComponents = (item.description as string).match(
        /<p>(.*?)<\/p>/g
      ) || [];

      for (const component of descriptionComponents) {
        if (component.startsWith("<p>Author(s)")) {
          feedEntityDraft.authors = component.replaceAll("<p>Author(s): ", "").replaceAll("</p>", "")
        }
        if (component.startsWith("<p>Publication date:")) {
          const dateStr = component.replaceAll("<p>Publication date: ", "").replaceAll("</p>", "")
          const date = new Date(dateStr)
          feedEntityDraft.pubTime = `${date.getFullYear()}`
        }
        if (component.startsWith("<p><b>Source")) {
          const sourceComponents = component
            .replaceAll("<p>", "")
            .replaceAll("</p>", "")
            .replace("<b>Source:</b> ", "")
            .split(",").map(s => s.trim())
          feedEntityDraft.publication = sourceComponents[0]
          for (const sourceComponent of sourceComponents.slice(1)) {
            if (sourceComponent.startsWith("Volume")) {
              feedEntityDraft.volume = sourceComponent.replace("Volume ", "")
            }
            if (sourceComponent.startsWith("Issue")) {
              feedEntityDraft.number = sourceComponent.replace("Issue ", "")
            }
          }
        }
      }
    }
    feedEntityDrafts.push(feedEntityDraft);
  }

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

