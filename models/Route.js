const mongoose = require('mongoose');


const routeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  destination: String,
  type: { type: String, enum: ['hike', 'bike'] },
  pathEncoded: { type: String, required: true },
  pathDaysEncoded: { type: [String], default: [] }
}, { timestamps: true });


module.exports = mongoose.model('Route', routeSchema); 