import { useState } from 'react';

function SetNotePasswordModal({ onConfirm, onCancel, currentlyProtected = false }) {
    const [isProtected, setIsProtected] = useState(currentlyProtected);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { strength: 0, label: '', color: '' };

        const length = pwd.length;
        const hasNumbers = /\d/.test(pwd);
        const hasLetters = /[a-zA-Z]/.test(pwd);
        const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

        let strength = 0;
        if (length >= 4) strength += 1;
        if (length >= 8) strength += 1;
        if (hasNumbers && hasLetters) strength += 1;
        if (hasSpecial) strength += 1;

        if (strength <= 1) return { strength: 1, label: 'Fraca', color: 'bg-red-500' };
        if (strength === 2) return { strength: 2, label: 'Média', color: 'bg-yellow-500' };
        if (strength === 3) return { strength: 3, label: 'Boa', color: 'bg-blue-500' };
        return { strength: 4, label: 'Forte', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isProtected) {
            if (!password) {
                setError('Digite uma senha');
                return;
            }

            if (password.length < 4) {
                setError('A senha deve ter pelo menos 4 caracteres');
                return;
            }

            if (password !== confirmPassword) {
                setError('As senhas não coincidem');
                return;
            }
        }

        onConfirm({
            hasPassword: isProtected,
            password: isProtected ? password : null,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.08] max-w-md w-full shadow-2xl">
                {/* Title */}
                <h2 className="text-xl font-semibold text-white mb-6">
                    Proteger Nota
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Checkbox - Corrigido */}
                    <div
                        onClick={() => setIsProtected(!isProtected)}
                        className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                    >
                        <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
                            <input
                                type="checkbox"
                                checked={isProtected}
                                onChange={() => { }} // Controlled pelo onClick do div pai
                                className="w-5 h-5 rounded border-2 border-white/[0.12] bg-white/[0.05] checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all appearance-none pointer-events-none"
                            />
                            {isProtected && (
                                <svg className="w-3 h-3 text-white absolute pointer-events-none" fill="currentColor" viewBox="0 0 12 12">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="text-white text-sm font-medium block mb-1">
                                Proteger esta nota com senha
                            </span>
                            <span className="text-white/50 text-xs">
                                Adiciona uma camada extra de segurança além da senha mestra
                            </span>
                        </div>
                    </div>

                    {/* Password Fields - Mostrar apenas se protegida */}
                    {isProtected && (
                        <div className="space-y-4 pt-2 animate-fade-in">
                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-white/40 text-xs font-light block">
                                    Nova Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 4 caracteres"
                                        className="w-full px-4 py-3 pr-12 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/[0.12] transition-all"
                                        autoFocus
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

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-white/[0.08]'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-white/50">
                                            Força: <span className={passwordStrength.strength >= 3 ? 'text-green-400' : 'text-yellow-400'}>{passwordStrength.label}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-white/40 text-xs font-light block">
                                    Confirmar Senha
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Digite novamente"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/[0.12] transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
                            <p className="text-red-300 text-xs font-light">{error}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 text-sm font-medium rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-medium rounded-xl transition-all"
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SetNotePasswordModal;