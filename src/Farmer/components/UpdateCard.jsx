import { useState } from "react";
import { Card, Button, TextInput } from "flowbite-react";
import { MessageCircle, Send } from "lucide-react";
import { serverURL } from "../../services/serverURL";
import { postCommentAPI } from "../../services/allAPIs";

export default function UpdateCard({ update, proposalId }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(update.comments || []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = sessionStorage.getItem("token");
    if (!token) return alert("Please login");

    const reqHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    if (!proposalId || !update?._id) {
      console.error("Missing proposalId or updateId", {
        proposalId,
        updateId: update?._id,
      });
      return;
    }
    const reqBody = { content: newComment };

    try {
      const res = await postCommentAPI(
        proposalId,
        update._id,
        reqBody,
        reqHeader,
      );

      setComments(res.data.update.comments);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  return (
    <Card className="rounded-2xl shadow-md dark:bg-gray-800">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-semibold dark:text-white">Project Update</p>
          <span className="text-xs text-gray-400">
            {new Date(update.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {update.content}
        </p>

        {/* Media*/}
        {update.media?.length > 0 && (
          <div
            className={`grid gap-3 ${
              update.media.length > 1 ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {update.media.map((item) => (
              <div
                key={item._id}
                className="rounded-xl overflow-hidden bg-black/5 dark:bg-black/20 flex justify-center"
              >
                {item.type === "image" ? (
                  <img
                    src={`${item.url}`}
                    alt=""
                    className="w-full max-h-[420px] object-contain"
                  />
                ) : (
                  <video
                    src={`${item.url}`}
                    controls
                    className="w-full max-h-[420px] object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Toggle Comments */}
        <Button
          color="light"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {comments.length} Comments
        </Button>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 border-t dark:border-gray-700 space-y-4">
            {/* Scrollable Comments */}
            <div className="max-h-42 overflow-y-auto pr-2 space-y-3">
              {comments.length > 0 ? (
                comments.map((comment, i) => (
                  <div
                    key={i}
                    className="flex gap-1 items-start bg-gray-100 dark:bg-gray-700 rounded-xl p-2 shadow-sm"
                  >
                    {/* Avatar */}
                    <img
                      src={
                        comment.investerimg
                          ? `${comment.investerimg}`
                          : "https://ui-avatars.com/api/?name=User&background=22c55e&color=fff"
                      }
                      alt={comment.investorName}
                      className="w-10 h-10 rounded-full object-cover border shrink-0"
                    />

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {comment.investorName || "Investor"}
                        </p>

                        {comment.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short" },
                            )}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-200 mt-1 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center">
                  No comments yet
                </p>
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <TextInput
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <Button color="success" onClick={handleAddComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
