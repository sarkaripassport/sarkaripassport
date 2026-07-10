import { getJobBySlug } from "@/lib/db";
import { MessageSquare, ArrowLeft, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReplyForm from "./ReplyForm";

export const metadata = {
  title: "Job Comments | Admin",
};

export default async function JobCommentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  const comments = job.comments || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/jobs" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0B1B3D] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#0A58CA]" />
            Manage Comments
          </h1>
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">
            {job.title.en}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-lg mb-6 border-b pb-4">Discussion ({comments.length})</h2>
        
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No comments on this job yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className={`flex gap-4 p-4 rounded-xl border ${comment.is_admin_reply ? 'bg-blue-50/50 border-blue-100 ml-8' : 'bg-gray-50 border-gray-100'}`}>
                <div className="shrink-0 mt-1">
                  {comment.is_admin_reply ? (
                    <div className="w-10 h-10 bg-[#0A58CA] rounded-full flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{comment.name}</span>
                    {comment.is_admin_reply && (
                      <span className="bg-[#0A58CA] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide">
                        ADMIN
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                  
                  {!comment.is_admin_reply && (
                    <div className="mt-4 border-t pt-4 border-gray-200">
                      <ReplyForm jobSlug={job.slug} replyToName={comment.name} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
