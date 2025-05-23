import { useState, useEffect } from "react";
import { type Article } from "@/data/mockArticles"; // Assuming Article type is exported
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface BlogEditorProps {
  articleToEdit?: Article | null; // Pass an article to pre-fill the form for editing
  onSubmit: (formData: Partial<Article>) => Promise<void>; // Function to handle form submission
  isSubmitting?: boolean;
}

// Function to generate a slug (basic example)
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export default function BlogEditor({
  articleToEdit,
  onSubmit,
  isSubmitting,
}: BlogEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // This will store HTML string from CKEditor
  const [category, setCategory] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState(""); // Added excerpt state
  // Add more fields as needed: authorImageLink, excerpt, etc.

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title || "");
      setContent(articleToEdit.content || "");
      setCategory(articleToEdit.category || "");
      setImageLink(articleToEdit.imageLink || "");
      setSlug(articleToEdit.slug || "");
      setExcerpt(articleToEdit.excerpt || ""); // Set excerpt if editing
    } else {
      // Reset form for new post
      setTitle("");
      setContent("");
      setCategory("");
      setImageLink("");
      setSlug("");
      setExcerpt("");
    }
  }, [articleToEdit]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Siempre genera el slug desde el título, incluso en modo edición
    setSlug(generateSlug(newTitle));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: Partial<Article> = {
      title,
      content,
      category,
      imageLink,
      slug,
      excerpt, // Include excerpt in submitted data
    };
    if (articleToEdit?.id) {
      formData.id = articleToEdit.id; // Include ID if editing
    }
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-lg"
    >
      <div>
        <Label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter post title"
          required
          className="focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <Label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Slug (URL Path)
        </Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSlug(e.target.value)
          }
          placeholder="e.g., my-awesome-post"
          required
          className="focus:ring-orange-500 focus:border-orange-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Part of the URL. Auto-generated from title, can be manually edited.
        </p>
      </div>

      <div>
        <Label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </Label>
        <Input
          id="category"
          value={category}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCategory(e.target.value)
          }
          placeholder="e.g., JavaScript, Web Design"
          required
          className="focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <Label
          htmlFor="imageLink"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Main Image URL
        </Label>
        <Input
          id="imageLink"
          type="url"
          value={imageLink}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setImageLink(e.target.value)
          }
          placeholder="https://example.com/image.jpg"
          required
          className="focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <Label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Excerpt (Short Summary)
        </Label>
        <Input
          id="excerpt"
          value={excerpt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setExcerpt(e.target.value)
          }
          placeholder="A brief summary of your post (max 200 characters recommended)"
          maxLength={250}
          className="focus:ring-orange-500 focus:border-orange-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          A short description that will appear in post previews. If left empty,
          it might be auto-generated from content.
        </p>
      </div>

      <div>
        <Label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </Label>
        <div className="prose max-w-none">
          <CKEditor
            editor={ClassicEditor as any}
            data={content}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              setContent(data);
            }}
            onReady={(editor) => {
              const editable = editor.ui.getEditableElement();
              editable.style.minHeight = "300px";
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md disabled:opacity-70 text-lg"
      >
        {isSubmitting
          ? "Submitting..."
          : articleToEdit
          ? "Update Post"
          : "Create Post"}
      </Button>
    </form>
  );
}
