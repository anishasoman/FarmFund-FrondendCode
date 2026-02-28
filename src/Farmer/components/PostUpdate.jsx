import { Card, Button, Textarea, Select, FileInput } from "flowbite-react";
import { Send, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PostUpdate({
  proposals,
  selectedProposal,
  setSelectedProposal,
  updateContent,
  setUpdateContent,
  onPost,
}) {
  const [mediaFiles, setMediaFiles] = useState([]);

  /* HANDLE MEDIA  */
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    setMediaFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(mediaFiles[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };


  useEffect(() => {
    return () => {
      mediaFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [mediaFiles]);

  /*submit*/
  const handleSubmit = () => {
    if (!selectedProposal || !updateContent) return;

    const formData = new FormData();
    formData.append("content", updateContent);

    mediaFiles.forEach((file) => {
      formData.append("media", file);
    });

    onPost(selectedProposal, formData);

    setUpdateContent("");
    setMediaFiles([]);
  };

  return (
    <Card className="space-y-4 dark:bg-gray-800">
      {/* Select Proposal */}
      <div>
        <label className="text-sm font-medium dark:text-white">
          Select Proposal
        </label>
        <Select
          value={selectedProposal}
          onChange={(e) => setSelectedProposal(e.target.value)}
        >
          <option value="">-- Select proposal --</option>
          {proposals.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </Select>
      </div>

      {/* Update Content */}
      <div>
        <label className="text-sm font-medium dark:text-white">
          Update Message
        </label>
        <Textarea
          rows={4}
          placeholder="Share progress, photos, or news..."
          value={updateContent}
          onChange={(e) => setUpdateContent(e.target.value)}
        />
      </div>

      {/* Media Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium dark:text-white">
          Add Photos / Videos (max 5)
        </label>

        <FileInput
          accept="image/*,video/*"
          multiple
          onChange={handleMediaChange}
        />

        {/* Preview */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {mediaFiles.map((file, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden border"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="h-24 w-full object-cover"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="h-24 w-full object-cover"
                    controls
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
      className="dark:text-white"
        color="success"
        onClick={handleSubmit}
        disabled={!selectedProposal || !updateContent}
      >
        <Send className="h-4 w-4 mr-2 dark:text-white" /> Post Update
      </Button>
    </Card>
  );
}
