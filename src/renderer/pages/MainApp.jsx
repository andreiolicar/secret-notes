import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteView from '../components/NoteView';
import UnlockNoteModal from '../components/UnlockNoteModal';
import SetNotePasswordModal from '../components/SetNotePasswordModal';
import EmptyState from '../components/EmptyState';
import { useNotesStore } from '../store/notesStore';
import { useModalStore, MODAL_TYPES } from '../store/modalStore';

function MainApp() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [noteToUnlock, setNoteToUnlock] = useState(null);

    // Store do Zustand
    const {
        notes,
        allNotes,
        selectedNote,
        notePassword,
        isLoading,
        error,
        searchQuery,
        loadNotes,
        createNote,
        selectNote,
        unlockNote,
        updateNote,
        deleteNote,
        searchNotes,
        closeNote
    } = useNotesStore();

    const { activeModal, modalProps, openModal, closeModal } = useModalStore();

    // Carregar notas ao montar
    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    // Handlers
    const handleCreateNote = () => {
        openModal(MODAL_TYPES.SET_PASSWORD);
    };

    const handleConfirmPassword = async (passwordData) => {
        closeModal();

        try {
            await createNote({
                title: 'Nova Nota',
                content: {
                    type: 'doc',
                    content: [{ type: 'paragraph' }]
                },
                hasPassword: passwordData.hasPassword,
                password: passwordData.password
            });
        } catch (err) {
            console.error('Error creating note:', err);
        }
    };

    const handleSelectNote = async (note) => {
        try {
            const result = await selectNote(note);

            // Se retornou null, precisa de senha
            if (result === null) {
                setNoteToUnlock(note);
            }
        } catch (err) {
            alert('Erro ao abrir nota');
        }
    };

    const handleUnlockNote = async (password) => {
        try {
            await unlockNote(noteToUnlock.id, password);
            setNoteToUnlock(null);
        } catch (err) {
            throw err; // Propaga erro para o modal mostrar
        }
    };

    const handleCancelUnlock = () => {
        setNoteToUnlock(null);
    };

    const handleUpdateNote = async (updates) => {
        if (!selectedNote) return;

        try {
            await updateNote(
                selectedNote.id,
                updates,
                selectedNote.hasPassword ? notePassword : null
            );
        } catch (err) {
            console.error('Error updating note:', err);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!confirm('Tem certeza que deseja deletar esta nota?')) return;

        try {
            await deleteNote(noteId);
        } catch (err) {
            console.error('Error deleting note:', err);
        }
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
                    onSearch={searchNotes}
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
                            onClose={closeNote}
                            onDelete={() => handleDeleteNote(selectedNote.id)}
                        />
                    ) : (
                        <EmptyState
                            onCreateNote={handleCreateNote}
                            notesCount={allNotes.length}
                        />
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

            {activeModal === MODAL_TYPES.SET_PASSWORD && (
                <SetNotePasswordModal
                    onConfirm={handleConfirmPassword}
                    onCancel={closeModal}
                />
            )}
        </>
    );
}

export default MainApp;