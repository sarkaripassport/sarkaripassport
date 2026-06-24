'use client';

import { useState } from 'react';
import { Eye, Save, LayoutTemplate, HelpCircle, Plus, ArrowUp, ArrowDown, Trash2, GripVertical, Image as ImageIcon, Type, Calendar, Link as LinkIcon } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import SeoSidebar from '@/components/admin/SeoSidebar';
import DynamicVacancyMatrix from '@/components/admin/DynamicVacancyMatrix';
import DynamicFeeMatrix from '@/components/admin/DynamicFeeMatrix';
import ImportantDatesWidget from '@/components/admin/ImportantDatesWidget';
import FaqWidget from '@/components/admin/FaqWidget';
import ImageWidget from '@/components/admin/ImageWidget';

type BlockType = 'RICHTEXT' | 'DATES' | 'FEES' | 'VACANCY' | 'FAQ' | 'IMAGE';

interface Block {
  id: string;
  type: BlockType;
  content?: string;
}

export default function AdvancedEditorPage() {
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [postType, setPostType] = useState('job'); // 'job' or 'page'
  const [showPreview, setShowPreview] = useState(false);

  // Block Builder State
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'DATES' },
    { id: '2', type: 'FEES' },
    { id: '3', type: 'RICHTEXT', content: '' },
    { id: '4', type: 'VACANCY' },
    { id: '5', type: 'FAQ' },
  ]);

  const addBlock = (index: number, type: BlockType) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, { id: Date.now().toString(), type, content: '' });
    setBlocks(newBlocks);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'DATES': return <ImportantDatesWidget />;
      case 'FEES': return <DynamicFeeMatrix />;
      case 'VACANCY': return <DynamicVacancyMatrix />;
      case 'FAQ': return <FaqWidget />;
      case 'IMAGE': return <ImageWidget />;
      case 'RICHTEXT': 
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 py-2.5 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Rich Text & Tables</span>
              </div>
            </div>
            <div className="p-4">
              <RichTextEditor content={block.content || ''} onChange={(c) => updateBlockContent(block.id, c)} />
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="font-sans text-gray-800 flex flex-col h-full">
      
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A58CA] text-white rounded-lg flex items-center justify-center shadow-md">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-[#0B1B3D] leading-none">Advanced CMS Editor</h1>
              <span className="text-xs text-gray-500 font-medium">Create and optimize beautiful content</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 text-sm font-bold rounded-lg border flex items-center gap-2 transition-colors ${showPreview ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Live Preview'}
            </button>
            <button className="px-5 py-2 bg-[#0A58CA] text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-colors">
              <Save className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Writing Area (Left Column) */}
          <div className="flex-grow w-full space-y-6">
            
            {/* Title Input */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <input 
                type="text" 
                placeholder="Add title..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-black text-[#0B1B3D] placeholder:text-gray-300 outline-none bg-transparent"
              />
            </div>

            {/* Block Builder Area */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id} className="relative group/block">
                  
                  {/* Block Controls */}
                  <div className="absolute -left-12 top-4 flex flex-col items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeBlock(block.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 mt-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Render Actual Block */}
                  {renderBlock(block)}

                  {/* Inline Add Block Button */}
                  <div className="relative flex justify-center opacity-0 hover:opacity-100 transition-opacity mt-4 mb-2 py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-blue-200 border-dashed"></div></div>
                    <div className="relative flex gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100 items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase mr-2 tracking-widest">Add Block</span>
                      <button onClick={() => addBlock(index, 'RICHTEXT')} className="p-1.5 rounded hover:bg-blue-50 text-gray-600 hover:text-[#0A58CA]" title="Rich Text">
                        <Type className="w-4 h-4" />
                      </button>
                      <button onClick={() => addBlock(index, 'DATES')} className="p-1.5 rounded hover:bg-blue-50 text-gray-600 hover:text-[#0A58CA]" title="Important Dates">
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button onClick={() => addBlock(index, 'FEES')} className="text-[10px] font-bold px-2 py-1 rounded hover:bg-blue-50 text-gray-600 hover:text-[#0A58CA]">
                        FEES
                      </button>
                      <button onClick={() => addBlock(index, 'VACANCY')} className="text-[10px] font-bold px-2 py-1 rounded hover:bg-blue-50 text-gray-600 hover:text-[#0A58CA]">
                        VACANCY
                      </button>
                      <button onClick={() => addBlock(index, 'IMAGE')} className="p-1.5 rounded hover:bg-blue-50 text-gray-600 hover:text-[#0A58CA]" title="Image">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => addBlock(index, 'FAQ')} className="p-1.5 rounded hover:bg-blue-50 text-gray-600 hover:text-[#0A58CA]" title="FAQ">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Preview Toggle Area */}
            {showPreview && (
              <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-lg overflow-hidden mt-8">
                <div className="bg-indigo-50 border-b border-indigo-100 py-2.5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-800">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Frontend Live Preview</span>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded uppercase">Real-time</span>
                </div>
                <div className="p-8 prose prose-blue max-w-none text-gray-800">
                  {title && <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-6">{title}</h1>}
                  {!title && blocks.every(b => !b.content) && <div className="text-gray-400 italic text-center py-10">Start typing to see preview...</div>}
                  {blocks.map(block => {
                    if (block.type === 'RICHTEXT' && block.content) {
                      return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />
                    }
                    if (block.type !== 'RICHTEXT') {
                      return <div key={block.id} className="p-4 my-4 border border-dashed border-gray-300 bg-gray-50 text-gray-500 text-center rounded">[{block.type} Widget Preview]</div>
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SEO & Settings Sidebar (Right Column) */}
          <div className="w-full lg:w-[400px] shrink-0 sticky top-[140px]">
            <SeoSidebar 
              title={title}
              content={blocks.filter(b => b.type === 'RICHTEXT').map(b => b.content).join(' ')}
              metaTitle={metaTitle}
              setMetaTitle={setMetaTitle}
              metaDescription={metaDescription}
              setMetaDescription={setMetaDescription}
              focusKeyword={focusKeyword}
              setFocusKeyword={setFocusKeyword}
              postType={postType}
              setPostType={setPostType}
            />
          </div>
          
        </div>
      </main>
      
    </div>
  );
}
