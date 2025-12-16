// const mongoose = require('mongoose');

// const feeSchema = new mongoose.Schema({
//   student: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Student', 
//     required: true,
//     index: true
//   },
//   amount: { 
//     type: Number, 
//     required: true,
//     min: 0
//   },
//   month: {
//     type: String, // Format: "YYYY-MM"
//     required: true,
//     match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
//   },
//   dueDate: {
//     type: Date,
//     required: true
//   },
//   status: { 
//     type: String, 
//     enum: ['pending', 'paid', 'overdue', 'partial'], 
//     default: 'pending',
//     index: true
//   },
//   paidAmount: {
//     type: Number,
//     default: 0
//   },
//   paymentDate: {
//     type: Date
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['cash', 'online', 'bank_transfer', 'cheque'],
//     default: 'cash'
//   },
//   remarks: String
// }, {
//   timestamps: true
// });

// // Compound index for unique monthly fee per student
// feeSchema.index({ student: 1, month: 1 }, { unique: true });

// // Check/Update status middleware
// feeSchema.pre('save', function(next) {
//   if (this.paidAmount >= this.amount) {
//     this.status = 'paid';
//   } else if (this.paidAmount > 0) {
//     this.status = 'partial';
//   }
  
//   if (this.status !== 'paid' && new Date() > this.dueDate) {
//     this.status = 'overdue';
//   }
  
//   next();
// });

// module.exports = mongoose.model('Fee', feeSchema);
