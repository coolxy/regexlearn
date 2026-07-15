import 'draft-js/dist/Draft.css';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useIntl } from 'react-intl';
import cx from 'clsx';

import {
  Editor,
  EditorState,
  CompositeDecorator,
  ContentState,
  ContentBlock,
  getDefaultKeyBinding,
} from 'draft-js';

import setCaretPosition from 'src/utils/setCaretPosition';
import FlagSelect from './FlagSelect';

function myKeyBindingFn(e): string | null {
  if (e.ctrlKey && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    return null;
  }
  return getDefaultKeyBinding(e);
}

const Highlight = ({ children }) => (
  <span className="shadow-sm h-3 px-[3px] mx-[1px] py-[2px] rounded-md text-white bg-green-500">
    {children}
  </span>
);

const initText = `Regular Expressions, abbreviated as Regex or Regexp, are a string of characters created within the framework of Regex syntax rules. You can easily manage your data with Regex, which uses commands like finding, matching, and editing. Regex can be used in programming languages such as Python, SQL, JavaScript, R, Google Analytics, Google Data Studio, and throughout the coding process. Learn regex online with examples and tutorials on RegexLearn now.`;

const initialContent = ContentState.createFromText(initText);

const Playground = () => {
  const { formatMessage } = useIntl();
  const regexInput = useRef<HTMLInputElement>(null);
  const editor = useRef(null);

  const [state, setState] = useState({
    regex: '',
    flags: '',
    editorState: EditorState.createEmpty(),
  });

  const onChangeFlags = flags => {
    let newFlags = '';
    if (flags.includes('g')) {
      newFlags += 'g';
    }
    if (flags.includes('m')) {
      newFlags += 'm';
    }
    if (flags.includes('i')) {
      newFlags += 'i';
    }
    setState({
      regex: state.regex,
      flags: newFlags,
      editorState: checkRegex(state.regex, newFlags, state.editorState),
    });
  };

  const onChangeRegex = (event: FormEvent<HTMLInputElement>) => {
    const regex = event?.currentTarget?.value || '';
    setState({ ...state, regex, editorState: checkRegex(regex, state.flags, state.editorState) });
  };

  const onChangeContent = (editorState: EditorState) => {
    setState({ ...state, editorState });
  };

  const checkRegex = (regex, flags, editorState) => {
    let rowIndex = 0;
    let matchCount = 0;

    if (!regex) {
      const content = editorState.getCurrentContent();
      return EditorState.createWithContent(content);
    }

    const blockCount = editorState.getCurrentContent().getBlockMap().size;

    function findWithRegex(content: ContentBlock, callback: Function) {
      const isMultiple = flags.includes('m');
      const currentRow = rowIndex;

      rowIndex++;

      // Without the multiline flag, `^` only matches the start of the whole
      // text (first row) and `$` only its end (last row).
      if (!isMultiple) {
        if (regex.startsWith('^') && currentRow > 0) return;
        if (regex.endsWith('$') && currentRow < blockCount - 1) return;
      }

      const isGlobal = flags.includes('g');

      if (!isGlobal && matchCount > 0) return;

      const text = content.getText();
      const currentRegex = new RegExp(regex, isGlobal ? flags : `g${flags}`);

      let matches = [...text.matchAll(currentRegex)];

      if (!isGlobal) {
        matches = matches.slice(0, 1);
      }

      if (regex && matches.length) {
        matches.forEach(match => callback(match.index, match.index + match[0].length));
      }

      if (matches.length) {
        matchCount++;
      }
    }

    function handleStrategy(content: ContentBlock, callback: Function) {
      try {
        findWithRegex(content, callback);
      } catch (err) {}
    }

    const HighlightDecorator = new CompositeDecorator([
      {
        strategy: handleStrategy,
        component: Highlight,
      },
    ]);

    return EditorState.createWithContent(editorState.getCurrentContent(), HighlightDecorator);
  };

  useEffect(() => {
    const regex = '[A-Z]\\w+';
    const flags = 'g';
    setState({
      regex,
      flags,
      editorState: checkRegex(regex, flags, EditorState.createWithContent(initialContent)),
    });
    setCaretPosition(regexInput.current, regex.length);
  }, []);

  return (
    <>
      <div dir='ltr'
        className={cx(
          'bg-jet-500 rounded-md relative tracking-wider text-neutral-300 mb-5 mt-4',
          'w-full flex items-center',
        )}
      >
        <span className="bg-neutral-600/40 px-2 py-1 rounded-t-md ml-3 text-[10px] text-neutral-400 absolute -top-[23px]">
          {formatMessage({ id: 'general.regex' })}
        </span>
        <div className="flex items-center px-1 py-6 text-neutral-500 tracking-wider w-full rounded-md bg-neutral-600/40 h-7 md:text-sm">
          <span className="ml-3">/</span>
          <input
            ref={regexInput}
            className="border-0 px-1 flex-1 focus:outline-none md:text-sm leading-5 text-regreen-400 bg-transparent focus:ring-0 w-full"
            type="text"
            onChange={e => onChangeRegex(e)}
            value={state.regex}
            spellCheck={false}
          />
          <span>
            /<span className="text-green-500">{state.flags}</span>
          </span>
          <FlagSelect flags={state.flags} setFlags={onChangeFlags} />
        </div>
      </div>

      <div
        className={cx(
          'bg-jet-500 rounded-md relative tracking-wider text-neutral-300 h-auto',
          'flex flex-col text-left w-full items-start',
        )}
        onClick={() => editor.current.focus()}
      >
        <span className="bg-neutral-700/40 px-2 py-1 rounded-t-md ml-3 relative text-[10px] text-neutral-400">
          {formatMessage({ id: 'general.text' })}
        </span>
        <div className="bg-neutral-700/40 rounded-lg w-full p-2 flex">
          <div
            className={cx(
              'overflow-y-scroll h-[calc(100vh-5rem-10rem)] w-full flex md:text-sm  overflow-x-hidden !leading-7',
              '[&_.public-DraftEditor-content]:min-h-full [&_.DraftEditor-root]:w-full  [&_.public-DraftEditor-content]:ring-0',
            )}
          >
            <Editor
              ref={editor}
              editorState={state.editorState}
              onChange={onChangeContent}
              placeholder="Text here"
              keyBindingFn={myKeyBindingFn}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Playground;
