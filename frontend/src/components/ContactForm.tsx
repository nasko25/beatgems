import { SyntheticEvent, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email_address: "",
    message: "",
  });
  const sendEmail = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.persist();
    e.preventDefault();
    setIsSubmitting(true);
    console.log(e.target);
    // emailjs
    //   .send(
    //     process.env.REACT_APP_SERVICE_ID,
    //     process.env.REACT_APP_TEMPLATE_ID,
    //     e.target,
    //     { publicKey: process.env.REACT_APP_PUBLIC_KEY }
    //   )
    //   .then(
    //     (result) => {
    //       setStateMessage("Message sent!");
    //       setIsSubmitting(false);
    //       setTimeout(() => {
    //         setStateMessage(null);
    //       }, 5000); // hide message after 5 seconds
    //     },
    //     (error) => {
    //       setStateMessage("Something went wrong, please try again later");
    //       setIsSubmitting(false);
    //       setTimeout(() => {
    //         setStateMessage(null);
    //       }, 5000); // hide message after 5 seconds
    //     }
    //   );

    // Clears the form after sending the email
    // e.target.reset();
    e.currentTarget.reset();
  };
  return (
    <form onSubmit={sendEmail}>
      <label>Name</label>
      {/* TODO: should be required */}
      <input
        type="text"
        name="name"
        value={contactInfo.name}
        onChange={(event) =>
          setContactInfo({ ...contactInfo, name: event.target.value })
        }
      />
      <label>Email</label>
      <input
        type="email"
        name="email_address"
        value={contactInfo.email_address}
        onChange={(event) =>
          setContactInfo({
            ...contactInfo,
            email_address: event.target.value,
          })
        }
      />
      <label>Message</label>
      <textarea
        name="message"
        value={contactInfo.message}
        onChange={(event) =>
          setContactInfo({ ...contactInfo, message: event.target.value })
        }
      />
      <input type="submit" value="Send" disabled={isSubmitting} />
      {stateMessage && <p>{stateMessage}</p>}
    </form>
  );
};
export default ContactForm;
