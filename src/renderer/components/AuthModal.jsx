import { useState, useEffect } from 'react';

function AuthModal({ onAuthenticated }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        checkVault();
    }, []);

    const checkVault = async () => {
        try {
            const firstTime = await window.api.vault.isFirstTime();
            setIsFirstTime(firstTime);
        } catch (err) {
            console.error('Error checking vault:', err);
            setError('Erro ao verificar sistema');
        } finally {
            setIsLoading(false);
        }
    };

    const validatePassword = (pwd) => {
        if (pwd.length < 8) {
            return 'A senha deve ter pelo menos 8 caracteres';
        }
        return null;
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validações
        if (!password) {
            setError('Por favor, insira uma senha');
            triggerShake();
            return;
        }

        if (isFirstTime) {
            // Criar novo vault
            const validationError = validatePassword(password);
            if (validationError) {
                setError(validationError);
                triggerShake();
                return;
            }

            if (password !== confirmPassword) {
                setError('As senhas não coincidem');
                triggerShake();
                return;
            }
        }

        setIsSubmitting(true);

        try {
            let result;

            if (isFirstTime) {
                result = await window.api.vault.create(password);
            } else {
                result = await window.api.vault.unlock(password);
            }

            if (result.success) {
                // Sucesso! Notificar componente pai
                onAuthenticated();
            } else {
                setError(result.error || 'Erro ao processar senha');
                triggerShake();
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            setError('Erro de comunicação com o sistema');
            triggerShake();
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#000000]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                    <p className="text-white/50 text-sm font-light">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000] p-4 animate-fade-in">
            {/* Modal Container */}
            <div
                className={`w-full max-w-md transition-transform duration-200 ${isShaking ? 'animate-shake' : ''
                    }`}
            >
                {/* Glass Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/[0.08]">

                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white/80"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                            SecretNotes
                        </h1>
                        <p className="text-white/50 text-sm font-light">
                            {isFirstTime
                                ? 'Crie sua senha mestra'
                                : 'Digite sua senha mestra'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-white/40 text-xs font-light block">
                                Senha Mestra
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isFirstTime ? 'Mínimo 8 caracteres' : 'Digite sua senha'}
                                    className="w-full px-4 py-3 pr-12 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/[0.12] transition-all duration-200"
                                    autoFocus
                                    disabled={isSubmitting}
                                />
                                {/* Toggle Password Visibility */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (only for first time) */}
                        {isFirstTime && (
                            <div className="space-y-2">
                                <label className="text-white/40 text-xs font-light block">
                                    Confirmar Senha
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Digite novamente"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/[0.12] transition-all duration-200"
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
                                <p className="text-red-300 text-xs font-light">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:bg-white/[0.12] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                                    <span>Processando...</span>
                                </>
                            ) : (
                                <span>{isFirstTime ? 'Criar Vault' : 'Desbloquear'}</span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 space-y-2">
                        {isFirstTime && (
                            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                                <p className="text-white/40 text-xs font-light leading-relaxed">
                                    💡 Guarde sua senha com segurança. Não é possível recuperá-la se esquecida.
                                </p>
                            </div>
                        )}
                        <div className="text-center">
                            <p className="text-white/30 text-xs font-light">
                                Pressione Ctrl + Alt + Shift + N para abrir
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthModal;