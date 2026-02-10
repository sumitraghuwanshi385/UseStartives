
import React, { useState, FormEvent } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ClipboardDocumentListIcon, ChevronLeftIcon, UserCircleIcon, PaperAirplaneIcon, IdentificationIcon } from '../constants';

const ApplyPage: React.FC = () => {
  const { ideaId, positionId } = useParams<{ ideaId: string; positionId: string }>();
  const { getIdeaById, getPositionById, addApplication, currentUser, addNotification } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const idea = ideaId ? getIdeaById(ideaId) : undefined;
  const position = ideaId && positionId ? getPositionById(ideaId, positionId) : undefined;

  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!idea || !position) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-[var(--accent-danger-text)] mb-4">Position Not Found</h1>
        <p className="text-[var(--text-muted)] mt-2 mb-8">The position you're trying to apply for is not available.</p>
        <Link 
          to={ideaId ? `/idea/${ideaId}` : "/projects"} 
          className="button-gradient inline-flex items-center text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <ChevronLeftIcon className="mr-2 w-5 h-5" />
          Back
        </Link>
      </div>
    );
  }
  
  if (!currentUser) {
      addNotification('You must be logged in to apply for a position.', 'error');
      navigate('/login', { state: { from: location }});
      return null;
  }

  const textAreaClasses = "block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] sm:text-sm text-[var(--text-primary)] transition-colors duration-200 resize-y";

  const handleAnswerChange = (question: string, value: string) => {
      setAnswers(prev => ({...prev, [question]: value}));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!coverLetter) {
        addNotification('Please write a cover letter.', 'error');
        setIsLoading(false);
        return;
    }
    
    // Check if required questions are answered? Assuming optional for now or all required.
    // Let's make them required if they exist.
    if (position.questions && position.questions.length > 0) {
        const missingAnswers = position.questions.some(q => !answers[q]?.trim());
        if (missingAnswers) {
            addNotification('Please answer all screening questions.', 'error');
            setIsLoading(false);
            return;
        }
    }

    if (!ideaId || !positionId) {
        addNotification('Error: Idea ID or Position ID is missing.', 'error');
        setIsLoading(false);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formattedAnswers = Object.entries(answers).map(([q, a]) => ({ question: q, answer: String(a) }));

    addApplication({ 
        ideaId, 
        positionId, 
        applicantName: currentUser.name, 
        applicantEmail: currentUser.email, 
        coverLetter,
        answers: formattedAnswers
    });
    
    setIsLoading(false);
    addNotification("Application submitted successfully!", "success");
    navigate(`/idea/${ideaId}`);
  };
  
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  };

  return (
      <div>
        <Link to={`/idea/${ideaId}`} className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-5 py-2.5 bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] border border-[var(--border-primary)] mb-6">
            <ChevronLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Project Details</span>
        </Link>
        <div className="grid lg:grid-cols-5 gap-8 items-start">
            <aside className="lg:col-span-2 space-y-6 sticky top-24">
                <div className="bg-[var(--component-background)] p-5 rounded-xl border border-[var(--border-primary)]">
                    <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-3 flex items-center"><ClipboardDocumentListIcon className="w-4 h-4 mr-2 text-[var(--accent-primary)]"/>Position Details</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong className="text-[var(--text-secondary)]">Project:</strong> <Link to={`/idea/${idea.id}`} className="text-sky-500 dark:text-sky-400 hover:underline">{idea.title}</Link></p>
                        <p><strong className="text-[var(--text-secondary)]">Role:</strong> {position.title}</p>
                        <p><strong className="text-[var(--text-secondary)]">Type:</strong> {position.type}</p>
                    </div>
                </div>
                 <div className="bg-[var(--component-background)] p-5 rounded-xl border border-[var(--border-primary)]">
                    <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-3 flex items-center"><UserCircleIcon className="w-4 h-4 mr-2 text-[var(--accent-primary)]"/>Your Information</h3>
                    <div className="flex items-center space-x-3">
                        {currentUser.profilePictureUrl ? (
                            <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover"/>
                        ) : (
                            <div className="w-12 h-12 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-lg">
                                {getInitials(currentUser.name)}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-[var(--text-primary)]">{currentUser.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">{currentUser.email}</p>
                        </div>
                    </div>
                     <p className="text-xs text-[var(--text-muted)] mt-3">Your profile information will be sent with your application. Ensure it's up-to-date.</p>
                </div>
            </aside>
            <main className="lg:col-span-3">
                <div className="bg-[var(--component-background)] p-6 sm:p-8 rounded-xl border border-[var(--border-primary)]">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">Submit Your Application</h1>
                        <p className="text-[var(--text-secondary)]">This is your chance to stand out. Explain why you're the perfect fit for the <strong className="text-[var(--text-primary)]">{position.title}</strong> role.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Your Message / Cover Letter *</label>
                            <textarea 
                                id="coverLetter" 
                                value={coverLetter} 
                                onChange={e => setCoverLetter(e.target.value)} 
                                rows={8} 
                                required 
                                className={`${textAreaClasses} min-h-[200px]`}
                                placeholder="Introduce yourself, highlight relevant skills, and express your passion for this project..."
                            />
                        </div>

                        {position.questions && position.questions.length > 0 && (
                            <div className="space-y-6 pt-6 border-t border-[var(--border-primary)]">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <IdentificationIcon className="w-5 h-5 text-purple-500" />
                                    Screening Questions
                                </h3>
                                {position.questions.map((q, idx) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{q} *</label>
                                        <input 
                                            type="text"
                                            value={answers[q] || ''}
                                            onChange={e => handleAnswerChange(q, e.target.value)}
                                            required
                                            className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] sm:text-sm text-[var(--text-primary)] transition-colors duration-200"
                                            placeholder="Your answer..."
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--border-primary)]">
                            <Link to={`/idea/${ideaId}`} className="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] rounded-full transition-colors border border-[var(--border-primary)]">
                                Cancel
                            </Link>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="button-gradient inline-flex items-center text-white font-bold py-2.5 px-8 rounded-full text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-100 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <PaperAirplaneIcon className="mr-2 w-4 h-4" />
                                )}
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
      </div>
  );
};

export default ApplyPage;
