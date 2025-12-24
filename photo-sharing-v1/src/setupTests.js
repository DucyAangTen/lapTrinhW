// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// ///// I) xoá comment

// // Backend file PhotoRouter.js

// // DELETE /comments/:commentId
// router.delete("/comments/:commentId", requireAuth, async (req, res) => {
//     const commentId = req.params.commentId;
//     const userId = req.session.user._id;

//     try {
//       // 1. Tìm photo chứa comment
//       const photo = await Photo.findOne({ "comments._id": commentId });
//       if (!photo) return res.status(404).send({ error: "Comment not found" });

//       // 2. Kiểm tra quyền owner comment
//       const comment = photo.comments.id(commentId);
//       if (comment.user_id.toString() !== userId) {
//         return res.status(403).send({ error: "Unauthorized" });
//       }

//       // 3. Xóa và lưu
//       photo.comments.pull(commentId);
//       await photo.save();

//       res.status(200).send({ message: "Comment deleted" });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).send({ error: "Server error" });
//     }
//   });

//   // frontend UserPhoto.js

//   // Hàm xử lý xóa
//   const handleDeleteComment = async (photoId, commentId) => {
//     if (!window.confirm("Delete this comment?")) return;

//     try {
//       const res = await fetch(`/photosOfUser/comments/${commentId}`, {
//         method: 'DELETE',
//         credentials: 'include'
//       });

//       if (!res.ok) throw new Error('Delete failed');

//       // Cập nhật UI: Lọc bỏ comment đã xóa
//       setPhotos(photos => photos.map(p =>
//         p._id === photoId
//           ? { ...p, comments: p.comments.filter(c => c._id !== commentId) }
//           : p
//       ));
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Delete failed. Try again.");
//     }
//   };

//   // Thêm nút Delete (chỉ hiển thị với owner)
//   {currentUser?._id === comment.user._id && (
//     <Button onClick={() => handleDeleteComment(photo._id, comment._id)}>
//       Delete
//     </Button>
//   )}
// ///

// // edit comment

// // Backend (PhotoRouter.js)

// // PUT /comments/:commentId
// router.put("/comments/:commentId", requireAuth, async (req, res) => {
//     const { commentId } = req.params;
//     const { comment: newText } = req.body;
//     const userId = req.session.user._id;

//     try {
//       // 1. Tìm photo và comment
//       const photo = await Photo.findOne({ "comments._id": commentId });
//       if (!photo) return res.status(404).send({ error: "Comment not found" });

//       // 2. Kiểm tra quyền
//       const comment = photo.comments.id(commentId);
//       if (comment.user_id.toString() !== userId) {
//         return res.status(403).send({ error: "Unauthorized" });
//       }

//       // 3. Cập nhật
//       comment.comment = newText;
//       comment.date_time = new Date();
//       await photo.save();

//       // 4. Trả về comment đã cập nhật
//       res.status(200).json({
//         _id: comment._id,
//         comment: comment.comment,
//         date_time: comment.date_time,
//         user: { /* ... */ } // Giữ nguyên user info
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).send({ error: "Server error" });
//     }
//   });
//   // Frontend (UserPhotos.jsx)

//   // State quản lý chỉnh sửa
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editedCommentText, setEditedCommentText] = useState("");

//   // Hàm xử lý
//   const handleSaveEdit = async (photoId, commentId) => {
//     try {
//       const res = await fetch(`/photosOfUser/comments/${commentId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ comment: editedCommentText }),
//         credentials: 'include'
//       });

//       const updatedComment = await res.json();

//       // Cập nhật UI: Chỉ thay đổi text và date_time
//       setPhotos(photos => photos.map(p => ({
//         ...p,
//         comments: p.comments.map(c =>
//           c._id === commentId
//             ? { ...c,
//                 comment: updatedComment.comment,
//                 date_time: updatedComment.date_time
//               }
//             : c
//         )
//       })));

//       setEditingCommentId(null); // Tắt chế độ chỉnh sửa
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Update failed.");
//     }
//   };

//   // Giao diện
//   {editingCommentId === comment._id ? (
//     <>
//       <TextField
//         value={editedCommentText}
//         onChange={(e) => setEditedCommentText(e.target.value)}
//       />
//       <Button onClick={() => handleSaveEdit(photo._id, comment._id)}>Save</Button>
//       <Button onClick={() => setEditingCommentId(null)}>Cancel</Button>
//     </>
//   ) : (
//     <Button onClick={() => {
//       setEditingCommentId(comment._id);
//       setEditedCommentText(comment.comment);
//     }}>
//       Edit
//     </Button>
//   )}
