'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/components/providers';
import { LessonExercise } from '@/store/courseStore';

type PlaygroundLanguage = 'html' | 'css' | 'javascript';

interface LessonPlaygroundProps {
  editorLanguage?: PlaygroundLanguage;
  starterCode?: string;
  exercise?: LessonExercise;
  onExerciseResult?: (result: { passedCount: number; total: number; completed: boolean }) => void;
}

const starters: Record<PlaygroundLanguage, string> = {
  html: '<h1>Salom, dunyo!</h1>\n<p>Bu mening birinchi HTML sahifam.</p>',
  css: 'h1 {\n  color: #06b6d4;\n}\n\np {\n  font-size: 18px;\n}',
  javascript: 'const message = "Salom, JavaScript!";\ndocument.querySelector("#output").textContent = message;',
};

const htmlCompletions = [
  { label: 'html', detail: 'HTML hujjat shabloni' },
  { label: 'head', detail: 'Sahifa sozlamalari' },
  { label: 'body', detail: 'Sahifa tarkibi' },
  { label: 'header', detail: 'Sahifa sarlavhasi' },
  { label: 'h1', detail: 'Katta sarlavha' },
  { label: 'h2', detail: 'Sarlavha' },
  { label: 'p', detail: 'Matn paragrafi' },
  { label: 'div', detail: 'Blok konteyner' },
  { label: 'section', detail: 'Sahifa bo‘limi' },
  { label: 'button', detail: 'Tugma' },
  { label: 'a', detail: 'Havola' },
  { label: 'img', detail: 'Rasm' },
  { label: 'ul', detail: 'Tartibsiz ro‘yxat' },
  { label: 'li', detail: 'Ro‘yxat elementi' },
];

const labels = {
  en: { title: 'Try it yourself', run: 'Run code', check: 'Check exercise', language: 'Language', html: 'HTML', css: 'CSS', javascript: 'JavaScript', editor: 'Code editor', preview: 'Preview', empty: 'Run your code to see the result here.', suggestions: 'Suggestions', accept: 'Tab to complete', exercise: 'Coding exercise', passed: 'Passed', failed: 'Not passed' },
  ru: { title: 'Попробуйте сами', run: 'Запустить код', check: 'Проверить задание', language: 'Язык', html: 'HTML', css: 'CSS', javascript: 'JavaScript', editor: 'Редактор кода', preview: 'Результат', empty: 'Запустите код, чтобы увидеть результат.', suggestions: 'Подсказки', accept: 'Tab — принять', exercise: 'Практическое задание', passed: 'Выполнено', failed: 'Не выполнено' },
  uz: { title: 'O‘zingiz sinab ko‘ring', run: 'Kodni ishga tushirish', check: 'Vazifani tekshirish', language: 'Til', html: 'HTML', css: 'CSS', javascript: 'JavaScript', editor: 'Kod muharriri', preview: 'Natija', empty: 'Natijani ko‘rish uchun kodni ishga tushiring.', suggestions: 'Takliflar', accept: 'Qabul qilish: Tab', exercise: 'Amaliy vazifa', passed: 'Bajarildi', failed: 'Bajarilmadi' },
} as const;

function createPreview(language: PlaygroundLanguage, code: string) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  const head = `<head><meta charset="utf-8">${policy}<style>body{font-family:system-ui,sans-serif;padding:16px;color:#111827}#output{white-space:pre-wrap}</style></head>`;

  if (language === 'html') return `<!doctype html><html>${head}<body>${code}</body></html>`;
  if (language === 'css') {
    const safeCss = code.replace(/<\/style/gi, '<\\/style');
    return `<!doctype html><html>${head}<body><h1>Salom, dunyo!</h1><p>CSS natijasini shu yerda ko‘ring.</p><style>${safeCss}</style></body></html>`;
  }

  const safeScript = code.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html>${head}<body><h1>JavaScript natijasi</h1><p id="output">Kodingiz natijani shu yerda ko‘rsatadi.</p><script>${safeScript}</script></body></html>`;
}

function createExercisePreview(language: PlaygroundLanguage, code: string, exercise: LessonExercise) {
  const checks = JSON.stringify(exercise.checks.map(({ id, selector, type, expected, property }) => ({ id, selector, type, expected, property }))).replace(/</g, '\\u003c');
  const checkScript = `<script>(()=>{const checks=${checks};const results=checks.map(check=>{try{const element=document.querySelector(check.selector);if(check.type==='element')return{id:check.id,passed:Boolean(element)};if(!element)return{id:check.id,passed:false};if(check.type==='text')return{id:check.id,passed:element.textContent.toLowerCase().includes((check.expected||'').toLowerCase())};const actual=getComputedStyle(element).getPropertyValue(check.property||'').trim().toLowerCase();return{id:check.id,passed:actual===(check.expected||'').trim().toLowerCase()}}catch{return{id:check.id,passed:false}}});parent.postMessage({type:'codelearn-exercise-result',results},'*')})()</script>`;
  let page: string;
  if (language === 'css') {
    const safeCss = code.replace(/<\/style/gi, '<\\/style');
    page = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;padding:16px;color:#111827}h1{color:#111827}</style><style>${safeCss}</style></head><body><h1>Salom, dunyo!</h1><p>CSS natijasini shu yerda ko‘ring.</p></body></html>`;
  } else if (language === 'javascript') {
    const safeScript = code.replace(/<\/script/gi, '<\\/script');
    page = `<!doctype html><html><head><meta charset="utf-8"></head><body><h1>JavaScript natijasi</h1><p id="output">Natija</p><script>${safeScript}</script></body></html>`;
  } else {
    page = `<!doctype html><html><head><meta charset="utf-8"></head><body>${code}</body></html>`;
  }
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  page = page.replace('<head>', `<head>${policy}`);
  if (/<\/body>/i.test(page)) return page.replace(/<\/body>/i, `${checkScript}</body>`);
  return page.replace(/<\/html>/i, `${checkScript}</html>`);
}

export function LessonPlayground({ editorLanguage = 'html', starterCode, exercise, onExerciseResult }: LessonPlaygroundProps) {
  const { language } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState<PlaygroundLanguage>(editorLanguage);
  const [codes, setCodes] = useState<Record<PlaygroundLanguage, string>>({
    ...starters,
    [editorLanguage]: starterCode || starters[editorLanguage],
  });
  const [preview, setPreview] = useState('');
  const [checkResults, setCheckResults] = useState<Record<string, boolean> | null>(null);
  const [completion, setCompletion] = useState<{ start: number; end: number; query: string } | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const text = labels[language as keyof typeof labels] || labels.en;
  const code = codes[selectedLanguage];
  const matches = selectedLanguage === 'html' && completion
    ? htmlCompletions.filter(item => item.label.startsWith(completion.query.toLowerCase()))
    : [];

  useEffect(() => {
    setSelectedLanguage(editorLanguage);
    setCodes({ ...starters, [editorLanguage]: starterCode || starters[editorLanguage] });
    setPreview('');
    setCheckResults(null);
    setCompletion(null);
  }, [editorLanguage, starterCode]);

  useEffect(() => {
    if (!exercise) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow || !event.data || event.data.type !== 'codelearn-exercise-result' || !Array.isArray(event.data.results)) return;
      const results: { id: string; passed: boolean }[] = [];
      for (const result of event.data.results) {
        if (!result || typeof result !== 'object' || typeof result.id !== 'string' || typeof result.passed !== 'boolean') return;
        results.push({ id: result.id, passed: result.passed });
      }
      if (results.length !== exercise.checks.length || new Set(results.map(result => result.id)).size !== exercise.checks.length || results.some(result => !exercise.checks.some(check => check.id === result.id))) return;
      const passedCount = results.filter(result => result.passed).length;
      setCheckResults(Object.fromEntries(results.map(result => [result.id, result.passed])));
      onExerciseResult?.({ passedCount, total: results.length, completed: passedCount === results.length });
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [exercise, onExerciseResult]);

  const updateCode = (value: string, cursor: number) => {
    setCodes(current => ({ ...current, [selectedLanguage]: value }));
    if (selectedLanguage !== 'html') {
      setCompletion(null);
      return;
    }
    const beforeCursor = value.slice(0, cursor);
    const token = beforeCursor.match(/[a-zA-Z][a-zA-Z0-9-]*$/);
    setCompletion(token && token[0].length >= 2
      ? { start: cursor - token[0].length, end: cursor, query: token[0] }
      : null);
  };

  const acceptCompletion = (label: string) => {
    if (!completion) return;
    const isHtmlTemplate = label === 'html' && !code.slice(0, completion.start).endsWith('<');
    const insertText = isHtmlTemplate
      ? '<!DOCTYPE html>\n<html lang="uz">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Sahifam</title>\n</head>\n<body>\n  \n</body>\n</html>'
      : label;
    const nextCode = `${code.slice(0, completion.start)}${insertText}${code.slice(completion.end)}`;
    const cursor = completion.start + insertText.length;
    setCodes(current => ({ ...current, [selectedLanguage]: nextCode }));
    setCompletion(null);
    requestAnimationFrame(() => {
      editorRef.current?.focus();
      editorRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.key === 'Tab' || event.key === 'Enter') && matches.length > 0) {
      event.preventDefault();
      acceptCompletion(matches[0].label);
    } else if (event.key === 'Escape') {
      setCompletion(null);
    }
  };

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1d]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <h2 className="font-semibold text-white">{text.title}</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="lesson-playground-language" className="text-xs text-slate-400">{text.language}</label>
          <select
            id="lesson-playground-language"
            value={selectedLanguage}
            onChange={event => {
              setSelectedLanguage(event.target.value as PlaygroundLanguage);
              setCompletion(null);
            }}
            className="rounded-lg border border-white/10 bg-[#111827] px-2 py-1.5 text-xs text-white focus:border-neon-cyan focus:outline-none"
          >
            <option value="html">{text.html}</option>
            <option value="css">{text.css}</option>
            <option value="javascript">{text.javascript}</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="relative border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
          <label htmlFor="lesson-playground-code" className="mb-2 block text-xs font-medium text-slate-400">{text.editor}</label>
          <textarea
            ref={editorRef}
            id="lesson-playground-code"
            spellCheck={false}
            value={code}
            onChange={event => updateCode(event.target.value, event.target.selectionStart)}
            onKeyDown={handleEditorKeyDown}
            onClick={() => setCompletion(null)}
            className="min-h-64 w-full resize-y rounded-xl border border-white/10 bg-[#060914] p-4 font-mono text-sm leading-6 text-emerald-200 outline-none focus:border-neon-cyan"
            aria-label={text.editor}
          />
          {matches.length > 0 && (
            <div className="absolute left-4 top-20 z-10 max-h-56 w-[calc(100%-2rem)] overflow-y-auto rounded-xl border border-white/15 bg-[#111827] p-2 shadow-2xl" role="listbox" aria-label={text.suggestions}>
              {matches.map(item => (
                <button
                  key={item.label}
                  type="button"
                  role="option"
                  aria-selected="true"
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => acceptCompletion(item.label)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-neon-blue/15"
                >
                  <span className="font-mono text-sm text-neon-cyan">{item.label}</span>
                  <span className="text-xs text-slate-400">{item.detail}</span>
                </button>
              ))}
              <p className="px-3 pt-1 text-[10px] text-slate-500">{text.accept}</p>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setPreview(createPreview(selectedLanguage, code));
            }}
            className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            ▶ {text.run}
          </button>
          {exercise && <button
            type="button"
            onClick={() => {
              setCheckResults(null);
              setPreview(createExercisePreview(selectedLanguage, code, exercise));
            }}
            className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2.5 text-sm font-semibold text-neon-cyan hover:bg-neon-cyan/15"
          >
            ✓ {text.check}
          </button>}
          </div>
        </div>

        <div className="p-4">
          <h3 className="mb-2 text-xs font-medium text-slate-400">{text.preview}</h3>
          {preview ? (
            <iframe
              ref={iframeRef}
              title={text.preview}
              sandbox="allow-scripts"
              srcDoc={preview}
              className="h-72 w-full rounded-xl border border-white/10 bg-white"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#060914] p-5 text-center text-sm text-slate-500">{text.empty}</div>
          )}
        </div>
      </div>
      {exercise && <div className="border-t border-white/10 p-4">
        <h3 className="font-semibold text-white">{text.exercise}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-300">{exercise.instructions}</p>
        <ul className="mt-3 space-y-2">
          {exercise.checks.map(check => (
            <li key={check.id} className="flex items-start gap-2 text-sm">
              <span aria-hidden="true" className={checkResults?.[check.id] ? 'text-emerald-300' : checkResults ? 'text-rose-300' : 'text-slate-500'}>{checkResults?.[check.id] ? '✓' : checkResults ? '✕' : '○'}</span>
              <span className="text-slate-300">{check.label}</span>
              {checkResults && <span className={`ml-auto text-xs ${checkResults[check.id] ? 'text-emerald-300' : 'text-rose-300'}`}>{checkResults[check.id] ? text.passed : text.failed}</span>}
            </li>
          ))}
        </ul>
      </div>}
    </section>
  );
}
