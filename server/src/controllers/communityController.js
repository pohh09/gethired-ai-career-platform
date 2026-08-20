import SharedDocument from "../models/SharedDocument.js";
import UserStreak from "../models/UserStreak.js";
import SuccessStory from "../models/SuccessStory.js";
import CommunityQuestion from "../models/CommunityQA.js";
import User from "../models/User.js";

// Helper to get user display name
const getUserName = async (userId) => {
  try {
    const user = await User.findById(userId).select("name");
    return user ? user.name : "Community Member";
  } catch {
    return "Community Member";
  }
};

// -------------------------------------------------------------
// 1. PEER FEEDBACK (SHARED DOCUMENTS)
// -------------------------------------------------------------

export const getSharedDocuments = async (req, res) => {
  try {
    const { type, filter, search } = req.query;
    const userId = req.user?.userId;

    let query = {};

    if (filter === "mine") {
      query.userId = userId;
    } else {
      query.visibility = "shared";
    }

    if (type && type !== "all") {
      query.documentType = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { targetRole: { $regex: search, $options: "i" } },
        { targetCompany: { $regex: search, $options: "i" } },
      ];
    }

    const docs = await SharedDocument.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("Error fetching shared documents:", error);
    res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};

export const getSharedDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await SharedDocument.findById(id);

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ success: false, message: "Failed to fetch document" });
  }
};

export const createSharedDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const authorName = await getUserName(userId);
    const { title, documentType, targetRole, targetCompany, content, visibility, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const newDoc = await SharedDocument.create({
      userId,
      authorName,
      title,
      documentType: documentType || "resume",
      targetRole: targetRole || "Candidate",
      targetCompany: targetCompany || "",
      content,
      visibility: visibility || "private",
      tags: tags || [],
      feedbackList: [],
      feedbackCount: 0,
    });

    res.status(201).json({
      success: true,
      message: "Document shared successfully for peer review",
      data: newDoc,
    });
  } catch (error) {
    console.error("Error creating shared document:", error);
    res.status(500).json({ success: false, message: "Failed to create document" });
  }
};

export const toggleDocumentVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const doc = await SharedDocument.findOne({ _id: id, userId });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found or unauthorized" });
    }

    doc.visibility = doc.visibility === "shared" ? "private" : "shared";
    await doc.save();

    res.status(200).json({
      success: true,
      message: `Document visibility updated to ${doc.visibility}`,
      data: doc,
    });
  } catch (error) {
    console.error("Error updating visibility:", error);
    res.status(500).json({ success: false, message: "Failed to update visibility" });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const authorName = await getUserName(userId);
    const { comment, targetSection } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Feedback comment cannot be empty" });
    }

    const doc = await SharedDocument.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const newFeedback = {
      authorId: userId,
      authorName,
      comment: comment.trim(),
      targetSection: targetSection || "General",
      upvotes: [],
      upvoteCount: 0,
    };

    doc.feedbackList.push(newFeedback);
    doc.feedbackCount = doc.feedbackList.length;
    await doc.save();

    // Also award streak activity for feedback given
    try {
      await recordUserActivity(userId, "feedback_given", `Gave peer feedback on "${doc.title}"`);
    } catch (e) {
      console.warn("Could not log streak activity for feedback:", e.message);
    }

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: doc,
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ success: false, message: "Failed to add feedback" });
  }
};

export const toggleFeedbackUpvote = async (req, res) => {
  try {
    const { id, feedbackId } = req.params;
    const userId = req.user.userId;

    const doc = await SharedDocument.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const feedback = doc.feedbackList.id(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback comment not found" });
    }

    const alreadyUpvotedIndex = feedback.upvotes.findIndex(
      (uid) => uid.toString() === userId.toString()
    );

    if (alreadyUpvotedIndex > -1) {
      feedback.upvotes.splice(alreadyUpvotedIndex, 1);
    } else {
      feedback.upvotes.push(userId);
    }

    feedback.upvoteCount = feedback.upvotes.length;
    await doc.save();

    res.status(200).json({
      success: true,
      message: alreadyUpvotedIndex > -1 ? "Upvote removed" : "Marked as helpful!",
      data: doc,
    });
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ success: false, message: "Failed to upvote feedback" });
  }
};

// -------------------------------------------------------------
// 2. PROGRESS & ACCOUNTABILITY STREAKS
// -------------------------------------------------------------

const recordUserActivity = async (userId, type, title) => {
  const today = new Date().toISOString().split("T")[0];
  let streakDoc = await UserStreak.findOne({ userId });

  if (!streakDoc) {
    const authorName = await getUserName(userId);
    streakDoc = new UserStreak({
      userId,
      displayName: authorName,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
      activeDates: [today],
      activities: [],
    });
  }

  // Check date continuity
  const lastActive = streakDoc.lastActiveDate;
  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (lastActive === yesterday) {
      streakDoc.currentStreak += 1;
      if (streakDoc.currentStreak > streakDoc.longestStreak) {
        streakDoc.longestStreak = streakDoc.currentStreak;
      }
    } else {
      streakDoc.currentStreak = 1;
    }
    streakDoc.lastActiveDate = today;
    if (!streakDoc.activeDates.includes(today)) {
      streakDoc.activeDates.push(today);
    }
  }

  streakDoc.activities.unshift({
    type,
    title,
    date: today,
    timestamp: new Date(),
  });

  // Keep last 30 activities
  if (streakDoc.activities.length > 30) {
    streakDoc.activities = streakDoc.activities.slice(0, 30);
  }

  await streakDoc.save();
  return streakDoc;
};

export const getMyStreak = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split("T")[0];
    let streakDoc = await UserStreak.findOne({ userId });

    if (!streakDoc) {
      const name = await getUserName(userId);
      streakDoc = await UserStreak.create({
        userId,
        displayName: name,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        activeDates: [today],
        privacy: "named",
        targetWeeklyGoal: 5,
        activities: [
          {
            type: "daily_login",
            title: "Logged in to GetHired Hub",
            date: today,
            timestamp: new Date(),
          },
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: streakDoc,
    });
  } catch (error) {
    console.error("Error fetching user streak:", error);
    res.status(500).json({ success: false, message: "Failed to fetch streak data" });
  }
};

export const logUserActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, title } = req.body;

    if (!type || !title) {
      return res.status(400).json({ success: false, message: "Activity type and title are required" });
    }

    const streakDoc = await recordUserActivity(userId, type, title);

    res.status(200).json({
      success: true,
      message: "Activity logged and streak updated!",
      data: streakDoc,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ success: false, message: "Failed to log activity" });
  }
};

export const getCohortStreaks = async (req, res) => {
  try {
    const streaks = await UserStreak.find({ privacy: { $ne: "private" } })
      .sort({ currentStreak: -1 })
      .limit(20)
      .lean();

    const formatted = streaks.map((item, index) => ({
      rank: index + 1,
      id: item._id,
      displayName: item.privacy === "anonymized" ? `Anonymous Seeker #${item._id.toString().slice(-4)}` : item.displayName,
      currentStreak: item.currentStreak,
      longestStreak: item.longestStreak,
      activeDaysCount: item.activeDates?.length || item.currentStreak,
      lastActiveDate: item.lastActiveDate,
      isCurrentUser: item.userId.toString() === req.user?.userId?.toString(),
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching cohort streaks:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cohort streaks" });
  }
};

export const updateStreakPrivacy = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { privacy, targetWeeklyGoal } = req.body;

    let streakDoc = await UserStreak.findOne({ userId });
    if (!streakDoc) {
      const name = await getUserName(userId);
      streakDoc = new UserStreak({ userId, displayName: name });
    }

    if (privacy) streakDoc.privacy = privacy;
    if (targetWeeklyGoal) streakDoc.targetWeeklyGoal = Number(targetWeeklyGoal);

    await streakDoc.save();

    res.status(200).json({
      success: true,
      message: "Privacy & goal preferences updated",
      data: streakDoc,
    });
  } catch (error) {
    console.error("Error updating streak preferences:", error);
    res.status(500).json({ success: false, message: "Failed to update preferences" });
  }
};

// -------------------------------------------------------------
// 3. SUCCESS STORIES FEED
// -------------------------------------------------------------

export const getSuccessStories = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type && type !== "all") {
      query.storyType = type;
    }

    const stories = await SuccessStory.find(query).sort({ createdAt: -1 }).limit(30);

    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch success stories" });
  }
};

export const createSuccessStory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const authorName = await getUserName(userId);
    const { storyType, company, role, story, tips } = req.body;

    if (!company || !role || !story) {
      return res.status(400).json({ success: false, message: "Company, role, and story are required" });
    }

    const newStory = await SuccessStory.create({
      userId,
      authorName,
      storyType: storyType || "interview",
      company,
      role,
      story,
      tips: tips || "",
      congrats: [userId], // Author's initial cheer
      congratsCount: 1,
    });

    // Award streak activity
    await recordUserActivity(userId, "application_submitted", `Celebrated milestone at ${company}`);

    res.status(201).json({
      success: true,
      message: "Success story posted to community wall! 🎉",
      data: newStory,
    });
  } catch (error) {
    console.error("Error creating success story:", error);
    res.status(500).json({ success: false, message: "Failed to post success story" });
  }
};

export const toggleCongratsReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const story = await SuccessStory.findById(id);
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    const alreadyCheeredIndex = story.congrats.findIndex(
      (uid) => uid.toString() === userId.toString()
    );

    if (alreadyCheeredIndex > -1) {
      story.congrats.splice(alreadyCheeredIndex, 1);
    } else {
      story.congrats.push(userId);
    }

    story.congratsCount = story.congrats.length;
    await story.save();

    res.status(200).json({
      success: true,
      message: alreadyCheeredIndex > -1 ? "Congrats cheer removed" : "Sent congratulations! 🎉",
      data: story,
    });
  } catch (error) {
    console.error("Error toggling congrats:", error);
    res.status(500).json({ success: false, message: "Failed to react to story" });
  }
};

// -------------------------------------------------------------
// 4. COMMUNITY Q&A
// -------------------------------------------------------------

export const getQuestions = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const questions = await CommunityQuestion.find(query).sort({ upvoteCount: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch questions" });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const userId = req.user.userId;
    const authorName = await getUserName(userId);
    const { title, body, category, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: "Question title and body are required" });
    }

    const newQuestion = await CommunityQuestion.create({
      userId,
      authorName,
      title,
      body,
      category: category || "Interview Prep",
      tags: tags || [],
      upvotes: [],
      upvoteCount: 0,
      answers: [],
      answersCount: 0,
    });

    res.status(201).json({
      success: true,
      message: "Question posted to community forum",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ success: false, message: "Failed to post question" });
  }
};

export const toggleQuestionUpvote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const question = await CommunityQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const idx = question.upvotes.findIndex((uid) => uid.toString() === userId.toString());
    if (idx > -1) {
      question.upvotes.splice(idx, 1);
    } else {
      question.upvotes.push(userId);
    }

    question.upvoteCount = question.upvotes.length;
    await question.save();

    res.status(200).json({
      success: true,
      message: idx > -1 ? "Upvote removed" : "Question upvoted!",
      data: question,
    });
  } catch (error) {
    console.error("Error upvoting question:", error);
    res.status(500).json({ success: false, message: "Failed to upvote question" });
  }
};

export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const authorName = await getUserName(userId);
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, message: "Answer cannot be empty" });
    }

    const question = await CommunityQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const answer = {
      userId,
      authorName,
      body: body.trim(),
      upvotes: [],
      upvoteCount: 0,
      isHelpful: false,
    };

    question.answers.push(answer);
    question.answersCount = question.answers.length;
    await question.save();

    res.status(201).json({
      success: true,
      message: "Answer posted successfully",
      data: question,
    });
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ success: false, message: "Failed to post answer" });
  }
};
