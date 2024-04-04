import fs from 'fs';
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
    }
    ]
});
