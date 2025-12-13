import { useState, useEffect, useRef } from 'react';

function SearchBar({ onSearch, resultsCount, totalCount }) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Debounce da busca
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    // Atalho Ctrl+F
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape' && isFocused) {
                handleClear();
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="p-4 border-b border-white/[0.08]">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Buscar notas..."
                    className="w-full pl-10 pr-10 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/[0.12] transition-all"
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Results Count */}
            {query && (
                <div className="mt-2 text-xs text-white/40 text-center">
                    {resultsCount === 0 ? (
                        <span>Nenhuma nota encontrada</span>
                    ) : (
                        <span>
                            {resultsCount} {resultsCount === 1 ? 'nota encontrada' : 'notas encontradas'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;