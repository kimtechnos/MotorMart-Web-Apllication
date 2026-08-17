// import React from "react";
// import "./Contact.scss";

// function Contact() {
//   const handleSubmit = () => {};
//   const handleInputChange = () => {};
//   return (
//     <section className="contact-section">
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-md-10">
//             <div className="wrapper">
//               <div className="row no-gutters">
//                 <div className="col-md-6">
//                   <div className="contact-wrap w-100 p-lg-5 p-4">
//                     {/* <br />
//                     <br /> */}
//                     <h3 className="mb-4">send us a message</h3>
//                     <form
//                       id="contactForm"
//                       className="contactForm"
//                       onSubmit={handleSubmit}
//                     >
//                       <div className="row">
//                         <div className="col-md-12">
//                           <div className="form-group">
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="name"
//                               placeholder="Name"
//                               onChange={handleInputChange}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-12">
//                           <div className="form-group">
//                             <input
//                               type="email"
//                               className="form-control"
//                               name="email"
//                               placeholder="Email"
//                               onChange={handleInputChange}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-12">
//                           <div className="form-group">
//                             <input
//                               type="text"
//                               className="form-control"
//                               name="subject"
//                               placeholder="Subject"
//                               onChange={handleInputChange}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-md-12">
//                           <div className="form-group">
//                             <textarea
//                               type="text"
//                               className="form-control"
//                               name="message"
//                               placeholder="Message"
//                                cols="30"
//                               rows="6"
//                               onChange={handleInputChange}
//                             ></textarea>
//                           </div>
//                         </div>
//                         <div className=" col-md-12">
//                           <div className="form-group">
//                             <input
//                               type="submit"
//                               value="send message"
//                               className="btn btn-primary"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>

//                 <div className="col-md-6 d-flex align-items-stretch">
//                   <div className="info-wrap w-100 p-lg-5 p-4 img">
//                     {/* <br />
//                     <br /> */}
//                     <h3>Contact us</h3>
//                     <p className="mb-4">
//                       we're open for any suggestions or just to have a chat{" "}
//                     </p>
//                     <div className="dbox w-100 d-flex align-items-start">
//                       <div className="icon d-flex align-items-center justify-content-center">
//                         <span className="fa fa-map-marker"></span>
//                       </div>
//                       <div className="text pl-3">
//                         <p>
//                           <span>Address:</span>198 kenyatta avenue, Nairobi
//                         </p>
//                       </div>
//                     </div>
//                     <div className="dbox w-100 d-flex align-items-start">
//                       <div className="icon d-flex align-items-center justify-content-center">
//                         <span className="fa fa-phone"></span>
//                       </div>
//                       <div className="text pl-3">
//                         <p>
//                           <span>Phone:</span>
//                           <a href="tel://254769334187">+254 769 334 187</a>
//                         </p>
//                       </div>
//                     </div>
//                     <div className="dbox w-100 d-flex align-items-start">
//                       <div className="icon d-flex align-items-center justify-content-center">
//                         <span className="fa fa-paper-plane"></span>
//                       </div>
//                       <div className="text pl-3">
//                         <p>
//                           <span>Email:</span>
//                           <a href="motor@mart.com">motor@mart.com</a>
//                         </p>
//                       </div>
//                     </div>
//                     <div className="dbox w-100 d-flex align-items-start">
//                       <div className="icon d-flex align-items-center justify-content-center">
//                         <span className="fa fa-globe"></span>
//                       </div>
//                       <div className="text pl-3">
//                         <p>
//                           <span>Website:</span>
//                           <a href="#">motormart.com</a>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Contact;
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import firebaseDB from "../../firebase"; // Assumed path for Firebase
import "react-toastify/dist/ReactToastify.css";
import "./Contact.scss";
import { push } from "firebase/database";

function Contact() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { name, email, subject, message } = state;

  // Email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please provide value in each input field");
    } else if (!validateEmail(email)) {
      toast.error("Please provide a valid email address");
    } else {
      // Save to Firebase

      push(firebaseDB, { name, email, subject, message })
        .then(() => {
          toast.success("Message sent successfully");
          setState({ name: "", email: "", subject: "", message: "" });
        })
        .catch((error) => {
          toast.error("Error submitting message: " + error.message);
        });
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <section className="contact-section">
      <div className="container">
        <ToastContainer position="top-center" />
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="wrapper">
              <div className="row no-gutters">
                <div className="col-md-6">
                  <div className="contact-wrap w-100 p-lg-5 p-4">
                    <h3 className="mb-4">Send Us a Message</h3>
                    <form
                      id="contactForm"
                      className="contactForm"
                      onSubmit={handleSubmit}
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              placeholder="Name"
                              onChange={handleInputChange}
                              value={name}
                              aria-label="Name"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email"
                              onChange={handleInputChange}
                              value={email}
                              aria-label="Email"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="subject"
                              placeholder="Subject"
                              onChange={handleInputChange}
                              value={subject}
                              aria-label="Subject"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <textarea
                              type="text"
                              className="form-control"
                              name="message"
                              placeholder="Message"
                              cols="30"
                              onChange={handleInputChange}
                              value={message}
                              aria-label="Message"
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="submit"
                              value="Send Message"
                              className="btn btn-primary"
                              aria-label="Send Message"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-md-6 d-flex align-items-stretch">
                  <div className="info-wrap w-100 p-lg-5 p-4 img">
                    <h3>Contact Us</h3>
                    <p className="mb-4">
                      We're open for any suggestions or just to have a chat.
                    </p>
                    <div className="dbox w-100 d-flex align-items-start">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span className="fa fa-map-marker"></span>
                      </div>
                      <div className="text pl-3">
                        <p>
                          <span>Address:</span> 198 Kenyatta Avenue, Nairobi
                        </p>
                      </div>
                    </div>
                    <div className="dbox w-100 d-flex align-items-start">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span className="fa fa-phone"></span>
                      </div>
                      <div className="text pl-3">
                        <p>
                          <span>Phone:</span>
                          <a href="tel://254769334187">+254 769 334 187</a>
                        </p>
                      </div>
                    </div>
                    <div className="dbox w-100 d-flex align-items-start">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span className="fa fa-paper-plane"></span>
                      </div>
                      <div className="text pl-3">
                        <p>
                          <span>Email:</span>
                          <a href="mailto:motor@mart.com">motor@mart.com</a>
                        </p>
                      </div>
                    </div>
                    <div className="dbox w-100 d-flex align-items-start">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span className="fa fa-globe"></span>
                      </div>
                      <div className="text pl-3">
                        <p>
                          <span>Website:</span>
                          <a href="https://motormart.com">motormart.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
