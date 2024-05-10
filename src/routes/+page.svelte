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

    const items = [
        {label: "[[ab", displayLabel: "ab"},
        {label: "[[aaaa", displayLabel: "Item2"},
        {label: "[[bbbbb", displayLabel: "Item3"},
        {label: "[[ccccc", displayLabel: "Item4", type: null}
    ];

    function complete(context) {
        console.log("ici0");
        let before = context.matchBefore(/\[\[(.*)/);
        if (!before) return null;  // Rien si le déclencheur '[[ 'n'est pas présent
        console.log("ici1");

        return {
            from: before.from,
            // options: items.map(item => ({label: item.label, detail: item.detail, type: "text"})),
            options: items,
            // filter: true,
            // validFor: /^[\w\s]*$/
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
                    activateOnTyping: true
                }),
                keymap.of([...completionKeymap]),
                EditorView.updateListener.of(update => {
                    if (update.changes) {
                        if (update.changes.inserted.some(text => text === "[[")) {
                            startCompletion(_codeEditorView);
                        }
                    }
                })
            ]
        });
    });
</script>
<div bind:this={codeElement} class="editor" style="height: 300px; overflow: scroll"></div>
