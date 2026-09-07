import Announcement from "../models/Announcement.js";

export const getAnnouncements = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : { audience: { $in: ["all", req.user.role] } };

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({
        success: true,
        count: announcements.length,
        data: announcements,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      audience: audience || "all",
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }
    res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
