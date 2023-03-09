const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: String,
    description: String,


});
export const Category = mongoose.model('Category', categorySchema);