import { useState } from 'react';

function UnlockNoteModal({ note, onUnlock, onCancel }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Digite a senha da nota');
            return;
        }

        setIsUnlocking(true);

        try {
            await onUnlock(password);
        } catch (err) {
            setError('Senha incorreta');
            setPassword('');
        } finally {
            setIsUnlocking(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.08] max-w-md w-full shadow-2xl">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                        <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white text-center mb-2">
                    Nota Protegida
                </h2>
                <p className="text-white/50 text-sm text-center mb-6">
                    "{note?.title}" está protegida. Digite a senha para desbloquear.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-white/40 text-xs font-light block">
                            Senha da Nota
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite a senha"
                                className="w-full px-4 py-3 pr-12 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/[0.12] transition-all"
                                autoFocus
                                disabled={isUnlocking}
                            />
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

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
                            <p className="text-red-300 text-xs font-light">{error}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isUnlocking}
                            className="flex-1 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isUnlocking || !password}
                            className="flex-1 py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUnlocking ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                                    <span>Verificando...</span>
                                </>
                            ) : (
                                <span>Desbloquear</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UnlockNoteModal;