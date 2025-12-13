function EmptyState({ onCreateNote, notesCount }) {
    return (
        <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                    <svg
                        className="w-10 h-10 text-white/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                    {notesCount === 0 ? 'Comece a escrever' : 'Selecione uma nota'}
                </h2>

                {/* Description */}
                <p className="text-white/50 text-sm mb-6 leading-relaxed font-light">
                    {notesCount === 0
                        ? 'Crie sua primeira nota e mantenha suas ideias seguras com criptografia de ponta a ponta.'
                        : 'Escolha uma nota da lista ou crie uma nova para começar a escrever.'}
                </p>

                {/* Action Button */}
                {notesCount === 0 && (
                    <button
                        onClick={onCreateNote}
                        className="px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-medium rounded-xl transition-all inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Criar Primeira Nota
                    </button>
                )}
            </div>
        </div>
    );
}

export default EmptyState;