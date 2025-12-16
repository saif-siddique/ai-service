// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//   recipient: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true,
//     index: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ['info', 'warning', 'success', 'error', 'fee', 'complaint'],
//     default: 'info'
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//     index: true
//   },
//   link: {
//     type: String // Optional link to related resource
//   },
//   relatedId: {
//     type: mongoose.Schema.Types.ObjectId // Reference to related entity (Fee, Complaint ID)
//   }
// }, {
//   timestamps: true,
//   expires: 2592000 // Auto-delete after 30 days (TTL Index)
// });

// module.exports = mongoose.model('Notification', notificationSchema);
