import { sequelize, Form, Page, Section, Row, Element } from '../models';

interface SeedFormData {
  title: string;
  subtitle?: string;
  description?: string;
  companyLogo?: string;
  companyAddress?: string;
  isMultiPage: boolean;
  status: 'draft' | 'published' | 'archived';
  pages: {
    title: string;
    description?: string;
    pageNumber: number;
    sections: {
      title: string;
      description?: string;
      sectionNumber: number;
      rows: {
        rowNumber: number;
        rowName: string;
        elements: {
          type: string;
          label: string;
          name: string;
          placeholder?: string;
          required: boolean;
          validation?: any;
          options?: any;
          conditionalLogic?: any;
          properties?: any;
          elementNumber: number;
        }[];
      }[];
    }[];
  }[];
}

const seedForms: SeedFormData[] = [
  {
    title: "Contact Us",
    subtitle: "Get in touch with our team",
    description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    companyLogo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200",
    companyAddress: "123 Business Ave, Suite 100, New York, NY 10001",
    isMultiPage: false,
    status: 'published',
    pages: [{
      title: "Contact Information",
      pageNumber: 1,
      sections: [{
        title: "Your Information",
        description: "Please provide your contact details",
        sectionNumber: 1,
        rows: [
          {
            rowNumber: 1,
            rowName: "contact_name_row",
            elements: [{
              type: "text",
              label: "Full Name",
              name: "fullName",
              placeholder: "Enter your full name",
              required: true,
              validation: { min: 2, max: 100 },
              elementNumber: 1
            }]
          },
          {
            rowNumber: 2,
            rowName: "contact_email_phone_row",
            elements: [
              {
                type: "email",
                label: "Email Address",
                name: "email",
                placeholder: "your.email@example.com",
                required: true,
                validation: { email: true },
                elementNumber: 1
              },
              {
                type: "tel",
                label: "Phone Number",
                name: "phone",
                placeholder: "(555) 123-4567",
                required: false,
                validation: { matches: /^\+?[\d\s\-\(\)]+$/ },
                elementNumber: 2
              }
            ]
          },
          {
            rowNumber: 3,
            rowName: "contact_subject_row",
            elements: [{
              type: "select",
              label: "Subject",
              name: "subject",
              required: true,
              options: {
                choices: [
                  { label: "General Inquiry", value: "general" },
                  { label: "Technical Support", value: "support" },
                  { label: "Sales Question", value: "sales" },
                  { label: "Partnership", value: "partnership" },
                  { label: "Other", value: "other" }
                ]
              },
              elementNumber: 1
            }]
          },
          {
            rowNumber: 4,
            rowName: "contact_message_row",
            elements: [{
              type: "textarea",
              label: "Message",
              name: "message",
              placeholder: "Please describe your inquiry in detail...",
              required: true,
              validation: { min: 10, max: 1000 },
              properties: { rows: 5 },
              elementNumber: 1
            }]
          }
        ]
      }]
    }]
  },
  {
    title: "Job Application Form",
    subtitle: "Join Our Amazing Team",
    description: "We're looking for talented individuals to join our growing company. Please fill out this application completely.",
    companyLogo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200",
    companyAddress: "456 Corporate Blvd, Tech District, San Francisco, CA 94105",
    isMultiPage: true,
    status: 'published',
    pages: [
      {
        title: "Personal Information",
        description: "Tell us about yourself",
        pageNumber: 1,
        sections: [{
          title: "Basic Information",
          sectionNumber: 1,
          rows: [
            {
              rowNumber: 1,
              rowName: "personal_name_row",
              elements: [
                {
                  type: "text",
                  label: "First Name",
                  name: "firstName",
                  placeholder: "John",
                  required: true,
                  validation: { min: 2, max: 50 },
                  elementNumber: 1
                },
                {
                  type: "text",
                  label: "Last Name",
                  name: "lastName",
                  placeholder: "Doe",
                  required: true,
                  validation: { min: 2, max: 50 },
                  elementNumber: 2
                }
              ]
            },
            {
              rowNumber: 2,
              rowName: "personal_contact_row",
              elements: [
                {
                  type: "email",
                  label: "Email Address",
                  name: "email",
                  placeholder: "john.doe@example.com",
                  required: true,
                  validation: { email: true },
                  elementNumber: 1
                },
                {
                  type: "tel",
                  label: "Phone Number",
                  name: "phone",
                  placeholder: "(555) 123-4567",
                  required: true,
                  validation: { matches: /^\+?[\d\s\-\(\)]+$/ },
                  elementNumber: 2
                }
              ]
            },
            {
              rowNumber: 3,
              rowName: "personal_address_row",
              elements: [{
                type: "textarea",
                label: "Address",
                name: "address",
                placeholder: "123 Main St, City, State, ZIP",
                required: true,
                validation: { min: 10, max: 200 },
                properties: { rows: 3 },
                elementNumber: 1
              }]
            }
          ]
        }]
      },
      {
        title: "Professional Experience",
        description: "Tell us about your work experience",
        pageNumber: 2,
        sections: [{
          title: "Work History",
          sectionNumber: 1,
          rows: [
            {
              rowNumber: 1,
              rowName: "experience_position_row",
              elements: [{
                type: "select",
                label: "Position Applied For",
                name: "position",
                required: true,
                options: {
                  choices: [
                    { label: "Frontend Developer", value: "frontend" },
                    { label: "Backend Developer", value: "backend" },
                    { label: "Full Stack Developer", value: "fullstack" },
                    { label: "UI/UX Designer", value: "designer" },
                    { label: "Product Manager", value: "pm" },
                    { label: "Data Scientist", value: "data" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 2,
              rowName: "experience_years_row",
              elements: [{
                type: "select",
                label: "Years of Experience",
                name: "experience",
                required: true,
                options: {
                  choices: [
                    { label: "0-1 years", value: "0-1" },
                    { label: "2-3 years", value: "2-3" },
                    { label: "4-5 years", value: "4-5" },
                    { label: "6-10 years", value: "6-10" },
                    { label: "10+ years", value: "10+" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 3,
              rowName: "experience_previous_row",
              elements: [{
                type: "textarea",
                label: "Previous Work Experience",
                name: "workHistory",
                placeholder: "Please describe your previous work experience, including company names, positions, and key responsibilities...",
                required: true,
                validation: { min: 50, max: 2000 },
                properties: { rows: 6 },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 4,
              rowName: "experience_skills_row",
              elements: [{
                type: "textarea",
                label: "Technical Skills",
                name: "skills",
                placeholder: "List your technical skills, programming languages, frameworks, tools, etc.",
                required: true,
                validation: { min: 20, max: 500 },
                properties: { rows: 4 },
                elementNumber: 1
              }]
            }
          ]
        }]
      },
      {
        title: "Additional Information",
        description: "Final details and documents",
        pageNumber: 3,
        sections: [{
          title: "Documents & References",
          sectionNumber: 1,
          rows: [
            {
              rowNumber: 1,
              rowName: "documents_resume_row",
              elements: [{
                type: "file",
                label: "Resume/CV",
                name: "resume",
                required: true,
                properties: { 
                  accept: ".pdf,.doc,.docx",
                  maxSize: "5MB"
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 2,
              rowName: "documents_portfolio_row",
              elements: [{
                type: "file",
                label: "Portfolio (Optional)",
                name: "portfolio",
                required: false,
                properties: { 
                  accept: ".pdf,.zip",
                  maxSize: "10MB"
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 3,
              rowName: "documents_availability_row",
              elements: [
                {
                  type: "date",
                  label: "Available Start Date",
                  name: "startDate",
                  required: true,
                  elementNumber: 1
                },
                {
                  type: "select",
                  label: "Salary Expectation",
                  name: "salary",
                  required: false,
                  options: {
                    choices: [
                      { label: "$40,000 - $60,000", value: "40-60k" },
                      { label: "$60,000 - $80,000", value: "60-80k" },
                      { label: "$80,000 - $100,000", value: "80-100k" },
                      { label: "$100,000 - $120,000", value: "100-120k" },
                      { label: "$120,000+", value: "120k+" },
                      { label: "Negotiable", value: "negotiable" }
                    ]
                  },
                  elementNumber: 2
                }
              ]
            },
            {
              rowNumber: 4,
              rowName: "documents_additional_row",
              elements: [{
                type: "textarea",
                label: "Additional Comments",
                name: "comments",
                placeholder: "Is there anything else you'd like us to know about your application?",
                required: false,
                validation: { max: 500 },
                properties: { rows: 4 },
                elementNumber: 1
              }]
            }
          ]
        }]
      }
    ]
  },
  {
    title: "Customer Feedback Survey",
    subtitle: "Help Us Improve Our Service",
    description: "Your feedback is valuable to us. Please take a few minutes to share your experience.",
    companyLogo: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200",
    companyAddress: "789 Service Street, Customer Care Center, Chicago, IL 60601",
    isMultiPage: false,
    status: 'published',
    pages: [{
      title: "Feedback Form",
      pageNumber: 1,
      sections: [
        {
          title: "Service Rating",
          description: "Please rate your overall experience",
          sectionNumber: 1,
          rows: [
            {
              rowNumber: 1,
              rowName: "feedback_customer_info_row",
              elements: [
                {
                  type: "text",
                  label: "Customer Name",
                  name: "customerName",
                  placeholder: "Your name (optional)",
                  required: false,
                  validation: { max: 100 },
                  elementNumber: 1
                },
                {
                  type: "email",
                  label: "Email Address",
                  name: "email",
                  placeholder: "your.email@example.com (optional)",
                  required: false,
                  validation: { email: true },
                  elementNumber: 2
                }
              ]
            },
            {
              rowNumber: 2,
              rowName: "feedback_rating_row",
              elements: [{
                type: "radio",
                label: "Overall Satisfaction",
                name: "satisfaction",
                required: true,
                options: {
                  choices: [
                    { label: "Very Satisfied", value: "very_satisfied" },
                    { label: "Satisfied", value: "satisfied" },
                    { label: "Neutral", value: "neutral" },
                    { label: "Dissatisfied", value: "dissatisfied" },
                    { label: "Very Dissatisfied", value: "very_dissatisfied" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 3,
              rowName: "feedback_service_aspects_row",
              elements: [{
                type: "checkbox",
                label: "Which aspects of our service were you most satisfied with?",
                name: "serviceAspects",
                required: false,
                options: {
                  choices: [
                    { label: "Product Quality", value: "quality" },
                    { label: "Customer Service", value: "service" },
                    { label: "Delivery Speed", value: "delivery" },
                    { label: "Pricing", value: "pricing" },
                    { label: "Website Experience", value: "website" },
                    { label: "Communication", value: "communication" }
                  ]
                },
                elementNumber: 1
              }]
            }
          ]
        },
        {
          title: "Detailed Feedback",
          sectionNumber: 2,
          rows: [
            {
              rowNumber: 1,
              rowName: "feedback_improvement_row",
              elements: [{
                type: "textarea",
                label: "What could we improve?",
                name: "improvements",
                placeholder: "Please share any suggestions for how we can improve our service...",
                required: false,
                validation: { max: 1000 },
                properties: { rows: 4 },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 2,
              rowName: "feedback_recommend_row",
              elements: [{
                type: "radio",
                label: "Would you recommend us to others?",
                name: "recommend",
                required: true,
                options: {
                  choices: [
                    { label: "Definitely", value: "definitely" },
                    { label: "Probably", value: "probably" },
                    { label: "Not Sure", value: "not_sure" },
                    { label: "Probably Not", value: "probably_not" },
                    { label: "Definitely Not", value: "definitely_not" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 3,
              rowName: "feedback_additional_row",
              elements: [{
                type: "textarea",
                label: "Additional Comments",
                name: "additionalComments",
                placeholder: "Any other feedback you'd like to share?",
                required: false,
                validation: { max: 500 },
                properties: { rows: 3 },
                elementNumber: 1
              }]
            }
          ]
        }
      ]
    }]
  },
  {
    title: "Event Registration",
    subtitle: "Tech Conference 2024",
    description: "Join us for the biggest tech conference of the year! Register now to secure your spot.",
    companyLogo: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200",
    companyAddress: "Convention Center, 1000 Event Plaza, Austin, TX 78701",
    isMultiPage: true,
    status: 'published',
    pages: [
      {
        title: "Attendee Information",
        pageNumber: 1,
        sections: [{
          title: "Personal Details",
          sectionNumber: 1,
          rows: [
            {
              rowNumber: 1,
              rowName: "event_attendee_name_row",
              elements: [
                {
                  type: "text",
                  label: "First Name",
                  name: "firstName",
                  placeholder: "Enter your first name",
                  required: true,
                  validation: { min: 2, max: 50 },
                  elementNumber: 1
                },
                {
                  type: "text",
                  label: "Last Name",
                  name: "lastName",
                  placeholder: "Enter your last name",
                  required: true,
                  validation: { min: 2, max: 50 },
                  elementNumber: 2
                }
              ]
            },
            {
              rowNumber: 2,
              rowName: "event_contact_row",
              elements: [
                {
                  type: "email",
                  label: "Email Address",
                  name: "email",
                  placeholder: "your.email@company.com",
                  required: true,
                  validation: { email: true },
                  elementNumber: 1
                },
                {
                  type: "tel",
                  label: "Phone Number",
                  name: "phone",
                  placeholder: "(555) 123-4567",
                  required: true,
                  elementNumber: 2
                }
              ]
            },
            {
              rowNumber: 3,
              rowName: "event_company_row",
              elements: [
                {
                  type: "text",
                  label: "Company/Organization",
                  name: "company",
                  placeholder: "Your company name",
                  required: true,
                  validation: { min: 2, max: 100 },
                  elementNumber: 1
                },
                {
                  type: "text",
                  label: "Job Title",
                  name: "jobTitle",
                  placeholder: "Your job title",
                  required: true,
                  validation: { min: 2, max: 100 },
                  elementNumber: 2
                }
              ]
            }
          ]
        }]
      },
      {
        title: "Registration Options",
        pageNumber: 2,
        sections: [{
          title: "Ticket Selection",
          sectionNumber: 1,
          rows: [
            {
              rowNumber: 1,
              rowName: "event_ticket_type_row",
              elements: [{
                type: "radio",
                label: "Ticket Type",
                name: "ticketType",
                required: true,
                options: {
                  choices: [
                    { label: "Early Bird - $299 (Limited Time)", value: "early_bird" },
                    { label: "Regular - $399", value: "regular" },
                    { label: "VIP - $599 (Includes networking dinner)", value: "vip" },
                    { label: "Student - $99 (ID required)", value: "student" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 2,
              rowName: "event_sessions_row",
              elements: [{
                type: "checkbox",
                label: "Which sessions are you most interested in?",
                name: "sessions",
                required: false,
                options: {
                  choices: [
                    { label: "AI & Machine Learning", value: "ai_ml" },
                    { label: "Web Development", value: "web_dev" },
                    { label: "Mobile Development", value: "mobile_dev" },
                    { label: "DevOps & Cloud", value: "devops" },
                    { label: "Cybersecurity", value: "security" },
                    { label: "Data Science", value: "data_science" },
                    { label: "Blockchain", value: "blockchain" },
                    { label: "Startup Pitch Competition", value: "startup" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 3,
              rowName: "event_dietary_row",
              elements: [{
                type: "select",
                label: "Dietary Restrictions",
                name: "dietary",
                required: false,
                options: {
                  choices: [
                    { label: "None", value: "none" },
                    { label: "Vegetarian", value: "vegetarian" },
                    { label: "Vegan", value: "vegan" },
                    { label: "Gluten-Free", value: "gluten_free" },
                    { label: "Halal", value: "halal" },
                    { label: "Kosher", value: "kosher" },
                    { label: "Other (please specify in comments)", value: "other" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 4,
              rowName: "event_tshirt_row",
              elements: [{
                type: "select",
                label: "T-Shirt Size (Free conference t-shirt)",
                name: "tshirtSize",
                required: false,
                options: {
                  choices: [
                    { label: "XS", value: "xs" },
                    { label: "S", value: "s" },
                    { label: "M", value: "m" },
                    { label: "L", value: "l" },
                    { label: "XL", value: "xl" },
                    { label: "XXL", value: "xxl" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 5,
              rowName: "event_comments_row",
              elements: [{
                type: "textarea",
                label: "Special Requests or Comments",
                name: "comments",
                placeholder: "Any special accommodations, questions, or comments?",
                required: false,
                validation: { max: 500 },
                properties: { rows: 3 },
                elementNumber: 1
              }]
            }
          ]
        }]
      }
    ]
  },
  {
    title: "Product Order Form",
    subtitle: "Custom Software Solutions",
    description: "Order our premium software solutions tailored to your business needs.",
    companyLogo: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200",
    companyAddress: "Software Solutions Inc., 555 Innovation Drive, Seattle, WA 98101",
    isMultiPage: false,
    status: 'draft',
    pages: [{
      title: "Order Details",
      pageNumber: 1,
      sections: [
        {
          title: "Customer Information",
          sectionNumber: 1,
          rows: [
            {
              rowNumber: 1,
              rowName: "order_customer_row",
              elements: [
                {
                  type: "text",
                  label: "Company Name",
                  name: "companyName",
                  placeholder: "Your company name",
                  required: true,
                  validation: { min: 2, max: 100 },
                  elementNumber: 1
                },
                {
                  type: "text",
                  label: "Contact Person",
                  name: "contactPerson",
                  placeholder: "Full name of contact person",
                  required: true,
                  validation: { min: 2, max: 100 },
                  elementNumber: 2
                }
              ]
            },
            {
              rowNumber: 2,
              rowName: "order_contact_row",
              elements: [
                {
                  type: "email",
                  label: "Business Email",
                  name: "email",
                  placeholder: "contact@company.com",
                  required: true,
                  validation: { email: true },
                  elementNumber: 1
                },
                {
                  type: "tel",
                  label: "Business Phone",
                  name: "phone",
                  placeholder: "(555) 123-4567",
                  required: true,
                  elementNumber: 2
                }
              ]
            }
          ]
        },
        {
          title: "Product Selection",
          sectionNumber: 2,
          rows: [
            {
              rowNumber: 1,
              rowName: "order_product_row",
              elements: [{
                type: "checkbox",
                label: "Select Products",
                name: "products",
                required: true,
                options: {
                  choices: [
                    { label: "CRM System - $2,999/month", value: "crm" },
                    { label: "E-commerce Platform - $1,999/month", value: "ecommerce" },
                    { label: "Analytics Dashboard - $999/month", value: "analytics" },
                    { label: "Mobile App Development - $15,000 one-time", value: "mobile_app" },
                    { label: "Custom Integration - $5,000 one-time", value: "integration" },
                    { label: "Training & Support - $500/month", value: "support" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 2,
              rowName: "order_users_row",
              elements: [{
                type: "select",
                label: "Number of Users",
                name: "userCount",
                required: true,
                options: {
                  choices: [
                    { label: "1-10 users", value: "1-10" },
                    { label: "11-25 users", value: "11-25" },
                    { label: "26-50 users", value: "26-50" },
                    { label: "51-100 users", value: "51-100" },
                    { label: "100+ users (custom pricing)", value: "100+" }
                  ]
                },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 3,
              rowName: "order_requirements_row",
              elements: [{
                type: "textarea",
                label: "Special Requirements",
                name: "requirements",
                placeholder: "Please describe any specific requirements, integrations, or customizations needed...",
                required: false,
                validation: { max: 1000 },
                properties: { rows: 4 },
                elementNumber: 1
              }]
            },
            {
              rowNumber: 4,
              rowName: "order_timeline_row",
              elements: [
                {
                  type: "date",
                  label: "Preferred Start Date",
                  name: "startDate",
                  required: true,
                  elementNumber: 1
                },
                {
                  type: "select",
                  label: "Project Timeline",
                  name: "timeline",
                  required: true,
                  options: {
                    choices: [
                      { label: "ASAP (Rush order +20%)", value: "asap" },
                      { label: "1-2 weeks", value: "1-2weeks" },
                      { label: "3-4 weeks", value: "3-4weeks" },
                      { label: "1-2 months", value: "1-2months" },
                      { label: "3+ months", value: "3+months" }
                    ]
                  },
                  elementNumber: 2
                }
              ]
            }
          ]
        }
      ]
    }]
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Element.destroy({ where: {} });
    await Row.destroy({ where: {} });
    await Section.destroy({ where: {} });
    await Page.destroy({ where: {} });
    await Form.destroy({ where: {} });

    console.log('🧹 Cleared existing data');

    // Create forms with all related data
    for (const formData of seedForms) {
      console.log(`📝 Creating form: ${formData.title}`);

      const form = await Form.create({
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        companyLogo: formData.companyLogo,
        companyAddress: formData.companyAddress,
        isMultiPage: formData.isMultiPage,
        status: formData.status
      });

      for (const pageData of formData.pages) {
        const page = await Page.create({
          formId: form.id,
          title: pageData.title,
          description: pageData.description,
          pageNumber: pageData.pageNumber
        });

        for (const sectionData of pageData.sections) {
          const section = await Section.create({
            pageId: page.id,
            title: sectionData.title,
            description: sectionData.description,
            sectionNumber: sectionData.sectionNumber
          });

          for (const rowData of sectionData.rows) {
            const row = await Row.create({
              sectionId: section.id,
              rowNumber: rowData.rowNumber,
              rowName: rowData.rowName
            });

            for (const elementData of rowData.elements) {
              await Element.create({
                rowId: row.id,
                type: elementData.type,
                label: elementData.label,
                name: elementData.name,
                placeholder: elementData.placeholder,
                required: elementData.required,
                validation: elementData.validation,
                options: elementData.options,
                conditionalLogic: elementData.conditionalLogic,
                properties: elementData.properties,
                elementNumber: elementData.elementNumber
              });
            }
          }
        }
      }

      console.log(`✅ Created form: ${formData.title} with ${formData.pages.length} page(s)`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${seedForms.length} sample forms:`);
    seedForms.forEach((form, index) => {
      console.log(`   ${index + 1}. ${form.title} (${form.isMultiPage ? 'Multi-page' : 'Single-page'}) - ${form.status}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}