import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import HeroImage from "../../Assets/AboutUs/hero.svg";
import Email from "../../Assets/ContactUs/Emai.svg";
import Location from "../../Assets/ContactUs/Location.svg";
import Phone from "../../Assets/ContactUs/Phone.svg";
import "./ContactUs.css";
import HomeNavbar from "../../components/Home/NavbarDark/DarkNavbar"; // Import Navbar
import Footer from "../../components/Home/Footer/Footer"; // Import Footer
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";


const ContactUs = () => {
  const { t } = useTranslation("contact");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    // if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    const now = new Date().toLocaleString();
    const fullData = { ...formData, time: now };
    if (validateForm()) {
      
      emailjs.send(
        "service_sxvzn4k",
        "template_mbqt1ni",
        fullData,
        "ch-chHYzlLc1w9lT5"
      )
        .then(
          (result) => {
            alert("Message sent successfully!");
            setFormData({ name: "", email: "", subject: "", message: "" });
          },
          (error) => {
            alert("Failed to send message, please try again.");
            console.error(error.text);
          }
        );
    }
  };

  return (
    <>
      <HomeNavbar />

      <div>
        {/* Hero Section */}
        <div
          className="services-container"
          style={{ backgroundImage: `url(${HeroImage})` }}
        >
          <div className="container px-4">
            <h1 className="service-title">{t("title")}</h1>
          </div>
        </div>

        <div className="text-center">
          <h2 className="contact-heading">{t("main-head")}</h2>
          <p
            className="contact-description"
            dangerouslySetInnerHTML={{ __html: t("sub-head") }}
          ></p>
        </div>

        {/* Contact Form Section */}
        <div className="container contact-container">
          <div className="row">
            {/* Left Side - Contact Info */}
            <div className="col-md-5 contact-info">
              <div className="contact-item">
                <img
                  src={Location}
                  alt="Location"
                  className="contact-icon"
                  height={23}
                  width={23}
                />
                <div className="contact-text">
                  <h1>{t("address")}</h1>
                  <p>
                    236 5th SE Avenue, New
                    <br />
                    York NY10000, United
                    <br /> States
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <img
                  src={Phone}
                  alt="Phone"
                  className="contact-icon-phone"
                  height={20}
                  width={20}
                />
                <div className="contact-text">
                  <h1>{t("phone")}</h1>
                  <p>Mobile: +(84) 546-678990</p>
                  <p>Hotline: +(84) 456-6789</p>
                </div>
              </div>

              <div className="contact-item">
                <img
                  src={Email}
                  alt="Email"
                  className="contact-icon-email"
                  height={20}
                  width={20}
                />
                <div className="contact-text">
                  <h1>{t("email")}</h1>
                  <p>hasghgds@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="col-md-7">
              <form onSubmit={handleSubmit} className="contact-form">
                <label>{t("name-head")}</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Abc"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}

                <label>{t("email-add")}</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Abc@def.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}

                <label>{t("subject")}</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.subject && (
                  <span className="error-text">{errors.subject}</span>
                )}

                <label>{t("message")}</label>
                <textarea
                  name="message"
                  placeholder="Hi i'd like to ask about"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                ></textarea>
                {errors.message && (
                  <span className="error-text">{errors.message}</span>
                )}

                <button
                  type="submit"
                  className="btn btn-primary mt-3 submit-btn"
                >
                  {t("submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
