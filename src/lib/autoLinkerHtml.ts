import * as cheerio from 'cheerio';

const LINK_DICTIONARY: Record<string, string> = {
  '10th pass': '/explore/10th-pass',
  '12th pass': '/explore/12th-pass',
  'graduate': '/explore/graduate',
  'police': '/explore/police',
  'banking': '/explore/banking',
  'railway': '/explore/railway',
  'upsc': '/explore/upsc',
  'ssc': '/explore/ssc',
  'syllabus': '/syllabus',
  'admit card': '/admit-card',
  'result': '/results',
  'answer key': '/answer-key'
};

/**
 * Automatically injects internal HTML links into raw HTML text
 * while safely ignoring text that is already inside <a> tags or attributes.
 *
 * @param html The raw HTML string (e.g. description_html)
 * @returns The HTML string with auto-injected <a> tags
 */
export function autoLinker(html: string): string {
  if (!html || html.trim() === '') return html;

  try {
    // Load HTML snippet with cheerio (don't wrap in <html> or <body>)
    const $ = cheerio.load(html, null, false);
    
    // Sort dictionary keys by length descending to match longest phrases first
    // (e.g. "12th pass jobs" before "12th pass")
    const keywords = Object.keys(LINK_DICTIONARY).sort((a, b) => b.length - a.length);

    if (keywords.length === 0) return html;

    // Create a massive Regex to match any of the keywords
    // \b is a word boundary to prevent partial matches (e.g. matching "police" inside "policeman")
    const regex = new RegExp(`\\b(${keywords.map(k => escapeRegExp(k)).join('|')})\\b`, 'gi');

    // Recursive function to walk text nodes
    function traverse(node: any) {
      if (node.type === 'text') {
        const text = node.data;
        if (!text || text.trim() === '') return;

        // Don't replace if parent is already an anchor tag, or a script/style
        let parent = node.parent;
        let isInsideLink = false;
        while (parent) {
          if (parent.type === 'tag' && (parent.name === 'a' || parent.name === 'script' || parent.name === 'style' || parent.name === 'button')) {
            isInsideLink = true;
            break;
          }
          parent = parent.parent;
        }

        if (isInsideLink) return;

        // Perform replacement
        let replaced = false;
        const newHtml = text.replace(regex, (match: string) => {
          replaced = true;
          const url = LINK_DICTIONARY[match.toLowerCase()];
          if (!url) return match;
          
          // Generate a link with appropriate styling
          // We use target="_self" because it's internal
          return `<a href="${url}" class="text-blue-600 hover:underline" title="${match} Jobs">${match}</a>`;
        });

        if (replaced) {
          // Cheerio allows replacing text node with HTML via replaceWith
          $(node).replaceWith(newHtml);
        }
      } else if (node.type === 'tag') {
        // Iterate over children safely
        // Convert to array to avoid issues while modifying the tree
        const children = node.children ? [...node.children] : [];
        for (const child of children) {
          traverse(child);
        }
      }
    }

    // Start traversal from root elements
    const rootNodes = $.root()[0].children;
    if (rootNodes) {
      const children = [...rootNodes];
      for (const child of children) {
        traverse(child);
      }
    }

    return $.html();
  } catch (error) {
    console.error('Error auto-linking HTML:', error);
    // Return original HTML if parsing fails
    return html;
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
