const User = require('../models/User');

const createOrUpdateProfile = async (req, res, next) => {
  try {
    const { bio, skills, education, title } = req.body;

    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (education !== undefined) updates.education = education;
    if (title !== undefined) updates.title = title;
    if (skills !== undefined) {
      updates.skills = Array.isArray(skills)
        ? skills
        : String(skills)
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      message: 'Profile saved successfully.',
      profile: user
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfileById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    const users = await User.find({
      name: { $regex: q, $options: 'i' }
    })
      .select('name title profilePicture bio skills')
      .limit(20);

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateProfile,
  getUserProfileById,
  searchUsers
};
