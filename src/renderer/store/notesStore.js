import { create } from 'zustand';

export const useNotesStore = create((set, get) => ({
    // Estado
    notes: [],
    allNotes: [],
    selectedNote: null,
    notePassword: null,
    isLoading: true,
    error: null,
    searchQuery: '',

    // Actions - Setters simples
    setNotes: (notes) => set({ notes, allNotes: notes }),
    setSelectedNote: (note) => set({ selectedNote: note }),
    setNotePassword: (password) => set({ notePassword: password }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setError: (error) => set({ error }),

    // Actions - Carregar notas
    loadNotes: async () => {
        set({ isLoading: true, error: null });
        try {
            const notesList = await window.api.notes.list();
            set({
                notes: notesList,
                allNotes: notesList,
                isLoading: false
            });
        } catch (err) {
            console.error('Error loading notes:', err);
            set({
                error: 'Erro ao carregar notas',
                isLoading: false
            });
        }
    },

    // Actions - Criar nota
    createNote: async (noteData) => {
        try {
            const result = await window.api.notes.create(noteData);

            if (result.success) {
                const { allNotes } = get();
                const newNotesList = [result.note, ...allNotes];

                set({
                    notes: newNotesList,
                    allNotes: newNotesList,
                    selectedNote: result.note,
                    notePassword: noteData.hasPassword ? noteData.password : null,
                    searchQuery: ''
                });

                return result.note;
            }
        } catch (err) {
            console.error('Error creating note:', err);
            set({ error: 'Erro ao criar nota' });
            throw err;
        }
    },

    // Actions - Selecionar nota
    selectNote: async (note) => {
        set({ notePassword: null });

        try {
            if (note.hasPassword) {
                // Retorna null para indicar que precisa de senha
                return null;
            } else {
                const fullNote = await window.api.notes.get(note.id);
                set({ selectedNote: fullNote });
                return fullNote;
            }
        } catch (err) {
            console.error('Error loading note:', err);
            set({ error: 'Erro ao abrir nota' });
            throw err;
        }
    },

    // Actions - Desbloquear nota
    unlockNote: async (noteId, password) => {
        try {
            const unlockedNote = await window.api.notes.get(noteId, password);

            if (unlockedNote.locked) {
                throw new Error('Senha incorreta');
            }

            set({
                selectedNote: unlockedNote,
                notePassword: password
            });

            return unlockedNote;
        } catch (err) {
            console.error('Error unlocking note:', err);
            throw err;
        }
    },

    // Actions - Atualizar nota
    updateNote: async (noteId, updates, notePassword = null) => {
        const { selectedNote, notes, allNotes } = get();

        try {
            const result = await window.api.notes.update(
                noteId,
                updates,
                selectedNote?.hasPassword ? notePassword : null
            );

            if (result.success) {
                // Atualizar nota selecionada
                set({
                    selectedNote: { ...selectedNote, ...result.note }
                });

                // Atualizar nas listas
                const updateNoteInList = (list) =>
                    list.map((n) => (n.id === noteId ? { ...n, ...result.note } : n));

                set({
                    notes: updateNoteInList(notes),
                    allNotes: updateNoteInList(allNotes)
                });

                return result.note;
            }
        } catch (err) {
            console.error('Error updating note:', err);
            set({ error: 'Erro ao salvar nota' });
            throw err;
        }
    },

    // Actions - Deletar nota
    deleteNote: async (noteId) => {
        const { selectedNote, notes, allNotes } = get();

        try {
            await window.api.notes.delete(noteId);

            const filterNotes = (list) => list.filter((n) => n.id !== noteId);

            set({
                notes: filterNotes(notes),
                allNotes: filterNotes(allNotes),
                selectedNote: selectedNote?.id === noteId ? null : selectedNote,
                notePassword: selectedNote?.id === noteId ? null : get().notePassword
            });

            return true;
        } catch (err) {
            console.error('Error deleting note:', err);
            set({ error: 'Erro ao deletar nota' });
            throw err;
        }
    },

    // Actions - Buscar notas
    searchNotes: async (query) => {
        const { allNotes, selectedNote } = get();

        set({ searchQuery: query });

        if (!query || query.trim() === '') {
            set({ notes: allNotes });
            return;
        }

        try {
            const results = await window.api.notes.search(query);
            set({ notes: results });

            // Se nota selecionada não está nos resultados, fechar
            if (selectedNote && !results.find(n => n.id === selectedNote.id)) {
                set({ selectedNote: null, notePassword: null });
            }
        } catch (err) {
            console.error('Error searching notes:', err);
            set({ error: 'Erro ao buscar notas' });
        }
    },

    // Actions - Fechar nota
    closeNote: () => {
        set({
            selectedNote: null,
            notePassword: null
        });
    },

    // Actions - Limpar erro
    clearError: () => {
        set({ error: null });
    }
}));