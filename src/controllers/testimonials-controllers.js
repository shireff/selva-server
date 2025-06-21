import { validationResult } from "express-validator";

// Mock testimonials database
let testimonials = [
  {
    id: "1",
    customerName: "Fatima Al-Zahra",
    customerImage:
      "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg",
    rating: 5,
    review:
      "Absolutely amazing service! The hard gel manicure lasted exactly as promised - 3 full weeks without a single chip. The staff is professional and the salon is spotless. I've found my new go-to nail salon!",
    serviceUsed: "Hard Gel Manicure",
    beforeImage:
      "https://images.pexels.com/photos/3997407/pexels-photo-3997407.jpeg",
    afterImage:
      "https://images.pexels.com/photos/3997408/pexels-photo-3997408.jpeg",
    createdAt: "2024-01-20T14:30:00Z",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "2",
    customerName: "Amira Hassan",
    rating: 5,
    review:
      "I've been coming to Selva for over a year now and they never disappoint. The nail art designs are creative and unique. Sarah always knows exactly what I want even when I can't explain it properly!",
    serviceUsed: "Nail Art Design",
    afterImage:
      "https://images.pexels.com/photos/3997409/pexels-photo-3997409.jpeg",
    createdAt: "2024-01-18T11:15:00Z",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "3",
    customerName: "Yasmin Mohamed",
    rating: 4,
    review:
      "Great experience overall. The French manicure came out perfect and the technician was very gentle. The only reason I'm not giving 5 stars is because I had to wait a bit longer than expected.",
    serviceUsed: "French Hard Gel Manicure",
    afterImage:
      "https://images.pexels.com/photos/3997410/pexels-photo-3997410.jpeg",
    createdAt: "2024-01-15T16:45:00Z",
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "4",
    customerName: "Nour Abdullah",
    rating: 5,
    review:
      "The nail extensions look so natural! I was worried they would look fake but the technician matched my nail color perfectly. Very happy with the results and the quality of service.",
    serviceUsed: "Hard Gel Nail Extensions",
    beforeImage:
      "https://images.pexels.com/photos/3997411/pexels-photo-3997411.jpeg",
    afterImage:
      "https://images.pexels.com/photos/3997412/pexels-photo-3997412.jpeg",
    createdAt: "2024-01-12T13:20:00Z",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "5",
    customerName: "Layla Ahmed",
    rating: 5,
    review:
      "Best pedicure I've ever had! The hard gel on my toes has lasted over a month and still looks fresh. The massage was so relaxing and the staff made me feel pampered.",
    serviceUsed: "Hard Gel Pedicure",
    afterImage:
      "https://images.pexels.com/photos/3997413/pexels-photo-3997413.jpeg",
    createdAt: "2024-01-10T10:30:00Z",
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "6",
    customerName: "Maryam Khalil",
    rating: 5,
    review:
      "I had a broken nail emergency and they fixed it perfectly! You can't even tell which nail was repaired. The repair service saved my nails for an important event.",
    serviceUsed: "Nail Repair Service",
    beforeImage:
      "https://images.pexels.com/photos/3997414/pexels-photo-3997414.jpeg",
    afterImage:
      "https://images.pexels.com/photos/3997415/pexels-photo-3997415.jpeg",
    createdAt: "2024-01-08T15:10:00Z",
    isApproved: true,
    isFeatured: false,
  },
];

const categories = ["Manicure", "Pedicure", "Extensions", "Nail Art", "Repair"];

// Get all testimonials
export const getAllTestimonials = (req, res) => {
  try {
    const { approved, featured } = req.query;

    let filteredTestimonials = testimonials;

    if (approved !== undefined) {
      filteredTestimonials = filteredTestimonials.filter(
        (t) => t.isApproved === (approved === "true")
      );
    }

    if (featured !== undefined) {
      filteredTestimonials = filteredTestimonials.filter(
        (t) => t.isFeatured === (featured === "true")
      );
    }

    // Sort by creation date (newest first)
    filteredTestimonials.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const featuredTestimonials = testimonials.filter(
      (t) => t.isFeatured && t.isApproved
    );

    res.json({
      testimonials: filteredTestimonials,
      featuredTestimonials: featuredTestimonials,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get testimonial by ID
export const getTestimonialById = (req, res) => {
  try {
    const testimonial = testimonials.find((t) => t.id === req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new testimonial
export const createTestimonial = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newTestimonial = {
      id: (testimonials.length + 1).toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      isApproved: false, // New testimonials need approval
      isFeatured: false,
    };

    testimonials.push(newTestimonial);
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update testimonial by ID
export const updateTestimonial = (req, res) => {
  try {
    const testimonialIndex = testimonials.findIndex(
      (t) => t.id === req.params.id
    );
    if (testimonialIndex === -1) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonials[testimonialIndex] = {
      ...testimonials[testimonialIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.json(testimonials[testimonialIndex]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete testimonial by ID
export const deleteTestimonial = (req, res) => {
  try {
    const testimonialIndex = testimonials.findIndex(
      (t) => t.id === req.params.id
    );
    if (testimonialIndex === -1) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonials.splice(testimonialIndex, 1);
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve testimonial by ID
export const approveTestimonial = (req, res) => {
  try {
    const testimonialIndex = testimonials.findIndex(
      (t) => t.id === req.params.id
    );
    if (testimonialIndex === -1) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonials[testimonialIndex].isApproved = true;
    testimonials[testimonialIndex].updatedAt = new Date().toISOString();

    res.json({
      ...testimonials[testimonialIndex],
      message: "Testimonial approved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
