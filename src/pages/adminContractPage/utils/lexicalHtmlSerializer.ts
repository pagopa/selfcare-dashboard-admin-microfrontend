import {
  $getRoot,
  TextNode,
  ElementNode,
  LineBreakNode,
  LexicalEditor,
} from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LinkNode } from '@lexical/link';
import { ListNode } from '@lexical/list';

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

function getStyleAttribute(node: any): string {
  const style = node.getStyle?.();
  return style ? ` style="${style}"` : '';
}

function getClassAttribute(className: string): string {
  return className ? ` class="${className}"` : '';
}

export function $generateHtmlFromLexicalContent(editor: LexicalEditor): string {
  // eslint-disable-next-line functional/no-let
  let html = '';

  editor.read(() => {
    const root = $getRoot();
    html = serializeNode(root);
  });

  return html;
}

function serializeTextNode(node: TextNode): string {
  const escaped = escapeHtml(node.getTextContent());
  const formats = [
    ['bold', '<strong>', '</strong>'],
    ['italic', '<em>', '</em>'],
    ['underline', '<u>', '</u>'],
    ['strikethrough', '<s>', '</s>'],
    ['code', '<code>', '</code>'],
  ];

  let html = formats.reduce((text, [format, open, close]) => {
    if (node.hasFormat(format as any)) {
      return `${open}${text}${close}`;
    }
    return text;
  }, escaped);

  const style = node.getStyle?.();
  if (style) {
    html = `<span style="${style}">${html}</span>`;
  }

  return html;
}

function serializeElementNode(node: ElementNode): string {
  const children = node.getChildren().map(child => serializeNode(child)).join('');
  const type = node.getType();

  if (type === 'root') {
    return children;
  }

  if (type === 'paragraph') {
    const style = getStyleAttribute(node);
    return `<p${style}>${children}</p>`;
  }

  if (type === 'listitem') {
    const style = getStyleAttribute(node);
    return `<li${style}>${children}</li>`;
  }

  const elementMap: Record<string, [string, string]> = {
    quote: ['blockquote', 'editor-quote'],
    ul: ['ul', 'editor-ul'],
    ol: ['ol', 'editor-ol'],
  };

  const [tag, className] = elementMap[type] || ['div', ''];
  const classAttr = getClassAttribute(className);
  const style = getStyleAttribute(node);
  return `<${tag}${classAttr}${style}>${children}</${tag}>`;
}

function serializeNode(node: any): string {
  if (!node) {
    return '';
  }

  if (node instanceof TextNode) {
    return serializeTextNode(node);
  }

  if (node instanceof LinkNode) {
    const url = node.getURL();
    const children = node.getChildren().map(child => serializeNode(child)).join('');
    const style = getStyleAttribute(node);
    return `<a href="${url}"${style}>${children}</a>`;
  }

  if (node instanceof HeadingNode) {
    const tag = node.getTag();
    const level = tag.charAt(1);
    const className = `editor-h${level}`;
    const children = node.getChildren().map(child => serializeNode(child)).join('');
    const classAttr = getClassAttribute(className);
    const style = getStyleAttribute(node);
    return `<h${level}${classAttr}${style}>${children}</h${level}>`;
  }

  if (node instanceof QuoteNode) {
    const children = node.getChildren().map(child => serializeNode(child)).join('');
    const classAttr = getClassAttribute('editor-quote');
    const style = getStyleAttribute(node);
    return `<blockquote${classAttr}${style}>${children}</blockquote>`;
  }

  if (node instanceof ListNode) {
    const children = node.getChildren().map(child => serializeNode(child)).join('');
    const listType = node.getListType();
    const tag = listType === 'bullet' ? 'ul' : 'ol';
    const className = listType === 'bullet' ? 'editor-ul' : 'editor-ol';
    const classAttr = getClassAttribute(className);
    const style = getStyleAttribute(node);
    return `<${tag}${classAttr}${style}>${children}</${tag}>`;
  }

  if (node instanceof LineBreakNode) {
    return '<br />';
  }

  if (node instanceof ElementNode) {
    return serializeElementNode(node);
  }

  return '';
}
