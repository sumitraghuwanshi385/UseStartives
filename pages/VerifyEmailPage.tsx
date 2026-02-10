import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ChevronLeftIcon } from '../constants';

const VerifyEmailPage: React.FC = () => {
  const { verifyAndLogin, addNotification } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const isResetFlow = location.state?.fromReset === true;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d{6}$/.test(pastedData)) return;

    const newCode = pastedData.split('');
    setCode(newCode);
    inputsRef.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      addNotification("Enter full 6-digit code.", "error");
      setIsLoading(false);
      return;
    }

    if (isResetFlow) {
        // Mock verification for reset
        await new Promise(r => setTimeout(r, 1500));
        setIsLoading(false);
        navigate('/new-password');
        return;
    }

    const success = await verifyAndLogin(verificationCode);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
        setCode(new Array(6).fill(''));
        inputsRef.current[0]?.focus();
    }
  };
  
  const handleResendCode = () => {
    addNotification("Code sent to your given email.", "info");
    setResendDisabled(true);
    setTimer(15);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
        setTimer(t => t - 1);
    }, 1000);
  };

  useEffect(() => {
    if (timer <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
        setResendDisabled(false);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer]);

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-start">
            <Link to={isResetFlow ? "/forgot-password" : "/signup"} className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2.5">
                <ChevronLeftIcon className="w-3.5 h-3.5" />
                <span>Back</span>
            </Link>
        </div>

        <div className="bg-[var(--component-background)] p-8 sm:p-12 rounded-[3rem] border border-[var(--border-primary)] text-center shadow-none">
            <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-[var(--text-primary)]">Security Check</h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">Verify the code sent to your email.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputsRef.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(e, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-2xl focus:ring-2 focus:ring-purple-500 text-[var(--text-primary)] transition-all outline-none"
                        disabled={isLoading}
                    />
                    ))}
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading || code.join('').length !== 6}
                    className="w-full py-4 px-6 h-14 button-gradient text-white font-black uppercase tracking-widest text-[10px] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                    'Verify Identity'
                    )}
                </button>
            </form>

            <div className="mt-8 text-[10px] font-black uppercase tracking-widest">
                <p className="text-[var(--text-muted)]">
                    Missing code?{' '}
                    <button onClick={handleResendCode} disabled={resendDisabled} className="text-sky-500 hover:text-sky-600 transition-colors disabled:text-[var(--text-muted)]">
                    Resend {resendDisabled && `(${timer}s)`}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;