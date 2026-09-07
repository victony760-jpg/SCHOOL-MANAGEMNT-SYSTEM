import Class from "../models/Class.js";

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("classTeacher", "name email")
      .sort({ name: 1, arm: 1 })
      .lean({ virtuals: true });

    res
      .status(200)
      .json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const singleClass = await Class.findById(req.params.id)
      .populate("classTeacher", "name email")
      .lean({ virtuals: true });
    if (!singleClass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }
    res.status(200).json({ success: true, data: singleClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "A class with this name, arm, and academic session already exists.",
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("classTeacher", "name email")
      .lean({ virtuals: true });

    if (!updatedClass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    res.status(200).json({ success: true, data: updatedClass });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
