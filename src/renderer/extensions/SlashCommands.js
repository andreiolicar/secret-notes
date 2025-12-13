import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import CommandsList from '../components/CommandsList';

export default Extension.create({
    name: 'slashCommands',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                startOfLine: false,
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

export const suggestion = {
    items: ({ query }) => {
        const commands = [
            {
                title: 'Título 1',
                description: 'Título grande',
                icon: 'Heading1',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode('heading', { level: 1 })
                        .run();
                },
            },
            {
                title: 'Título 2',
                description: 'Título médio',
                icon: 'Heading2',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode('heading', { level: 2 })
                        .run();
                },
            },
            {
                title: 'Título 3',
                description: 'Título pequeno',
                icon: 'Heading3',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode('heading', { level: 3 })
                        .run();
                },
            },
            {
                title: 'Lista com bullets',
                description: 'Lista simples',
                icon: 'List',
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBulletList().run();
                },
            },
            {
                title: 'Lista numerada',
                description: 'Lista ordenada',
                icon: 'ListOrdered',
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                },
            },
            {
                title: 'Lista de tarefas',
                description: 'Lista com checkboxes',
                icon: 'CheckSquare',
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleTaskList().run();
                },
            },
            {
                title: 'Bloco de código',
                description: 'Código com syntax highlight',
                icon: 'Code',
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
                },
            },
            {
                title: 'Citação',
                description: 'Bloco de citação',
                icon: 'Quote',
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                },
            },
            {
                title: 'Divisor',
                description: 'Linha horizontal',
                icon: 'Minus',
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
                },
            },
            {
                title: 'Senha da nota',
                description: 'Campo de senha protegido',
                icon: 'Lock',
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: '🔐 ',
                                },
                                {
                                    type: 'text',
                                    marks: [{ type: 'code' }],
                                    text: '••••••••',
                                },
                            ],
                        })
                        .run();
                },
            },
        ];

        return commands.filter((item) => {
            const search = query.toLowerCase();
            return (
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search)
            );
        });
    },

    render: () => {
        let component;
        let popup;

        return {
            onStart: (props) => {
                component = new ReactRenderer(CommandsList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                });
            },

            onUpdate(props) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    popup[0].hide();
                    return true;
                }

                return component.ref?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};