import { useState, useEffect } from 'react';
import Editor from './Editor';

function NoteView({ note, onUpdate, onClose, onDelete }) {
    const [title, setTitle] = useState(note?.title || '');
    const [saveStatus, setSaveStatus] = useState('saved');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
        }
    }, [note?.id]);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle); // Atualizar estado local imediatamente
        setSaveStatus('saving');

        // Debounce para salvar no backend
        clearTimeout(window.titleSaveTimeout);
        window.titleSaveTimeout = setTimeout(async () => {
            if (onUpdate) {
                await onUpdate({ title: newTitle });
                setSaveStatus('saved');
            }
        }, 1000);
    };

    const handleContentUpdate = async (content) => {
        if (onUpdate) {
            await onUpdate({ content });
        }
    };

    const handleSaveStatusChange = (status) => {
        setSaveStatus(status);
    };

    if (!note) {
        return null;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Back Button */}
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                        title="Voltar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Título da nota..."
                        className="flex-1 text-xl font-semibold text-white bg-transparent border-none outline-none focus:outline-none focus:ring-0 placeholder-white/30 min-w-0"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Save Status */}
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        {saveStatus === 'saving' ? (
                            <>
                                <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin" />
                                <span>Salvando...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Salvo</span>
                            </>
                        )}
                    </div>

                    {/* Lock Button */}
                    {note.hasPassword && (
                        <button
                            className="p-2 text-white/40 hover:text-white/60 transition-colors"
                            title="Nota protegida"
                        >
                            🔐
                        </button>
                    )}

                    {/* Delete Button */}
                    <button
                        onClick={onDelete}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                        title="Excluir nota"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    content={note.content}
                    onUpdate={handleContentUpdate}
                    onSaveStatusChange={handleSaveStatusChange}
                />
            </div>
        </div>
    );
}

export default NoteView;