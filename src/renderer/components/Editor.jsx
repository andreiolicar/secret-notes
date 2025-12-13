import { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import SlashCommands, { suggestion } from '../extensions/SlashCommands';

function Editor({ content, onUpdate, editable = true, noteId, onSaveStatusChange }) {
    const [saveTimeout, setSaveTimeout] = useState(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: 'code-block',
                    },
                },
            }),
            Placeholder.configure({
                placeholder: 'Comece a escrever ou digite / para comandos...',
                emptyEditorClass: 'is-editor-empty',
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'task-list',
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'task-item',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
            Typography,
            SlashCommands.configure({
                suggestion,
            }),
        ],
        content: content || '',
        editable,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            handleContentChange(editor.getJSON());
        },
    });

    const handleContentChange = (newContent) => {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }

        // Notificar que está salvando
        if (onSaveStatusChange) {
            onSaveStatusChange('saving');
        }

        const timeout = setTimeout(() => {
            if (onUpdate) {
                onUpdate(newContent);
                // Notificar que salvou
                if (onSaveStatusChange) {
                    onSaveStatusChange('saved');
                }
            }
        }, 1000);

        setSaveTimeout(timeout);
    };

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content);
        }
    }, [noteId, editor]);

    useEffect(() => {
        return () => {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
        };
    }, [saveTimeout]);

    if (!editor) {
        return null;
    }

    return (
        <div className="relative h-full">
            {/* Bubble Menu */}
            {editor && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 100 }}
                    className="bubble-menu"
                >
                    <div className="flex items-center gap-1 bg-white/[0.08] backdrop-blur-xl rounded-lg p-1 border border-white/[0.12] shadow-lg">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${editor.isActive('bold')
                                    ? 'bg-white/[0.12] text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                }`}
                        >
                            Bold
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${editor.isActive('italic')
                                    ? 'bg-white/[0.12] text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                }`}
                        >
                            Italic
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${editor.isActive('code')
                                    ? 'bg-white/[0.12] text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                }`}
                        >
                            Code
                        </button>
                        <div className="w-px h-4 bg-white/[0.12]" />
                        <button
                            onClick={() => {
                                const url = window.prompt('URL:');
                                if (url) {
                                    editor.chain().focus().setLink({ href: url }).run();
                                }
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${editor.isActive('link')
                                    ? 'bg-white/[0.12] text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                }`}
                        >
                            Link
                        </button>
                    </div>
                </BubbleMenu>
            )}

            {/* Editor */}
            <div className="editor-wrapper h-full overflow-y-auto px-8 py-8">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default Editor;