// src/Tiptap.jsx
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import React, { useState, useCallback } from "react";

const Tiptap = () => {
  const [editorFocused, setEditorFocus] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: true })],

    content: "<p>Hello World!</p>",
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const MenuBar = ({ editor }) => {
    if (!editor) {
      return null;
    }
    return (
      <div className="flex gap-2 flex-wrap px-2 py-1 mt-1 text-xs ">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "uppercase font-bold border bg-white text-primary px-1"
              : "uppercase border px-1"
          }
        >
          bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "uppercase font-bold border bg-white text-primary px-1"
              : "uppercase border px-1"
          }
        >
          italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "uppercase font-bold border bg-white text-primary px-1"
              : "uppercase border px-1"
          }
        >
          strike
        </button>
        <button
          type="button"
          onClick={setLink}
          className={
            editor.isActive("link")
              ? "uppercase font-bold border bg-white text-primary px-1"
              : "uppercase border px-1"
          }
        >
          setLink
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
        >
          unsetLink
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`border ${editorFocused ? "border-yellow-500" : null}`}>
        <MenuBar editor={editor} />
        <EditorContent
          onClick={() => {
            setEditorFocus(true);
          }}
          onBlur={() => {
            setEditorFocus(false);
          }}
          id="text-editor"
          className="py-4 pl-4 text-xs mr-4"
          editor={editor}
        />
      </div>
    </>
  );
};

export default Tiptap;
