
import sanitizeHtml from 'sanitize-html';
import { Schema } from '@sanity/schema';
import { htmlToBlocks, getBlockContentFeatures } from '@sanity/block-tools';
import { JSDOM } from 'jsdom';

// Start with compiling a schema we can work against
const defaultSchema = Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Title',
          type: 'string',
          name: 'title',
        },
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    },
  ],
});

// The compiled schema type for the content type that holds the block array
const blockContentType = defaultSchema.get('blogPost').fields.find((field) => field.name === 'body').type;

const filePath = './pages.json';

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  const json = JSON.parse(data);

  const pages = json.rss.channel.item;

  // Log the entries
  // console.log(pages);

  // Example: Accessing entries
  pages.forEach((page) => {
    const pageContent = page.encoded[0].__cdata;
    const clean = sanitizeHtml(pageContent, {
      nonBooleanAttributes: ['*'],
    });

    const cleanedContent = clean.replace(/<p>\\s*<\\/p>|<div>\\s*<\\/div>|<section>\\s*<\\/section>|<article>\\s*<\\/article>/g, '').replace(/^\\s*\\n/gm, '');

    const document = {
      title: page.title,
      content: htmlToBlocks(cleanedContent, blockContentType, {
        parseHtml: (html) => new JSDOM(html).window.document,
      }),
    };
    console.log(document);
  });
});
