"use client";

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect, useState } from 'react';
import { Link as LinkIcon, Unlink, Check, X } from 'lucide-react';

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
      // Return raw HTML
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[40px] px-3 py-2 border border-gray-300 rounded-lg bg-white ${className}`,
      },
    },
  });

  // Keep content in sync if value changes externally
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
      return;
    }
    // ensure valid url protocol
    const formattedUrl = /^https?:\/\//.test(linkUrl) ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run();
    setIsEditingLink(false);
    setLinkUrl('');
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <>
      <EditorContent editor={editor} />
      
      {/* Visual Floating Link Menu for TipTap */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white rounded-lg shadow-xl border border-gray-200 flex items-center p-1.5 gap-1 animate-in fade-in zoom-in-95 z-50">
        {!isEditingLink ? (
          <>
            {editor.isActive('link') ? (
              <button
                onClick={(e) => { e.preventDefault(); removeLink(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-bold text-sm transition-colors"
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
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 text-blue-600 rounded-md font-bold text-sm transition-colors"
                title="Add Hyperlink"
              >
                <LinkIcon className="w-4 h-4" /> Link
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 px-1">
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
              className="w-48 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button onClick={(e) => { e.preventDefault(); setLink(); }} className="p-1 text-green-600 hover:bg-green-50 rounded">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.preventDefault(); setIsEditingLink(false); }} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </BubbleMenu>
    </>
  );
}
