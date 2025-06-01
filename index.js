const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const nodemailer = require('nodemailer');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // To parse JSON bodies
app.use("/products", express.static(path.join(__dirname, "Assets/products")));


mongoose
  .connect(
    "mongodb+srv://divyachemicalindustry:Devraj4545@cluster0.pvkc3fk.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("mongo error", err));


// Newsletter Schema starts

const NewsletterSchema = new mongoose.Schema({

  email: {
    type: String,
    require: true,
  },
});

const UserNews = mongoose.model("NewsLetter", NewsletterSchema)

// Newsletter Schema Overs


  

// Registe Schema Over


// Contact Schema Starts 
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("contacts", ContactSchema)

// Contact Schema Over 






// 🔹 Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});




// For newsletter
app.post('/newsletter', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email already exists
    const user = await UserNews.findOne({ email });
    if (user) {
      return res.json({ success: false, error: 'You have already registered with this email.' });
    }

    // Save new subscriber
    const result = await UserNews.create({ email });
    console.log('Newsletter subscriber saved:', result);

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML newsletter welcome email
    const mailOptions = {
      from: `"Divya Chemical Industry" <${process.env.EMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: 'Thanks for Subscribing to Divya Chemical Industry',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background-color: #8c000a; color: #ffffff; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">Welcome to Our Newsletter</h2>
            </div>

            <!-- Body -->
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Hi there,</p>
              <p style="font-size: 15px; color: #333;">
                Thank you for subscribing to <strong>Divya Chemical Industry's</strong> newsletter.
                We’re excited to keep you updated with the latest in chemical innovations, product announcements,
                and exclusive insights from the industry.
              </p>
              <p style="font-size: 15px; color: #333;">
                Our mission is to provide high-quality, sustainable chemical solutions that empower industries and support growth.
              </p>
              <p style="font-size: 15px; color: #333;">
                Stay tuned – great things are coming your way!
              </p>

              <p style="margin-top: 30px; font-size: 15px; color: #333;">Warm regards,</p>
              <p style="font-size: 15px; color: #333;"><strong>The Divya Chemical Industry Team</strong></p>
            </div>

            <!-- Footer -->
            <div style="background-color: #fbe6e7; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #555;">
                Website: <a href="https://divyachemicalindustry.com" style="color: #8c000a;">divyachemicalindustry.com</a>
              </p>
              <p style="font-size: 14px; color: #555;">Email: <a href="mailto:info@divyachemicalindustry.com" style="color: #8c000a;">info@divyachemicalindustry.com</a></p>
              <p style="font-size: 14px; color: #555;">Phone: +91 98765 43210</p>
            </div>

            <div style="background-color: #f1f1f1; color: #888; text-align: center; padding: 10px; font-size: 12px;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Divya Chemical Industry. All rights reserved.</p>
            </div>

          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Newsletter email sent:', info.response);

    res.json({ success: true, message: 'Thanks for subscribing!' });
  } catch (error) {
    console.error("Error in /newsletter:", error);
    res.json({ success: false, error: 'Email cannot be registered at the moment.' });
  }
});


//  newsletter Over


// For Contacts

app.post('/contacts', async (req, res) => {
  const { name, email, mobile, message } = req.body;

  try {
    // Check if the user with the given email and message already exists
    const user = await User.findOne({ email, message });
    if (user) {
      return res.json({ success: false, error: 'Message has already been sent' });
    }

    // Save to DB
    const result = await User.create({ name, email, mobile, message });
    console.log(result);

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // 1. Email to user
    const userMailOptions = {
      from: `"Divya Chemical Industry" <${process.env.EMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER, 
      subject: 'Welcome to Divya Chemical Industry',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f0f2f5; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #8c000a; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Thank You for Contacting Divya Chemical Industry</h2>
          </div>
    
          <!-- Body -->
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 15px; color: #333;">
              We truly appreciate your interest in <strong>Divya Chemical Industry</strong>. Your message has been received and our team will respond to you shortly.
            </p>
            <p style="font-size: 15px; color: #333;">
              We specialize in delivering reliable, high-quality chemical solutions tailored for industrial, manufacturing, and laboratory applications.
            </p>
            <p style="margin-top: 20px; font-size: 15px; color: #333;">
              <strong>Tip:</strong> To ensure our emails always land in your inbox, please add us to your contacts or mark this message as "Not Spam" if needed.
            </p>
            <p style="margin-top: 30px; font-size: 15px; color: #333;">Warm regards,</p>
            <p style="font-size: 15px; color: #333;"><strong>The Divya Chemical Industry Team</strong></p>
          </div>
    
          <!-- Business Info -->
          <div style="background-color: #fbe6e7; padding: 20px; text-align: center;">
            <img src="cid:businessCardImage" alt="Divya Chemical Industry Business Card" style="width: 100%; max-width: 500px; border-radius: 6px;" />
            <p style="margin: 10px 0 0; font-size: 14px; color: #555;">
              Email: <a href="mailto:info@divyachemicalindustry.com" style="color: #8c000a;">info@divyachemicalindustry.com</a>
            </p>
            <p style="font-size: 14px; color: #555;">Phone: +91 98765 43210</p>
            <p style="font-size: 14px; color: #555;">Website: <a href="https://divyachemicalindustry.com" style="color: #8c000a;">divyachemicalindustry.com</a></p>
          </div>
    
          <!-- Footer -->
          <div style="background-color: #f1f1f1; color: #888; text-align: center; padding: 10px; font-size: 12px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Divya Chemical Industry. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
    
      attachments: [{
        filename: 'business-card.jpg',
        path: path.join(__dirname, 'Assets', 'business-card.jpg'),
        cid: 'businessCardImage'
      }]
    };

    // 2. Email to you (admin)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `
    };

    // Send both emails
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.json({ success: true, message: 'Thanks For Contacting Us' });

  } catch (error) {
    console.error("Error in /contacts:", error);
    res.json({ success: false, error: 'Contact cannot be submitted' });
  }
});



//  Contacts Over

// Contact-info to show in backend starts

app.get("/contact-info", async (req, res) => {
  try {
    const contacts = await User.find();
    res.json({ success: true, data:contacts });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});

// Contact-info to show in backend over



// Api link start
app.get('/api', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const { category, sort } = req.query;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("File read error:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const parsedData = JSON.parse(data);
      let jsonData = [];

      parsedData.forEach(categoryData => {
        if (!category || category === categoryData.routing_category) {
          const categoryProducts = categoryData.products.map(product => {
            // Ensure colors and other arrays are correctly parsed if they are strings
            const parseJsonArray = (field) => {
              try {
                return Array.isArray(field) ? field : JSON.parse(field || "[]");
              } catch {
                return [];
              }
            };

            return {
              ...product,
              routing_category: categoryData.routing_category, // Add category to each product
              colors: parseJsonArray(product.colors),
              details: {
                ...product.details,
                color_options: parseJsonArray(product.details?.color_options),
                sizes: parseJsonArray(product.details?.sizes),
              },
            };
          });
          jsonData = jsonData.concat(categoryProducts);
        }
      });

      // Optional sorting
      if (sort) {
        switch (sort) {
          case 'price-low-high':
            jsonData.sort((a, b) => a.price.current - b.price.current);
            break;
          case 'price-high-low':
            jsonData.sort((a, b) => b.price.current - a.price.current);
            break;
          case 'rating':
            jsonData.sort((a, b) => (b.rating?.stars || 0) - (a.rating?.stars || 0));
            break;
        }
      }

      // Update image URLs with full host path
      const updatedData = jsonData.map(item => {
        if (item.image) {
          item.image = 'http://' + req.get('host') + item.image;
        }
        return item;
      });

      res.json({
        success: true,
        data: updatedData,
        total: updatedData.length,
      });

    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

app.get('/api/product/:category/:name', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const category = req.params.category.toLowerCase();
  const productName = req.params.name.toLowerCase();

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("File read error:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const parsedData = JSON.parse(data);
      const categoryData = parsedData.find(cat => cat.routing_category.toLowerCase() === category);
      if (!categoryData) {
        return res.status(404).json({ success: false, message: 'Category Not Found' });
      }

      const product = categoryData.products.find(p => p.title.toLowerCase().replace(/ /g, '-') === productName);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product Not Found' });
      }

      if (product.image) {
        product.image = 'http://' + req.get('host') + product.image;
      }

      product.routing_category = categoryData.routing_category;

      res.json({ success: true, data: product });

    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

// Category folder mapping
const categoryFolderMap = {
  "sulphites-chloride-sulphates": "scs",
  "quaternary-ammonium-compounds": "qac",
  "nitrocompound": "nit",
  "stearate": "str",
  "solvents": "sol",
  "cleaning_essentials": "cle"
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const categoryId = req.body.categoryId;
    const folderName = categoryFolderMap[categoryId];

    if (folderName) {
      cb(null, path.join('Assets/products', folderName));
    } else {
      cb(new Error("Invalid category"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/api/product-add', upload.single('image'), async (req, res) => {
  const { categoryId } = req.body;
  const filePath = path.join(__dirname, 'data.json');

  try {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      let parsedData = JSON.parse(data);
      const categoryIndex = parsedData.findIndex(item => item.routing_category === categoryId);

      if (categoryIndex === -1) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const newProductId = parsedData[categoryIndex].products.length + 1;

      // Safely parse nested and optional fields
      const newProduct = {
        id: newProductId,
        title: req.body.title || "",
        fulldescription: req.body.fulldescription || "",
        description: req.body.description || "",
        routing_category: req.body.routing_category || "",
        price: {
          current: parseFloat(req.body.price_current) || 0,
          original: req.body.price_original ? parseFloat(req.body.price_original) : null,
        },
        rating: {
          stars: req.body.rating_stars ? parseFloat(req.body.rating_stars) : null,
          reviews_count: req.body.rating_count ? parseInt(req.body.rating_count) : 0,
        },
        quantity: parseInt(req.body.quantity) || 0,
        colors: safeParseArray(req.body.colors),
        details: safeParseObject(req.body.details),
        image: req.file ? `/products/${categoryFolderMap[categoryId]}/${req.file.filename}` : null,
      };

      // Push product
      parsedData[categoryIndex].products.push(newProduct);

      fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Failed to add product' });
        }

        res.json({ success: true, message: 'Product added successfully', product: newProduct });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Utility functions
function safeParseArray(str) {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeParseObject(str) {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}


// API route to delete a product
app.post('/api/product-delete', async (req, res) => {
  const { categoryId, productId } = req.body;
  const filePath = path.join(__dirname, 'data.json');

  try {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      let parsedData = JSON.parse(data);
      const categoryIndex = parsedData.findIndex(item => item.routing_category === categoryId);

      if (categoryIndex === -1) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const productIndex = parsedData[categoryIndex].products.findIndex(product => product.id === productId);
      if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      parsedData[categoryIndex].products.splice(productIndex, 1);

      // Write the updated data back to the JSON file
      fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Failed to delete product' });
        }

        res.json({ success: true, message: 'Product deleted successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});



// Api link over

// Local server
app.listen(3032, () => {
  console.log('Server connected');
});