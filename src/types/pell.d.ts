declare module 'pell' {
  export type PellEditor = {
    content: HTMLDivElement;
  };

  export type PellOptions = {
    element: HTMLElement;
    defaultParagraphSeparator?: string;
    actions?: Array<string>;
    onChange: (html: string) => void;
  };

  const pell: {
    init: (options: PellOptions) => PellEditor;
    exec: (command: string, value?: string) => void;
  };

  export default pell;
}
