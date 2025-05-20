const nodemailer = require('nodemailer');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');

class EmailService {
  constructor() {
    this.templates = {};
    this.transporter = this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      let transporter = nodemailer.createTransport({
        pool: true,
        maxConnections: 5,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      transporter.verify((error) => {
        if (error) {
          logger.error('Email service verification failed:', error);
        } else {
          logger.info('Email service is ready to send emails');
        }
      });

      return transporter;
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
      throw error;
    }
  }

  async loadTemplate(templateName) {
    try {
      if (this.templates[templateName]) {
        return this.templates[templateName];
      }

      const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const template = handlebars.compile(templateContent);
      
      this.templates[templateName] = template;
      return template;
    } catch (error) {
      logger.error(`Failed to load email template ${templateName}:`, error);
      throw error;
    }
  }

  async sendEmail({ to, subject, template, context, attachments = [] }) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const templateFn = await this.loadTemplate(template);
      const html = templateFn(context);

      const info = await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        attachments
      });

      logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendVerificationEmail(to, otp) {
    try {
      await this.sendEmail({
        to,
        subject: 'Email Verification - Corporate Cruise',
        template: 'verification',
        context: {
          otp,
          expiryMinutes: 10,
          appName: 'Corporate Cruise',
          currentYear: new Date().getFullYear()
        }
      });
    } catch (error) {
      logger.error(`Failed to send verification email to ${to}:`, error);
      throw error;
    }
  }

  async sendLoginOTP(to, otp) {
    try {
      await this.sendEmail({
        to,
        subject: 'Login OTP - Corporate Cruise',
        template: 'login-otp',
        context: {
          otp,
          expiryMinutes: 5,
          appName: 'Corporate Cruise',
          currentYear: new Date().getFullYear()
        }
      });
    } catch (error) {
      logger.error(`Failed to send login OTP to ${to}:`, error);
      throw error;
    }
  }

  async sendPaymentNotification(to, { userName, packageName, paymentStatus, paidAmount, transactionId, paymentDate }) {
    try {
      await this.sendEmail({
        to,
        subject: `Payment ${paymentStatus} - Corporate Cruise`,
        template: 'payment-notification',
        context: {
          userName,
          packageName,
          paymentStatus,
          paidAmount,
          transactionId,
          paymentDate,
          supportLink: process.env.SUPPORT_LINK || 'https://corporatecruise.com/support',
          appName: 'Corporate Cruise',
          currentYear: new Date().getFullYear()
        }
      });
      
      logger.info(`Payment notification sent to ${to} for package ${packageName}`);
    } catch (error) {
      logger.error(`Failed to send payment notification to ${to}:`, error);
      throw error;
    }
  }

  async sendPackageCreatedNotification(to, { 
    userName, 
    packageName, 
    description, 
    price, 
    duration, 
    rideLimit, 
    validityStart, 
    validityEnd, 
    features = [],
    packageId
  }) {
    try {
      await this.sendEmail({
        to,
        subject: `New Package Created - Corporate Cruise`,
        template: 'package-created',
        context: {
          userName,
          packageName,
          description,
          price,
          duration,
          rideLimit,
          validityStart,
          validityEnd,
          features,
          packageLink: `${process.env.FRONTEND_URL || 'https://corporatecruise.com'}/packages/${packageId}`,
          appName: 'Corporate Cruise',
          currentYear: new Date().getFullYear()
        }
      });
      
      logger.info(`Package creation notification sent to ${to} for package ${packageName}`);
    } catch (error) {
      logger.error(`Failed to send package creation notification to ${to}:`, error);
      throw error;
    }
  }
  async sendContactUsEmailtoUser(to,name){
    try{
      await this.sendEmail({
        to,
        subject:'Contact Us -Corporate Cruise',
        template:'user-contact',
        
        context:{
          name,
          appName: 'Corporate Cruise',
          currentYear: new Date().getFullYear()

        }
      });
    }catch(error){
      logger.error(`Failed to send contact to user ${to}:`, error);
      throw error;
    }
  }
  async sendContactUsEmailToAdmin(to,{ name, email, message }) {
    try {
      await this.sendEmail({
        to,
        subject: 'New Contact Request - Corporate Cruise',
        template: 'admin-contact-us',
        context: {
          name,
          userEmail: email,
          message,
          submittedDate: new Date().toLocaleString(),
          appName: 'Corporate Cruise',
          currentYear: new Date().getFullYear(),
        },
      });
    } catch (error) {
      logger.error(`Failed to send contact email to admin ${to}:`, error);
      throw error;
    }
  }
}


// Create a singleton instance
const emailService = new EmailService();

module.exports = emailService; 