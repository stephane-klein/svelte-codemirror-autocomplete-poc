<script>
    import "./editor.css";
    import { onMount } from "svelte";
    import {basicSetup as CodeBasicSetup} from "codemirror";
    import {EditorView, keymap } from "@codemirror/view";
    import {Compartment} from "@codemirror/state";
    import {markdown} from "@codemirror/lang-markdown";
    import { autocompletion, completionKeymap, startCompletion } from "@codemirror/autocomplete";

    let languageConf = new Compartment;
    let codeElement;
    let _codeEditorView;

    async function complete(context) {
        let before = context.matchBefore(/\[\[\w*/);

        if (!before) return null;

        return {
            from: before.from,
            options: (
                (await (await fetch(`./get-suggestions/`, {})).json())
                    .filter((item) => item.label.toLowerCase().startsWith(before.text.substring(2).toLowerCase()))
                    .map((item) => ({
                        label: `[[${item.id}`,
                        displayLabel: item.label
                    }))
            ),
            filter: false
        };
    }

    onMount(() => {
        _codeEditorView = new EditorView({
            parent: codeElement,
            doc: "Hello world",
            extensions: [
                CodeBasicSetup,
                languageConf.of(markdown()),
                autocompletion({
                    icons: false,
                    override: [complete],
                    activateOnTyping: true,
                }),
                keymap.of([...completionKeymap]),
                EditorView.updateListener.of(update => {
                    if (update.changes) {
                        if (update.changes.inserted.some(text => text === "[[")) {
                            startCompletion(_codeEditorView);
                        }
                    }
                }),
            ]
        });
    });
</script>
<div bind:this={codeElement} class="editor" style="height: 300px; overflow: scroll"></div>
