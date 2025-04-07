
const asyncHandler = require('express-async-handler');
const Note = require('../models/noteModel');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.status(200).json(notes);
});

// @desc    Get note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if the note belongs to the user
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(note);
});

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { title, content, category, color } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Please add a title and content');
  }

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    category: category || 'General',
    color: color || '#ffffff',
  });

  res.status(201).json(note);
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if the note belongs to the user
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedNote);
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if the note belongs to the user
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await note.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get all categories
// @route   GET /api/notes/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  
  // Extract unique categories
  const categories = [...new Set(notes.map(note => note.category))];
  
  res.status(200).json(categories);
});

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getCategories,
};
