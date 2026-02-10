import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const NewPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (password.length < 6) {
            addNotification("Password must be at least 6 digits.", "error");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            addNotification("Passwords do not match.", "error");
            setIsLoading(false);
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        addNotification("Password updated successfully!", "success");
        navigate('/login', { state: { resetSuccess: true } });
    };

    const inputStyles = "block w-full px-6 py-4 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-full placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm text-[var(--text-primary)] font-medium h-14";

    return (
        <div className="min-h-screen bg-[var(--background-secondary)] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-[var(--component-background)] p-8 sm:p-12 rounded-[3rem] border border-[var(--border-primary)] shadow-none text-center">
                <div className="space-y-2 mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-[var(--text-primary)]">New Credentials</h1>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Create a strong, unique password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputStyles}
                            placeholder="Min. 6 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputStyles}
                            placeholder="Repeat password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-4 px-6 h-14 button-gradient text-white font-black uppercase tracking-widest text-[10px] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 items-center mt-4"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPasswordPage;