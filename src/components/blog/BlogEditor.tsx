import { useState, useEffect } from "react";
import { type Article } from "@/data/mockArticles"; // Assuming Article type is exported
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// Consider a Rich Text Editor or Markdown Editor component for the 'content' field later
// import { YourRichTextEditor } from '@/components/ui/your-rich-text-editor';

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
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [slug, setSlug] = useState("");
  // Add more fields as needed: authorImageLink, excerpt, etc.

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title || "");
      setContent(articleToEdit.content || "");
      setCategory(articleToEdit.category || "");
      setImageLink(articleToEdit.imageLink || "");
      setSlug(articleToEdit.slug || "");
    }
  }, [articleToEdit]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug from title, but allow manual override later if needed
    if (!articleToEdit?.slug) {
      // Or if a specific "auto-slug" checkbox is checked
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: Partial<Article> = {
      title,
      content,
      category,
      imageLink,
      slug,
      // If editing, you might want to include the id: articleToEdit?.id
      // publishDate and author would likely be set by the backend or context
    };
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 md:p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg"
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
          This will be part of the URL. Auto-generated from title.
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
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          placeholder="Write your blog post content here... Markdown is supported by default with a simple textarea, or integrate a rich text editor."
          rows={10}
          required
          className="focus:ring-orange-500 focus:border-orange-500"
        />
        {/* Replace Textarea with a Rich Text Editor component for better UX later */}
        {/* <YourRichTextEditor value={content} onChange={setContent} /> */}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-70"
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
