import { SyntheticEvent, useState } from "react";
import emailjs from "@emailjs/browser";

function InputField(props: {
  value: string;
  id: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
  onChangeCallback: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {props.label}
      </label>
      {props.textarea ? (
        <textarea
          id={props.id}
          name={props.id}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChangeCallback}
          required
        />
      ) : (
        <input
          id={props.id}
          type={props.id}
          name={props.id}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChangeCallback}
          required
        />
      )}
    </div>
  );
}
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email_address: "",
    message: "",
  });
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
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
    // <form onSubmit={handleSubmit} className="space-y-4">
    //   <div className="space-y-2">
    //     <Label htmlFor="name">Name</Label>
    //     <Input id="name" placeholder="Your name" required />
    //   </div>
    //   <div className="space-y-2">
    //     <Label htmlFor="email">Email</Label>
    //     <Input
    //       id="email"
    //       type="email"
    //       placeholder="Your email"
    //       required
    //     />
    //   </div>
    //   <div className="space-y-2">
    //     <Label htmlFor="message">Message</Label>
    //     <Textarea id="message" placeholder="Your message" required />
    //   </div>
    //   <Button type="submit" className="w-full">
    //     Send Message
    //   </Button>
    // </form>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TODO: should be required */}
      <InputField
        value={contactInfo.name}
        id="name"
        placeholder="Your name"
        label="Name"
        onChangeCallback={(event) =>
          setContactInfo({ ...contactInfo, name: event.target.value })
        }
      />
      <InputField
        value={contactInfo.email_address}
        id="email"
        placeholder="Your email"
        label="Email"
        onChangeCallback={(event) =>
          setContactInfo({ ...contactInfo, email_address: event.target.value })
        }
      />
      <InputField
        textarea={true}
        value={contactInfo.message}
        id="message"
        placeholder="Your message"
        label="Message"
        onChangeCallback={(event) =>
          setContactInfo({ ...contactInfo, message: event.target.value })
        }
      />
      {stateMessage && <p>{stateMessage}</p>}
      <button
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full bg-black text-white"
        type="submit"
        disabled={isSubmitting}
      >
        Send message
      </button>
    </form>
  );
};
export default ContactForm;
