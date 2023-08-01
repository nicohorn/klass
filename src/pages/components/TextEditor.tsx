// src/Tiptap.jsx
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import React, { useState, useCallback, useEffect } from "react";

const Tiptap = ({
  setDescription,
  editable = true,
  content = "<p>Descripción del producto</p>",
}: {
  setDescription?: React.Dispatch<any>;
  editable?: boolean;
  content?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "underline cursor-pointer",
        },
      }),
    ],
    editable: editable,
    content: content,
  });

  useEffect(() => {
    if (editor && setDescription) {
      const productDescription = editor.getHTML();
      setDescription(productDescription);
    }
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Link", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .toggleLink({ href: url })
        .run();

      return;
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .toggleLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const MenuBar = ({ editor }) => {
    if (!editor) {
      return null;
    }
    return (
      <div className="flex gap-2 flex-wrap px-2 py-1 my-1 text-xs ">
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().toggleBold().run();
            document.getElementById("text-editor").focus();
          }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "uppercase border bg-white font-bold text-primary px-1"
              : "uppercase border font-bold px-1"
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
              ? "uppercase border bg-white italic text-primary px-1"
              : "uppercase border italic px-1"
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
              ? "uppercase border line-through bg-white text-primary px-1"
              : "uppercase border px-1 line-through"
          }
        >
          strike
        </button>
        <button
          type="button"
          onClick={setLink}
          className={
            editor.isActive("link")
              ? "uppercase border bg-white text-primary px-1"
              : "uppercase border px-1"
          }
        >
          Link
        </button>
        <button
          type="button"
          className="uppercase border px-1 cursor-pointer"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
        >
          Unlink
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`${editable && "border"}`}>
        {editable && <MenuBar editor={editor} />}
        <EditorContent
          id="text-editor"
          className={`${
            editable &&
            "py-2 px-3 text-xs focus:border-yellow-500 border-t min-h-[150px]"
          }`}
          editor={editor}
        />
      </div>
    </>
  );
};

export default Tiptap;
