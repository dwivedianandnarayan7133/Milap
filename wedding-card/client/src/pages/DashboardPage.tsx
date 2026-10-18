import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { fetchProjects, deleteProjectApi, duplicateProjectApi } from '../services/api';
import { useCardStore } from '../store/cardStore';
import { Plus, Edit3, Copy, Trash2, Calendar, FileText, Sparkles, FolderKanban } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { guestSessionId } = useCardStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllProjects = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjects(guestSessionId);
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllProjects();
  }, [guestSessionId]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProjectApi(id);
      loadAllProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await duplicateProjectApi(id);
      loadAllProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-royal-gold" />
              <h1 className="text-2xl font-bold font-serif text-stone-900">My Invitation Projects</h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Manage your saved invitations, reopen previous drafts, or duplicate designs for other family ceremonies.
            </p>
          </div>

          <button
            onClick={() => navigate('/editor')}
            className="px-4 py-2.5 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer hover:opacity-95"
          >
            <Plus className="w-4 h-4 text-royal-gold" />
            Create New Invitation
          </button>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="text-center py-20 text-stone-400">
            <div className="w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-stone-200 p-8 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-royal-gold flex items-center justify-center mx-auto border border-amber-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800 font-serif">No Saved Projects Yet</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Create your first personalized Indian wedding or birthday invitation card. It will automatically be saved here.
            </p>
            <button
              onClick={() => navigate('/editor')}
              className="px-6 py-2.5 bg-royal-maroon text-white font-bold text-xs rounded-lg shadow-sm hover:bg-royal-maroon-dark cursor-pointer transition-colors"
            >
              Start Designing Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const id = proj._id || proj.id;
              const dateStr = proj.updatedAt
                ? new Date(proj.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <div
                  key={id}
                  onClick={() => navigate(`/editor?project=${id}`)}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {/* Visual Header */}
                  <div className="h-40 bg-gradient-to-br from-royal-maroon to-royal-maroon-dark p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-2 border border-royal-gold/30 rounded-xs pointer-events-none" />
                    <span className="text-[10px] text-royal-gold uppercase font-bold tracking-widest mb-1">
                      {proj.category}
                    </span>
                    <h3 className="text-base font-serif font-bold text-white text-center line-clamp-2 px-2">
                      {proj.title}
                    </h3>
                    <span className="text-[10px] text-stone-300 mt-1">
                      {proj.pages?.length || 1} Pages • {proj.format}
                    </span>
                  </div>

                  {/* Body & Actions */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Edited {dateStr}
                      </span>
                      <span className="text-[10px] font-semibold text-royal-maroon bg-amber-50 px-2 py-0.5 rounded">
                        {proj.language?.toUpperCase() || 'HI'}
                      </span>
                    </div>

                    <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/editor?project=${id}`)}
                        className="text-xs font-bold text-royal-maroon hover:text-royal-maroon-dark flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit in Studio
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDuplicate(id, e)}
                          title="Duplicate Project"
                          className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(id, e)}
                          title="Delete Project"
                          className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
