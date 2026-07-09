"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect, useState } from 'react';
import { Link as LinkIcon, Unlink, Check, X, Bold, Italic } from 'lucide-react';

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextInput({ value, onChange, placeholder, className = '' }: RichTextInputProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditingLink, setIsEditingLink] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline font-semibold cursor-pointer',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[40px] px-3 py-2 bg-white ${className}`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl === null) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setIsEditingLink(false);
      return;
    }
    const formattedUrl = /^https?:\/\//.test(linkUrl) ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run();
    setIsEditingLink(false);
    setLinkUrl('');
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
      <div className="bg-gray-50 border-b border-gray-200 px-2 py-1.5 flex items-center gap-1 flex-wrap">
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        
        {!isEditingLink ? (
          <>
            {editor.isActive('link') ? (
              <button
                onClick={(e) => { e.preventDefault(); removeLink(); }}
                className="flex items-center gap-1.5 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-semibold transition-colors"
                title="Remove Hyperlink"
              >
                <Unlink className="w-4 h-4" /> Unlink
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const previousUrl = editor.getAttributes('link').href;
                  setLinkUrl(previousUrl || '');
                  setIsEditingLink(true);
                }}
                className="flex items-center gap-1.5 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-semibold transition-colors"
                title="Add Hyperlink"
              >
                <LinkIcon className="w-4 h-4" /> Link
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1">
            <input
              type="url"
              autoFocus
              placeholder="https://"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); setLink(); }
                if (e.key === 'Escape') { e.preventDefault(); setIsEditingLink(false); }
              }}
              className="w-40 md:w-56 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button onClick={(e) => { e.preventDefault(); setLink(); }} className="p-1 text-green-600 hover:bg-green-50 rounded">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.preventDefault(); setIsEditingLink(false); }} className="p-1 text-gray-500 hover:bg-gray-200 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
