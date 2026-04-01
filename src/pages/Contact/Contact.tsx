import { useState } from 'react';
import { WhatsAppService } from '../../services/whatsAppService';
import './Contact.css';

const faqData = [
  {
    q: 'What is Dubai Chocolate?',
    a: 'Dubai Chocolate is a premium confectionery trend originating from the UAE, known for its bold fusion of Middle Eastern flavors like kunafa, pistachio, saffron, and dates combined with Belgian couverture chocolate. It has taken the world by storm for its unique taste and luxurious presentation.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5-7 business days within Canada. Expedited shipping options are available at checkout for 2-3 business day delivery. All orders are hand-packed with temperature-controlled packaging to ensure your chocolate arrives in perfect condition.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Currently we ship within Canada only. We are actively working on expanding our international shipping capabilities and expect to offer cross-border delivery to select countries in late 2025. Join our newsletter to be notified when international shipping becomes available.',
  },
  {
    q: 'Are your chocolates halal/certified?',
    a: 'Our products are CFIA certified and manufactured in facilities that adhere to strict quality and safety standards. While not all products carry a formal halal certification, we are transparent about all ingredients. Please check individual product pages for specific ingredient information.',
  },
  {
    q: 'Can I order in bulk for events?',
    a: "Yes! We offer corporate gifting and bulk orders for events, weddings, and special occasions. Our bulk program includes volume discounts, custom branding options, and dedicated concierge support. Reach out to us at info@melizzo.com or via WhatsApp for a personalized quote.",
  },
  {
    q: 'How should I store my chocolates?',
    a: 'Store in a cool, dry place between 15-20C (59-68F), away from direct sunlight and strong odors. Avoid refrigeration if possible, as moisture can affect the texture and bloom the chocolate. If refrigeration is necessary, place in an airtight container and let come to room temperature before unwrapping.',
  },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="contact">
      {/* Hero */}
      <section className="contact__hero">
        <div className="contact__hero-bg" />
        <div className="contact__hero-content">
          <span className="contact__hero-eyebrow">We Are Here for You</span>
          <h1 className="contact__hero-title">Get in Touch</h1>
          <p className="contact__hero-subtitle">
            Questions, orders, or just want to say hello? Our team is ready to help you discover the perfect chocolate experience.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact__main">
        <div className="contact__container">

          {/* Contact Cards + Info */}
          <div className="contact__layout">
            {/* Info Column */}
            <div className="contact__info">
              <div className="contact__info-header">
                <span className="contact__section-tag">Reach Out</span>
                <h2 className="contact__section-title">Contact Information</h2>
                <p className="contact__info-intro">
                  Multiple ways to get in touch — choose what works best for you.
                </p>
              </div>

              <div className="contact__cards">
                {[
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    ),
                    label: 'Email',
                    value: 'info@melizzo.com',
                    href: 'mailto:info@melizzo.com',
                    accent: '#C8A064',
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 5.92 5.92l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
                      </svg>
                    ),
                    label: 'Phone',
                    value: '+1 705 927-0127',
                    href: 'tel:+17059270127',
                    accent: '#3A6E5F',
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    ),
                    label: 'Instagram',
                    value: '@melizzo',
                    href: 'https://instagram.com',
                    accent: '#C34E7C',
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    ),
                    label: 'Address',
                    value: 'Ontario, Canada',
                    href: null,
                    accent: '#C8A064',
                  },
                ].map((card, i) => (
                  <div className="contact__card" key={i}>
                    <div className="contact__card-icon" style={{ color: card.accent, borderColor: `${card.accent}22`, background: `${card.accent}10` }}>
                      {card.icon}
                    </div>
                    <div className="contact__card-body">
                      <span className="contact__card-label">{card.label}</span>
                      {card.href ? (
                        <a href={card.href} className="contact__card-value contact__card-value--link">
                          {card.value}
                        </a>
                      ) : (
                        <span className="contact__card-value">{card.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="contact__whatsapp-block">
                <div className="contact__whatsapp-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="contact__whatsapp-text">
                  <h4 className="contact__whatsapp-title">Chat with Us Directly</h4>
                  <p className="contact__whatsapp-desc">Get instant replies on WhatsApp for order inquiries and product questions.</p>
                </div>
                <button
                  onClick={() => WhatsAppService.sendGeneralInquiry()}
                  className="contact__whatsapp-btn"
                >
                  Open WhatsApp
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              {/* Business Hours */}
              <div className="contact__hours">
                <h4 className="contact__hours-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Business Hours
                </h4>
                <div className="contact__hours-grid">
                  <div className="contact__hours-row">
                    <span className="contact__hours-day">Monday — Friday</span>
                    <span className="contact__hours-time">9:00 AM — 6:00 PM EST</span>
                  </div>
                  <div className="contact__hours-row">
                    <span className="contact__hours-day">Saturday</span>
                    <span className="contact__hours-time">10:00 AM — 4:00 PM EST</span>
                  </div>
                  <div className="contact__hours-row">
                    <span className="contact__hours-day">Sunday</span>
                    <span className="contact__hours-time contact__hours-time--closed">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="contact__form-wrapper">
              <div className="contact__form-header">
                <span className="contact__section-tag">Send a Message</span>
                <h2 className="contact__section-title">Contact Form</h2>
                <p className="contact__form-intro">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="contact__success">
                  <div className="contact__success-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3 className="contact__success-title">Message Sent!</h3>
                  <p className="contact__success-text">
                    Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                  </p>
                  <button
                    className="contact__success-btn"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact__form" onSubmit={handleSubmit} noValidate>
                  <div className="contact__form-row">
                    <div className="contact__form-group">
                      <label className="contact__form-label" htmlFor="name">
                        Full Name <span className="contact__form-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`contact__form-input ${errors.name ? 'contact__form-input--error' : ''}`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                      />
                      {errors.name && (
                        <span className="contact__form-error">{errors.name}</span>
                      )}
                    </div>

                    <div className="contact__form-group">
                      <label className="contact__form-label" htmlFor="email">
                        Email Address <span className="contact__form-required">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`contact__form-input ${errors.email ? 'contact__form-input--error' : ''}`}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <span className="contact__form-error">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="contact__form-row">
                    <div className="contact__form-group">
                      <label className="contact__form-label" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="contact__form-input"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                      />
                    </div>

                    <div className="contact__form-group">
                      <label className="contact__form-label" htmlFor="subject">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="contact__form-select"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Inquiry</option>
                        <option value="wholesale">Wholesale / Bulk Order</option>
                        <option value="press">Press & Media</option>
                      </select>
                    </div>
                  </div>

                  <div className="contact__form-group">
                    <label className="contact__form-label" htmlFor="message">
                      Your Message <span className="contact__form-required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className={`contact__form-textarea ${errors.message ? 'contact__form-input--error' : ''}`}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && (
                      <span className="contact__form-error">{errors.message}</span>
                    )}
                  </div>

                  <div className="contact__form-footer">
                    <button type="submit" className="contact__form-submit">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send Message
                    </button>
                    <p className="contact__form-note">
                      We typically respond within 24 hours on business days.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact__faq" id="faq">
        <div className="contact__container">
          <div className="contact__faq-header">
            <span className="contact__section-tag">Have Questions?</span>
            <h2 className="contact__section-title">Frequently Asked Questions</h2>
            <p className="contact__faq-intro">
              Quick answers to the most common questions about MELiZZO products and services.
            </p>
          </div>

          <div className="contact__faq-list">
            {faqData.map((item, i) => (
              <div
                className={`contact__faq-item ${openFaq === i ? 'contact__faq-item--open' : ''}`}
                key={i}
              >
                <button
                  className="contact__faq-question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className="contact__faq-toggle">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="contact__faq-icon"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </button>
                <div
                  className="contact__faq-answer"
                  style={{
                    maxHeight: openFaq === i ? '500px' : '0',
                    opacity: openFaq === i ? 1 : 0,
                  }}
                >
                  <p className="contact__faq-answer-text">{item.a}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Still need help */}
          <div className="contact__faq-still">
            <p className="contact__faq-still-text">
              Could not find what you were looking for?
            </p>
            <button
              onClick={() => WhatsAppService.sendGeneralInquiry()}
              className="contact__faq-still-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with Us on WhatsApp
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
