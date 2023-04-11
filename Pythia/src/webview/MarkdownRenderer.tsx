import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  markdown: string;
  
}

const MarkdownRenderer: React.FunctionComponent<MarkdownRendererProps> = ({ markdown }) => {

  const [copyStatus, setCopyStatus] = React.useState<string>("");

  const extractTextFromReactNode = (node: React.ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
  
    if (Array.isArray(node)) {
      return node.map(extractTextFromReactNode).join('');
    }
  
    if (React.isValidElement(node) && node.props.children) {
      return extractTextFromReactNode(node.props.children);
    }
  
    return '';
  };
  

  const handleCopyClick = (content: React.ReactNode) => {
    const text = extractTextFromReactNode(content);
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard");
    });
  };


  return (
    <ReactMarkdown
      children={markdown}
      components={{
        code({ node, inline, className, children, style, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className='code-container'>
              <i className="fa-regular fa-copy copy-icon" onClick={() => handleCopyClick(children)}/>
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default MarkdownRenderer;
