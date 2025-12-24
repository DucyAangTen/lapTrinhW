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
// Chào bạn, ý tưởng nâng cấp của bạn rất thiết thực. Đây là những tính năng cơ bản mà bất kỳ ứng dụng thực tế nào cũng phải có.

// Để tránh bị ngợp vì quá nhiều code, tôi sẽ hướng dẫn bạn làm 3 tính năng quan trọng nhất trước, liên quan trực tiếp đến trải nghiệm xem và quản lý ảnh:

// Xóa Ảnh (Delete Photo): Tính năng CRUD cơ bản.

// Xóa Comment (Delete Comment): Xử lý dữ liệu lồng nhau (Nested Data).

// Thanh tìm kiếm User (Search Bar): Cải thiện UX ở Sidebar.

// Dưới đây là code chi tiết cho từng phần.

// Tính năng 1: Xóa Ảnh (Backend + Frontend)
// Bạn cần tạo API để xóa ảnh trong Database và nút bấm ở Frontend.

// 1. Sửa Backend (photo-sharing-backend/routes/PhotoRouter.js)
// Thêm đoạn code này vào trước dòng module.exports = router;:

// JavaScript

// /**
//  * DELETE /photos/:id - Xóa ảnh theo ID
//  */
// router.delete("/:id", async (req, res) => {
//   try {
//     // Kiểm tra xem có đăng nhập chưa
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const photoId = req.params.id;
    
//     // Tìm ảnh để kiểm tra quyền sở hữu (chỉ chủ ảnh mới được xóa)
//     const photo = await Photo.findById(photoId);
//     if (!photo) {
//       return res.status(404).json({ error: "Photo not found" });
//     }

//     if (photo.user_id.toString() !== req.session.user._id) {
//       return res.status(403).json({ error: "You can only delete your own photos" });
//     }

//     // Xóa ảnh
//     await Photo.findByIdAndDelete(photoId);
//     console.log("Deleted photo:", photoId);
//     res.status(200).json({ message: "Photo deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting photo:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// 2. Sửa Frontend (photo-sharing-v1/src/components/UserPhotos/index.jsx)
// Chúng ta sẽ thêm một nút "Delete" vào mỗi bức ảnh.

// Bước A: Import icon xóa ở đầu file:

// JavaScript

// import { IconButton } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useAuth } from "../../context/AuthContext"; // Import để lấy thông tin user hiện tại
// Bước B: Thêm hàm xử lý xóa (bên trong component UserPhotos):

// JavaScript

//   const { currentUser } = useAuth(); // Lấy thông tin người đang đăng nhập

//   const handleDeletePhoto = async (photoId) => {
//     if (!window.confirm("Are you sure you want to delete this photo?")) return;

//     try {
//       const response = await fetch(`http://localhost:8081/photos/${photoId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (response.ok) {
//         // Cập nhật lại giao diện bằng cách lọc bỏ ảnh vừa xóa
//         setPhotos(photos.filter(p => p._id !== photoId));
//       } else {
//         alert("Failed to delete photo");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };
// Bước C: Chèn nút xóa vào giao diện (Trong phần return, tìm chỗ hiển thị CardContent hoặc tiêu đề):

// JavaScript

// {/* Tìm đoạn hiển thị ngày tháng posted date, thêm đoạn kiểm tra này vào cạnh đó hoặc trên đầu */}
// <Box display="flex" justifyContent="space-between" alignItems="center">
//     <Typography variant="body2" color="textSecondary">
//         Posted on {formatDate(photo.date_time)}
//     </Typography>
    
//     {/* Chỉ hiện nút xóa nếu người xem là chủ sở hữu ảnh */}
//     {currentUser && currentUser._id === photo.user_id && (
//         <IconButton onClick={() => handleDeletePhoto(photo._id)} color="error">
//             <DeleteIcon />
//         </IconButton>
//     )}
// </Box>
// Tính năng 2: Xóa Comment (Backend + Frontend)
// Xóa comment khó hơn chút vì nó nằm lồng bên trong ảnh.

// 1. Sửa Backend (photo-sharing-backend/routes/PhotoRouter.js)
// Thêm API xóa comment:

// JavaScript

// /**
//  * DELETE /photos/comments/:photoId/:commentId - Xóa comment
//  */
// router.delete("/comments/:photoId/:commentId", async (req, res) => {
//   try {
//     if (!req.session.user) return res.status(401).json({ error: "Login required" });

//     const { photoId, commentId } = req.params;
//     const photo = await Photo.findById(photoId);

//     if (!photo) return res.status(404).json({ error: "Photo not found" });

//     // Tìm comment trong mảng
//     const comment = photo.comments.id(commentId);
//     if (!comment) return res.status(404).json({ error: "Comment not found" });

//     // Kiểm tra quyền: Chỉ người viết comment mới được xóa
//     if (comment.user_id.toString() !== req.session.user._id) {
//        return res.status(403).json({ error: "Not authorized" });
//     }

//     // Xóa comment khỏi mảng
//     photo.comments.pull(commentId);
//     await photo.save();

//     res.status(200).json({ message: "Comment deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error deleting comment" });
//   }
// });
// 2. Sửa Frontend (photo-sharing-v1/src/components/UserPhotos/index.jsx)
// Bước A: Thêm hàm xử lý (bên trong component UserPhotos):

// JavaScript

//   const handleDeleteComment = async (photoId, commentId) => {
//     if (!window.confirm("Delete this comment?")) return;
    
//     try {
//       const response = await fetch(`http://localhost:8081/photos/comments/${photoId}/${commentId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (response.ok) {
//         // Cập nhật state photos để xóa comment ngay lập tức trên giao diện
//         const newPhotos = photos.map(photo => {
//             if (photo._id === photoId) {
//                 return {
//                     ...photo,
//                     comments: photo.comments.filter(c => c._id !== commentId)
//                 };
//             }
//             return photo;
//         });
//         setPhotos(newPhotos);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };
// Bước B: Sửa phần hiển thị comment (tìm chỗ map comments):

// JavaScript

// {photo.comments.map((comment) => (
//   <Paper key={comment._id} elevation={1} sx={{ mb: 2, p: 2, position: 'relative' }}>
//     {/* Thêm nút xóa comment */}
//     {currentUser && currentUser._id === comment.user._id && (
//         <IconButton 
//             size="small" 
//             onClick={() => handleDeleteComment(photo._id, comment._id)}
//             sx={{ position: 'absolute', top: 5, right: 5 }}
//         >
//             <DeleteIcon fontSize="small" />
//         </IconButton>
//     )}
    
//     <Typography variant="body2" color="textSecondary">
//       {formatDate(comment.date_time)}
//     </Typography>
//     {/* ... code hiển thị tên và nội dung giữ nguyên ... */}
//   </Paper>
// ))}
// Tính năng 3: Thanh tìm kiếm User (Frontend Only)
// Với danh sách user ít, ta xử lý lọc ngay tại trình duyệt cho nhanh ("Client-side filtering"), không cần sửa backend.

// Sửa Frontend (photo-sharing-v1/src/components/UserList/index.jsx)
// Bước A: Import TextField (nếu chưa có) và useState:

// JavaScript

// import { TextField, Box } from "@mui/material"; // Thêm Box
// // useState và useEffect đã có sẵn
// Bước B: Thêm state quản lý từ khóa tìm kiếm:

// JavaScript

// function UserList() {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // State mới
//   // ... useEffect giữ nguyên
// Bước C: Tạo biến lọc danh sách:

// JavaScript

//   // Lọc user dựa trên tên nhập vào
//   const filteredUsers = users.filter(user => 
//     (user.first_name + " " + user.last_name).toLowerCase().includes(searchTerm.toLowerCase())
//   );
// Bước D: Sửa phần return để thêm ô input và dùng filteredUsers:

// JavaScript

//   return (
//     <div>
//       <Typography variant="h5" gutterBottom>Users</Typography>
      
//       {/* Ô tìm kiếm mới */}
//       <Box sx={{ px: 2, mb: 2 }}>
//         <TextField
//             fullWidth
//             size="small"
//             label="Search user..."
//             variant="outlined"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </Box>

//       <List component="nav">
//         {/* Đổi users.map thành filteredUsers.map */}
//         {filteredUsers.map((user) => (
//           <React.Fragment key={user._id}>
//              {/* ... Code ListItem giữ nguyên ... */}
//           </React.Fragment>
//         ))}
//       </List>
//     </div>
//   );
// Tổng kết
// Bạn hãy thực hiện lần lượt:

// Backend: Copy code vào PhotoRouter.js, nhớ restart server (node index.js) để nó nhận API mới.

// Frontend: Sửa UserPhotos để thêm nút xóa ảnh/comment, sửa UserList để thêm ô tìm kiếm.

// Sau khi làm xong 3 cái này, project của bạn đã xịn hơn rất nhiều rồi. Phần Đổi mật khẩu liên quan đến form và bảo mật khá dài, nếu bạn làm xong 3 cái trên chạy ổn định thì bảo tôi, tôi gửi tiếp phần Đổi mật khẩu nhé!