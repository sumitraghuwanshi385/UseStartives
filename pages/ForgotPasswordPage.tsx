import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email.trim()) {
      addNotification("Please enter your email address.", "error");
      setIsLoading(false);
      return;
    }
    // Simulate API call to send code
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    addNotification(`Verification code sent.`, "success");
    navigate('/verify-email', { state: { fromReset: true, email } });
  };

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-start">
            <Link to="/login" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2.5">
                <ChevronLeftIcon className="w-3.5 h-3.5" />
                <span>Back to Login</span>
            </Link>
        </div>

        <div className="bg-[var(--component-background)] p-8 sm:p-12 rounded-[3rem] border border-[var(--border-primary)] text-center shadow-none">
            <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-[var(--text-primary)]">Recover Access</h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">We'll send a 6-digit code to verify your identity.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-6 py-4 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-full placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-[var(--text-primary)] transition-all font-medium h-14"
                  placeholder="name@example.com"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-6 button-gradient text-white font-black uppercase tracking-widest text-[10px] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 h-14 items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;