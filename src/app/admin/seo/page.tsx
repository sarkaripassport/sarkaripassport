"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit, Save, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";

interface LocalizedText {
  en: string;
  hi: string;
  mr: string;
}

interface FAQItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

interface MatrixPage {
  slug: string;
  h1: LocalizedText;
  intro: LocalizedText;
  faqs: FAQItem[];
}

export default function SeoAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [matrixPages, setMatrixPages] = useState<Record<string, MatrixPage>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selection / Editing State
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [editSlug, setEditSlug] = useState("");
  const [editH1, setEditH1] = useState<LocalizedText>({ en: "", hi: "", mr: "" });
  const [editIntro, setEditIntro] = useState<LocalizedText>({ en: "", hi: "", mr: "" });
  const [editFaqs, setEditFaqs] = useState<FAQItem[]>([]);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setMatrixPages(data.matrix_pages || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        setLoading(false);
      });
  }, []);

  const handleSavePage = async () => {
    if (!editSlug) {
      alert("Please enter a valid URL slug path (e.g. 10th-pass, maharashtra, bank, etc.)");
      return;
    }
    
    const cleanSlug = editSlug.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
    if (!cleanSlug) return;

    setSaving(true);
    const updatedPages = { ...matrixPages };
    updatedPages[cleanSlug] = {
      slug: cleanSlug,
      h1: editH1,
      intro: editIntro,
      faqs: editFaqs
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          matrix_pages: updatedPages
        })
      });

      if (res.ok) {
        setMatrixPages(updatedPages);
        setSettings({ ...settings, matrix_pages: updatedPages });
        setSelectedSlug(null);
        setIsNew(false);
        alert("Programmatic SEO Page Config Saved Successfully!");
      } else {
        alert("Failed to save configuration.");
      }
    } catch (err) {
      alert("Error saving configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (slugToDelete: string) => {
    if (!confirm(`Are you sure you want to delete the SEO configuration for "${slugToDelete}"?`)) {
      return;
    }

    setSaving(true);
    const updatedPages = { ...matrixPages };
    delete updatedPages[slugToDelete];

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          matrix_pages: updatedPages
        })
      });

      if (res.ok) {
        setMatrixPages(updatedPages);
        setSettings({ ...settings, matrix_pages: updatedPages });
        if (selectedSlug === slugToDelete) {
          setSelectedSlug(null);
        }
        alert("Configuration Deleted successfully.");
      } else {
        alert("Failed to delete configuration.");
      }
    } catch (err) {
      alert("Error deleting configuration.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (slug: string) => {
    const page = matrixPages[slug];
    setSelectedSlug(slug);
    setEditSlug(page.slug);
    setEditH1({ ...page.h1 });
    setEditIntro({ ...page.intro });
    setEditFaqs(page.faqs ? page.faqs.map(f => ({ ...f })) : []);
    setIsNew(false);
  };

  const startCreate = () => {
    setSelectedSlug("new-page");
    setEditSlug("");
    setEditH1({ en: "", hi: "", mr: "" });
    setEditIntro({ en: "", hi: "", mr: "" });
    setEditFaqs([]);
    setIsNew(true);
  };

  // FAQ CRUD helpers
  const addFaq = () => {
    const newItem: FAQItem = {
      id: Math.random().toString(36).substring(2, 9),
      question: { en: "", hi: "", mr: "" },
      answer: { en: "", hi: "", mr: "" }
    };
    setEditFaqs([...editFaqs, newItem]);
  };

  const removeFaq = (id: string) => {
    setEditFaqs(editFaqs.filter(f => f.id !== id));
  };

  const updateFaq = (id: string, field: "question" | "answer", lang: keyof LocalizedText, value: string) => {
    setEditFaqs(editFaqs.map(f => {
      if (f.id !== id) return f;
      const updatedField = { ...f[field], [lang]: value };
      return { ...f, [field]: updatedField };
    }));
  };

  const filteredSlugs = Object.keys(matrixPages).filter(s => 
    s.includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Banner */}
      <div className="bg-[#0B1B3D] text-white py-8 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-1">
              <Link href="/admin" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Admin Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-black">Programmatic SEO Page Overrides</h1>
            <p className="text-gray-300 text-sm mt-1">Configure custom headers, landing page content, and FAQ accordions for dynamic paths.</p>
          </div>
          <button 
            onClick={startCreate}
            className="flex items-center gap-2 bg-[#0A58CA] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg shadow transition"
          >
            <Plus className="w-5 h-5" /> Add SEO Matrix Page
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {!selectedSlug ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by URL path slug (e.g. 10th-pass, bihar, banking)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm"
              />
            </div>

            {filteredSlugs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="font-medium">No overrides configured yet.</p>
                <p className="text-xs text-gray-400 mt-1">Click the button above to add custom SEO text and FAQs to dynamic matrix landing pages.</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredSlugs.map(slug => {
                  const page = matrixPages[slug];
                  return (
                    <div key={slug} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                      <div>
                        <div className="font-bold text-[#0B1B3D] flex items-center gap-2">
                          <code className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">/explore/{slug}</code>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          H1 (EN): <span className="font-medium text-gray-700">{page.h1?.en || "None"}</span> | FAQs: {page.faqs?.length || 0} items
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => startEdit(slug)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Override Settings"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeletePage(slug)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Override Settings"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-[#0B1B3D]">
                {isNew ? "Create Programmatic SEO Override" : `Edit Configuration: /explore/${selectedSlug}`}
              </h2>
              <button 
                onClick={() => setSelectedSlug(null)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800"
              >
                Cancel & Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* URL Path / Slug */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Target Matrix URL Slug <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 10th-pass, bihar, graduate/maharashtra"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  disabled={!isNew}
                  className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">This configures overrides for pages matching <code>/explore/[slug]</code> (e.g. 10th-pass or railway/10th-pass).</p>
              </div>

              {/* H1 Heading */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-[#0B1B3D] border-b pb-1">H1 Main Heading</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">English (EN)</label>
                    <input 
                      type="text"
                      value={editH1.en}
                      onChange={(e) => setEditH1({ ...editH1, en: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hindi (HI)</label>
                    <input 
                      type="text"
                      value={editH1.hi}
                      onChange={(e) => setEditH1({ ...editH1, hi: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Marathi (MR)</label>
                    <input 
                      type="text"
                      value={editH1.mr}
                      onChange={(e) => setEditH1({ ...editH1, mr: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Intro Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-[#0B1B3D] border-b pb-1">Introductory Paragraph Description</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">English (EN)</label>
                    <textarea 
                      value={editIntro.en}
                      onChange={(e) => setEditIntro({ ...editIntro, en: e.target.value })}
                      rows={3}
                      className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hindi (HI)</label>
                    <textarea 
                      value={editIntro.hi}
                      onChange={(e) => setEditIntro({ ...editIntro, hi: e.target.value })}
                      rows={3}
                      className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Marathi (MR)</label>
                    <textarea 
                      value={editIntro.mr}
                      onChange={(e) => setEditIntro({ ...editIntro, mr: e.target.value })}
                      rows={3}
                      className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* FAQs List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-1">
                  <h3 className="text-sm font-extrabold text-[#0B1B3D]">FAQ Accordions</h3>
                  <button 
                    type="button"
                    onClick={addFaq}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add FAQ Item
                  </button>
                </div>

                {editFaqs.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-2">No FAQ items defined. Click Add FAQ Item to construct custom page Q&As.</p>
                ) : (
                  <div className="space-y-4">
                    {editFaqs.map((faq, index) => (
                      <div key={faq.id} className="border rounded-xl p-4 bg-gray-50/50 space-y-3 relative">
                        <button 
                          type="button"
                          onClick={() => removeFaq(faq.id)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="font-semibold text-xs text-gray-500">FAQ Item #{index + 1}</div>
                        
                        {/* Questions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500">Question (EN)</label>
                            <input 
                              type="text"
                              value={faq.question.en}
                              onChange={(e) => updateFaq(faq.id, "question", "en", e.target.value)}
                              className="w-full border bg-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500">Question (HI)</label>
                            <input 
                              type="text"
                              value={faq.question.hi}
                              onChange={(e) => updateFaq(faq.id, "question", "hi", e.target.value)}
                              className="w-full border bg-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500">Question (MR)</label>
                            <input 
                              type="text"
                              value={faq.question.mr}
                              onChange={(e) => updateFaq(faq.id, "question", "mr", e.target.value)}
                              className="w-full border bg-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Answers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500">Answer (EN)</label>
                            <textarea 
                              value={faq.answer.en}
                              onChange={(e) => updateFaq(faq.id, "answer", "en", e.target.value)}
                              rows={2}
                              className="w-full border bg-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500">Answer (HI)</label>
                            <textarea 
                              value={faq.answer.hi}
                              onChange={(e) => updateFaq(faq.id, "answer", "hi", e.target.value)}
                              rows={2}
                              className="w-full border bg-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500">Answer (MR)</label>
                            <textarea 
                              value={faq.answer.mr}
                              onChange={(e) => updateFaq(faq.id, "answer", "mr", e.target.value)}
                              rows={2}
                              className="w-full border bg-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button 
                type="button"
                onClick={() => setSelectedSlug(null)}
                className="px-5 py-2.5 border rounded-lg hover:bg-gray-100 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSavePage}
                disabled={saving}
                className="flex items-center gap-2 bg-[#0A58CA] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
