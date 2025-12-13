import SearchBar from './SearchBar';

function Sidebar({ notes, selectedNote, onSelectNote, onCreateNote, isOpen, onToggle, isLoading, error, onSearch, searchQuery }) {
    return (
        <>
            {/* Overlay mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 fixed lg:relative z-30 w-80 h-full bg-[#000000] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/[0.08]">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-white tracking-tight">SecretNotes</h1>

                        {/* Close button - mobile only */}
                        <button
                            onClick={onToggle}
                            className="lg:hidden text-white/60 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* New Note Button */}
                    <button
                        onClick={onCreateNote}
                        className="w-full py-2.5 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nova Nota
                    </button>
                </div>

                {/* Search Bar */}
                <SearchBar
                    onSearch={onSearch}
                    resultsCount={notes.length}
                    totalCount={notes.length}
                />

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mb-3" />
                            <p className="text-white/40 text-sm">Carregando notas...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-white/40 text-sm mb-2">
                                {searchQuery ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
                            </p>
                            <p className="text-white/30 text-xs">
                                {searchQuery ? 'Tente outro termo de busca' : 'Crie sua primeira nota!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => onSelectNote(note)}
                                    className={`group p-4 rounded-xl cursor-pointer transition-all ${selectedNote?.id === note.id
                                            ? 'bg-white/[0.08] border border-white/[0.12]'
                                            : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08]'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-white font-medium text-sm line-clamp-1 flex-1">
                                            {note.title}
                                        </h3>
                                        {note.hasPassword && (
                                            <span className="text-xs text-white/40 flex-shrink-0">🔐</span>
                                        )}
                                    </div>

                                    <p className="text-white/40 text-xs">
                                        {new Date(note.updatedAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/[0.08]">
                    <p className="text-white/40 text-xs text-center">
                        {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
                    </p>
                </div>
            </div>
        </>
    );
}

export default Sidebar;