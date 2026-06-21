"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Image as ImageIcon, Table as TableIcon, Trash2 } from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-[#0A58CA]' : 'text-gray-600'}`} title="Heading 1"><Heading1 className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-[#0A58CA]' : 'text-gray-600'}`} title="Heading 2"><Heading2 className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-[#0A58CA]' : 'text-gray-600'}`} title="Heading 3"><Heading3 className="w-4 h-4" /></button>
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-[#0A58CA]' : 'text-gray-600'}`} title="Bold"><Bold className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-[#0A58CA]' : 'text-gray-600'}`} title="Italic"><Italic className="w-4 h-4" /></button>
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-[#0A58CA]' : 'text-gray-600'}`} title="Bullet List"><List className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-[#0A58CA]' : 'text-gray-600'}`} title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <button onClick={() => {
        const url = window.prompt('URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Insert Image"><ImageIcon className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Insert Table"><TableIcon className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-1.5 rounded hover:bg-red-100 text-gray-600 hover:text-red-600" title="Delete Table"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[400px] p-4 max-w-none',
      },
    },
  });

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
