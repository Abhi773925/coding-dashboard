const SupportTicket = require('../models/SupportTicket');
const CVAnalysis = require('../models/CVAnalysis');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const nodemailer = require('nodemailer');

// Create email transporter (configure with your email service)
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Create support ticket
exports.createSupportTicket = async (req, res) => {
  try {
    const { type, priority, subject, description, attachments } = req.body;

    const ticket = new SupportTicket({
      user: req.user.id,
      type,
      priority: priority || 'medium',
      subject,
      description,
      attachments: attachments || []
    });

    await ticket.save();

    // Send confirmation email
    try {
      const transporter = createEmailTransporter();
      const user = await User.findById(req.user.id);
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Support Ticket Created - ${ticket.ticketId}`,
        html: `
          <h2>Support Ticket Created</h2>
          <p>Dear ${user.name},</p>
          <p>Your support ticket has been created successfully.</p>
          <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p>We will respond to your ticket within 24-48 hours.</p>
          <p>Best regards,<br>Support Team</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      message: 'Support ticket created successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating support ticket', error: error.message });
  }
};

// Get user tickets
exports.getUserTickets = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const tickets = await SupportTicket.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('assignedTo', 'name email')
      .select('-messages.isInternal');

    const total = await SupportTicket.countDocuments(filter);

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await SupportTicket.findOne({
      $or: [
        { _id: ticketId },
        { ticketId: ticketId }
      ]
    })
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .populate('messages.sender', 'name email')
    .populate('cvReview.reviewedBy', 'profile.title user')
    .populate({
      path: 'cvReview.reviewedBy',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check authorization
    if (ticket.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to view this ticket' });
    }

    // Filter out internal messages for regular users
    if (!req.user.isAdmin) {
      ticket.messages = ticket.messages.filter(msg => !msg.isInternal);
    }

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};

// Add message to ticket
exports.addTicketMessage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message, attachments } = req.body;

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check authorization
    if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to add message to this ticket' });
    }

    ticket.messages.push({
      sender: req.user.id,
      message,
      attachments: attachments || [],
      isInternal: false
    });

    // Update ticket status if it was resolved
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      ticket.status = 'in-progress';
    }

    await ticket.save();

    // Send notification email
    try {
      const transporter = createEmailTransporter();
      const user = await User.findById(ticket.user);
      
      if (user && req.user.id !== ticket.user.toString()) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `New Response - Ticket ${ticket.ticketId}`,
          html: `
            <h2>New Response to Your Support Ticket</h2>
            <p>Dear ${user.name},</p>
            <p>There's a new response to your support ticket.</p>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px;">
              ${message}
            </div>
            <p>Please log in to your account to view the full conversation.</p>
            <p>Best regards,<br>Support Team</p>
          `
        });
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      message: 'Message added successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding message', error: error.message });
  }
};

// Submit CV for review
exports.submitCVForReview = async (req, res) => {
  try {
    const { cvUrl, targetRole } = req.body;

    // Check if user has active subscription for CV review or pay per service
    // For now, we'll create the analysis directly

    const cvAnalysis = new CVAnalysis({
      user: req.user.id,
      cvFile: {
        filename: 'resume.pdf',
        url: cvUrl,
        fileType: 'application/pdf'
      },
      analysis: {
        industrySpecific: {
          targetRole: targetRole || 'Software Developer'
        }
      },
      reviewType: 'automated',
      payment: {
        amount: 29.99, // Set your CV review price
        paymentStatus: 'pending'
      }
    });

    // Perform automated analysis (simplified version)
    const automatedAnalysis = await performAutomatedCVAnalysis(cvUrl, targetRole);
    cvAnalysis.analysis = { ...cvAnalysis.analysis, ...automatedAnalysis };
    cvAnalysis.status = 'completed';
    cvAnalysis.reviewDate = new Date();

    await cvAnalysis.save();

    // Create support ticket for CV review
    const ticket = new SupportTicket({
      user: req.user.id,
      type: 'cv-review',
      priority: 'medium',
      subject: `CV Review Request - ${targetRole || 'General'}`,
      description: `CV review requested for ${targetRole || 'general position'}`,
      cvReview: {
        cvUrl,
        reviewDate: new Date(),
        rating: automatedAnalysis.overallScore / 10
      }
    });

    await ticket.save();

    res.status(201).json({
      message: 'CV submitted for review successfully',
      analysisId: cvAnalysis._id,
      ticketId: ticket.ticketId,
      analysis: cvAnalysis.analysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting CV for review', error: error.message });
  }
};

// Automated CV analysis function (simplified)
const performAutomatedCVAnalysis = async (cvUrl, targetRole) => {
  // This is a simplified version. In production, you'd integrate with CV parsing services
  const analysis = {
    overallScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
    sections: {
      contactInfo: {
        score: 85,
        feedback: "Contact information is clear and professional",
        suggestions: ["Consider adding LinkedIn profile", "Include location"]
      },
      summary: {
        score: 75,
        feedback: "Summary section needs improvement",
        suggestions: ["Make it more concise", "Highlight key achievements", "Include relevant keywords"]
      },
      experience: {
        score: 80,
        feedback: "Good experience section with relevant details",
        suggestions: ["Use more action verbs", "Quantify achievements", "Include technology stack"]
      },
      education: {
        score: 90,
        feedback: "Education section is well formatted",
        suggestions: ["Add relevant coursework", "Include GPA if above 3.5"]
      },
      skills: {
        score: 70,
        feedback: "Skills section could be more comprehensive",
        suggestions: ["Organize by category", "Include proficiency levels", "Add soft skills"]
      },
      projects: {
        score: 85,
        feedback: "Projects demonstrate practical experience",
        suggestions: ["Add project links", "Include technologies used", "Mention impact/results"]
      },
      formatting: {
        score: 90,
        feedback: "Clean and professional formatting",
        suggestions: ["Consistent font usage", "Proper spacing"]
      }
    },
    strengths: [
      "Clear professional experience",
      "Good technical skills",
      "Clean formatting",
      "Relevant project experience"
    ],
    weaknesses: [
      "Summary could be more impactful",
      "Missing quantified achievements",
      "Skills section needs organization"
    ],
    recommendations: [
      {
        category: "Content",
        priority: "high",
        description: "Add quantified achievements to demonstrate impact",
        example: "Increased system performance by 30% through optimization"
      },
      {
        category: "Keywords",
        priority: "medium",
        description: "Include more industry-specific keywords",
        example: "Add terms like 'agile', 'microservices', 'cloud computing'"
      }
    ],
    industrySpecific: {
      targetRole: targetRole || 'Software Developer',
      relevanceScore: 85,
      missingKeywords: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      suggestedKeywords: ['React', 'Node.js', 'MongoDB', 'Git', 'Agile']
    }
  };

  return analysis;
};

// Get CV analysis by ID
exports.getCVAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;
    
    const analysis = await CVAnalysis.findById(analysisId)
      .populate('user', 'name email')
      .populate('mentor', 'profile user')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!analysis) {
      return res.status(404).json({ message: 'CV analysis not found' });
    }

    // Check authorization
    if (analysis.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to view this analysis' });
    }

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CV analysis', error: error.message });
  }
};

// Get user's CV analyses
exports.getUserCVAnalyses = async (req, res) => {
  try {
    const analyses = await CVAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('mentor', 'profile user')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    res.json({ analyses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CV analyses', error: error.message });
  }
};

module.exports = exports;
