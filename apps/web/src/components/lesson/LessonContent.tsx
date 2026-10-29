function renderInline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={`${keyPrefix}-${index}`} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={`${keyPrefix}-${index}`} className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-neon-cyan">{part.slice(1, -1)}</code>;
    return part;
  });
}

export function LessonContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks = [];
  let codeLines: string[] | null = null;

  for (const [index, line] of lines.entries()) {
    if (line.trim().startsWith('```')) {
      if (codeLines) {
        blocks.push(<pre key={`code-${index}`} className="overflow-x-auto rounded-xl bg-[#060914] p-4 font-mono text-sm leading-6 text-emerald-200"><code>{codeLines.join('\n')}</code></pre>);
        codeLines = null;
      } else {
        codeLines = [];
      }
      continue;
    }
    if (codeLines) {
      codeLines.push(line);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const Tag = heading[1].length === 1 ? 'h2' : heading[1].length === 2 ? 'h3' : 'h4';
      blocks.push(<Tag key={`heading-${index}`} className="pt-2 font-semibold text-white">{renderInline(heading[2], `heading-${index}`)}</Tag>);
    } else if (line.startsWith('- ')) {
      blocks.push(<p key={`list-${index}`} className="pl-4 before:mr-2 before:text-neon-cyan before:content-['•']">{renderInline(line.slice(2), `list-${index}`)}</p>);
    } else {
      blocks.push(<p key={`line-${index}`} className="min-h-5">{renderInline(line, `line-${index}`)}</p>);
    }
  }

  if (codeLines) blocks.push(<pre key="code-unclosed" className="overflow-x-auto rounded-xl bg-[#060914] p-4 font-mono text-sm leading-6 text-emerald-200"><code>{codeLines.join('\n')}</code></pre>);
  return <div className="space-y-2 text-sm leading-7 text-slate-300">{blocks}</div>;
}
