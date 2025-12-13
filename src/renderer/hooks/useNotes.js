import { useState, useEffect, useCallback } from 'react';

// Hook customizado para gerenciar notas
export function useNotes() {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carregar lista de notas
    const refreshNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const notesList = await window.api.notes.list();
            setNotes(notesList);
        } catch (err) {
            console.error('Error loading notes:', err);
            setError(err.message || 'Erro ao carregar notas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Criar nova nota
    const createNote = useCallback(async (noteData) => {
        try {
            const result = await window.api.notes.create(noteData);

            if (result.success) {
                // Adicionar nota ao estado local
                setNotes((prev) => [result.note, ...prev]);
                return result.note;
            } else {
                throw new Error(result.error || 'Erro ao criar nota');
            }
        } catch (err) {
            console.error('Error creating note:', err);
            throw err;
        }
    }, []);

    // Atualizar nota existente
    const updateNote = useCallback(async (noteId, updates, notePassword = null) => {
        try {
            const result = await window.api.notes.update(noteId, updates, notePassword);

            if (result.success) {
                // Atualizar nota no estado local
                setNotes((prev) =>
                    prev.map((note) =>
                        note.id === noteId
                            ? { ...note, ...result.note }
                            : note
                    )
                );
                return result.note;
            } else {
                throw new Error(result.error || 'Erro ao atualizar nota');
            }
        } catch (err) {
            console.error('Error updating note:', err);
            throw err;
        }
    }, []);

    // Deletar nota
    const deleteNote = useCallback(async (noteId) => {
        try {
            const result = await window.api.notes.delete(noteId);

            if (result.success) {
                // Remover nota do estado local
                setNotes((prev) => prev.filter((note) => note.id !== noteId));
                return true;
            } else {
                throw new Error(result.error || 'Erro ao deletar nota');
            }
        } catch (err) {
            console.error('Error deleting note:', err);
            throw err;
        }
    }, []);

    // Obter conteúdo de uma nota específica
    const getNoteContent = useCallback(async (noteId, notePassword = null) => {
        try {
            return await window.api.notes.get(noteId, notePassword);
        } catch (err) {
            console.error('Error getting note content:', err);
            throw err;
        }
    }, []);

    // Desbloquear nota protegida
    const unlockNote = useCallback(async (noteId, password) => {
        try {
            return await window.api.notes.unlock(noteId, password);
        } catch (err) {
            console.error('Error unlocking note:', err);
            throw err;
        }
    }, []);

    // Carregar notas ao montar o componente
    useEffect(() => {
        refreshNotes();
    }, [refreshNotes]);

    return {
        // Estado
        notes,
        isLoading,
        error,

        // Ações
        createNote,
        updateNote,
        deleteNote,
        getNoteContent,
        unlockNote,
        refreshNotes,
    };
}