import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import NoteView from '../components/NoteView';
import UnlockNoteModal from '../components/UnlockNoteModal';
import SetNotePasswordModal from '../components/SetNotePasswordModal';
import EmptyState from '../components/EmptyState';

function MainApp() {
    const [notes, setNotes] = useState([]);
    const [allNotes, setAllNotes] = useState([]); // Todas as notas (sem filtro)
    const [selectedNote, setSelectedNote] = useState(null);
    const [notePassword, setNotePassword] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Estados para modais
    const [noteToUnlock, setNoteToUnlock] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setIsLoading(true);
            const notesList = await window.api.notes.list();
            setNotes(notesList);
            setAllNotes(notesList);
        } catch (err) {
            console.error('Error loading notes:', err);
            setError('Erro ao carregar notas');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = useCallback(async (query) => {
        setSearchQuery(query);

        if (!query || query.trim() === '') {
            setNotes(allNotes);
            return;
        }

        try {
            const results = await window.api.notes.search(query);
            setNotes(results);

            // Se nota selecionada não está nos resultados, fechar
            if (selectedNote && !results.find(n => n.id === selectedNote.id)) {
                setSelectedNote(null);
                setNotePassword(null);
            }
        } catch (err) {
            console.error('Error searching notes:', err);
        }
    }, [allNotes, selectedNote]);

    const handleCreateNote = async () => {
        setShowPasswordModal(true);
    };

    const handleConfirmPassword = async (passwordData) => {
        setShowPasswordModal(false);

        try {
            const result = await window.api.notes.create({
                title: 'Nova Nota',
                content: {
                    type: 'doc',
                    content: [
                        {
                            type: 'paragraph',
                        },
                    ],
                },
                hasPassword: passwordData.hasPassword,
                password: passwordData.password,
            });

            if (result.success) {
                const newNotesList = [result.note, ...allNotes];
                setAllNotes(newNotesList);
                setNotes(newNotesList);

                if (passwordData.hasPassword) {
                    setNotePassword(passwordData.password);
                } else {
                    setNotePassword(null);
                }

                setSelectedNote(result.note);
                setSearchQuery(''); // Limpar busca ao criar nota
            }
        } catch (err) {
            console.error('Error creating note:', err);
            setError('Erro ao criar nota');
        }
    };

    const handleSelectNote = async (note) => {
        setNotePassword(null);

        try {
            if (note.hasPassword) {
                setNoteToUnlock(note);
            } else {
                const fullNote = await window.api.notes.get(note.id);
                setSelectedNote(fullNote);
            }
        } catch (err) {
            console.error('Error loading note:', err);
            alert('Erro ao abrir nota');
        }
    };

    const handleUnlockNote = async (password) => {
        try {
            const unlockedNote = await window.api.notes.get(noteToUnlock.id, password);

            if (unlockedNote.locked) {
                throw new Error('Senha incorreta');
            }

            setNotePassword(password);
            setNoteToUnlock(null);
            setSelectedNote(unlockedNote);
        } catch (err) {
            throw err;
        }
    };

    const handleCancelUnlock = () => {
        setNoteToUnlock(null);
    };

    const handleUpdateNote = async (updates) => {
        if (!selectedNote) return;

        try {
            const result = await window.api.notes.update(
                selectedNote.id,
                updates,
                selectedNote.hasPassword ? notePassword : null
            );

            if (result.success) {
                setSelectedNote({ ...selectedNote, ...result.note });

                // Atualizar em ambas as listas
                const updateNoteInList = (list) =>
                    list.map((n) => (n.id === selectedNote.id ? { ...n, ...result.note } : n));

                setNotes(updateNoteInList(notes));
                setAllNotes(updateNoteInList(allNotes));
            }
        } catch (err) {
            console.error('Error updating note:', err);
            setError('Erro ao salvar nota');
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!confirm('Tem certeza que deseja deletar esta nota?')) return;

        try {
            await window.api.notes.delete(noteId);

            const filterNotes = (list) => list.filter((n) => n.id !== noteId);
            setNotes(filterNotes(notes));
            setAllNotes(filterNotes(allNotes));

            if (selectedNote?.id === noteId) {
                setSelectedNote(null);
                setNotePassword(null);
            }
        } catch (err) {
            console.error('Error deleting note:', err);
            setError('Erro ao deletar nota');
        }
    };

    const handleCloseNote = () => {
        setSelectedNote(null);
        setNotePassword(null);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className="flex h-screen bg-[#000000] overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    notes={notes}
                    selectedNote={selectedNote}
                    onSelectNote={handleSelectNote}
                    onCreateNote={handleCreateNote}
                    isOpen={isSidebarOpen}
                    onToggle={toggleSidebar}
                    isLoading={isLoading}
                    error={error}
                    onSearch={handleSearch}
                    searchQuery={searchQuery}
                />

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Menu Button */}
                    {!isSidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white/[0.08] backdrop-blur-xl rounded-lg border border-white/[0.08] text-white hover:bg-white/[0.12] transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}

                    {selectedNote ? (
                        <NoteView
                            note={selectedNote}
                            notePassword={notePassword}
                            onUpdate={handleUpdateNote}
                            onClose={handleCloseNote}
                            onDelete={() => handleDeleteNote(selectedNote.id)}
                        />
                    ) : (
                        <EmptyState onCreateNote={handleCreateNote} notesCount={allNotes.length} />
                    )}
                </div>
            </div>

            {/* Modals */}
            {noteToUnlock && (
                <UnlockNoteModal
                    note={noteToUnlock}
                    onUnlock={handleUnlockNote}
                    onCancel={handleCancelUnlock}
                />
            )}

            {showPasswordModal && (
                <SetNotePasswordModal
                    onConfirm={handleConfirmPassword}
                    onCancel={() => setShowPasswordModal(false)}
                />
            )}
        </>
    );
}

export default MainApp;