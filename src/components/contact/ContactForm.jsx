import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Star2Img from "../../assets/images/v1/star2.webp";
import FadeInRight from "../animation/FadeInRight";
import Field from "../common/Field";
import ContactVideo from "../../assets/images/Videos/reel.mp4";
import emailjs from "@emailjs/browser";

function ContactForm() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const handleBodyClick = (e) => {
      if (videoRef.current && !videoRef.current.contains(e.target)) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("click", handleBodyClick);
    return () => {
      document.removeEventListener("click", handleBodyClick);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const submitForm = async (formData) => {
    console.log("Form Data: ", formData);

    try {
      const result = await emailjs.send(
        "service_ry5xraq",
        "template_2ixe2hu",
        formData,
        "xXD66OwtNN0ehOvWz"
      );

      console.log("Email sent successfully:", result.text);
      alert("email sent successfully....");

      const adminTemplateParams = {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        message: formData.message,
      };

      const adminResponse = await emailjs.send(
        "service_ry5xraq",
        "template_num0fab",
        adminTemplateParams,
        "xXD66OwtNN0ehOvWz"
      );
      console.log("Admin Params:", adminTemplateParams);
      console.log("Admin notification sent:", adminResponse.text);

      reset();
      navigate("/thank-you");
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const autofillStyles = {
    fontSize: "18px",
    WebkitAppearance: "none",
    backgroundImage: "none",
    backgroundColor: "transparent",
    color: "#000",
    transition:
      "background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s",
  };

  return (
    <div className="section aximo-section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="aximo-section-title">
              <h2>
                <span className="aximo-title-animation">
                  Contact us for
                  <span className="aximo-title-icon">
                    <img src={Star2Img} alt="Star" />
                  </span>
                </span>
                <br />
                personal experience
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5 order-lg-2 Video-Column">
            <FadeInRight className="aximo-contact-thumb">
              <div
                className="video-wrapper"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
                style={{ position: "relative" }}
              >
                <video
                  ref={videoRef}
                  loop
                  playsInline
                  className="contact-video"
                  src={ContactVideo}
                  preload="metadata"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                  alt="User Review Video"
                >
                  Your browser does not support the video tag.
                </video>

                {showControls && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause();
                    }}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "rgba(0,0,0,0.6)",
                      border: "none",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "50px",
                      cursor: "pointer",
                    }}
                  >
                    {isPlaying ? (
                      <i className="fa-solid fa-pause" />
                    ) : (
                      <i className="fa-solid fa-play" />
                    )}
                  </button>
                )}
              </div>
            </FadeInRight>
          </div>
          <div className="col-lg-7">
            <div className="aximo-main-form">
              <form onSubmit={handleSubmit(submitForm)}>
                <div className="aximo-main-field">
                  <Field label="Your Name" error={errors.name}>
                    <input
                      {...register("name", { required: "Name is required." })}
                      type="text"
                      name="name"
                      id="name"
                      style={autofillStyles}
                    />
                  </Field>
                </div>
                <div className="aximo-main-field">
                  <Field label="Enter email address" error={errors.email}>
                    <input
                      {...register("email", {
                        required: "Email is required.",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address.",
                        },
                      })}
                      type="email"
                      name="email"
                      id="email"
                      style={autofillStyles}
                    />
                  </Field>
                </div>
                <div className="aximo-main-field">
                  <Field label="Enter Phone Number" error={errors.number}>
                    <input
                      {...register("number", {
                        required: "Phone is required.",
                        pattern: {
                          value: /^[0-9+\-()\s]+$/,
                          message:
                            "Phone number can only contain numbers, spaces, +, and -.",
                        },
                        maxLength: {
                          value: 15,
                          message: "Phone number cannot exceed 15 characters.",
                        },
                      })}
                      type="tel"
                      name="number"
                      id="number"
                      style={autofillStyles}
                    />
                  </Field>
                </div>
                <div className="aximo-main-field">
                  <label>Write your message here...</label>
                  <textarea
                    {...register("message", {
                      required: "Message is required.",
                    })}
                    name="message"
                    style={{ fontSize: "18px" }}
                  ></textarea>
                </div>
                <button id="aximo-main-btn" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
