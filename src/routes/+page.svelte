<script>
    import "./editor.css";
    import { onMount } from "svelte";
    import {basicSetup as CodeBasicSetup} from "codemirror";
    import {EditorView as CodeEditorView, keymap } from "@codemirror/view";
    import {Compartment} from "@codemirror/state";
    import {markdown} from "@codemirror/lang-markdown";
    import { autocompletion, completionKeymap } from "@codemirror/autocomplete";

    let languageConf = new Compartment;
    let codeElement;
    let _codeEditorView;

    const items = [
        {label: "[[ab", detail: "Detail about Item0"},
        {label: "Item1", detail: "Detail about Item1"},
        {label: "Item2", detail: "Detail about Item2"},
        {label: "Item3", detail: "Detail about Item3"}
    ];

    function complete(context) {
        let before = context.matchBefore(/\[\[$/);
        if (!before) return null;  // Rien si le déclencheur '[[ 'n'est pas présent
        console.log("ici1");

        return {
            from: before.from,
            options: items.map(item => ({label: item.label, detail: item.detail, type: "text"})),
            filter: false,
            validFor: /^[\w\s]*$/
        };
    }

    onMount(() => {
        _codeEditorView = new CodeEditorView({
            parent: codeElement,
            doc: "Hello world",
            extensions: [
                CodeBasicSetup,
                languageConf.of(markdown()),
                autocompletion({
                    override: [complete],
                    activateOnTyping: true
                }),
                keymap.of([...completionKeymap])
            ]
        });
    });
</script>
<div bind:this={codeElement} class="editor" style="height: 300px; overflow: scroll"></div>
