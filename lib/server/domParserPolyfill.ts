import "server-only";

class MinimalDOMParser {
  parseFromString(markup: string) {
    const text = String(markup);
    const plainText = text.replace(/<[^>]*>/g, "");

    return {
      body: {
        innerHTML: text,
        textContent: plainText,
      },
      documentElement: {
        innerHTML: text,
        textContent: plainText,
      },
    } as unknown as Document;
  }
}

const globalForDomParser = globalThis as typeof globalThis & {
  DOMParser?: typeof DOMParser;
};

if (!globalForDomParser.DOMParser) {
  globalForDomParser.DOMParser =
    MinimalDOMParser as unknown as typeof DOMParser;
}
