const emailService = require("../services/email/emailService");

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body; 

    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }

    const contactName = name || "Anonymous";
    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    
    if (!adminEmail) {
        throw new Error("Admin email not defined in environment variables");
      }
  

    // Send confirmation email to user
    await emailService.sendContactUsEmailtoUser(email, contactName);

    // Send notification email to admin
    await emailService.sendContactUsEmailToAdmin(adminEmail,{
      name: contactName,
      email,
      message,
    });

    return res
      .status(200)
      .json({ message: "Contact request submitted successfully." });
  } catch (error) {
    console.error(`Error sending emails: ${error.message}`);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  sendContactEmail,
};
