import Card from "react-bootstrap/Card";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 flex-col">
      <h2> Thanks for the interest!</h2>
      <p>
        We are still in closed beta. Please consider sending us a message if you
        want to be a part of it!
      </p>
      <Card className="w-full max-w-md mt-5">
        <Card.Body className="p-0">
          <div className="p-6">
            <Card.Title>
              <h3 className="text-2xl font-extrabold tracking-tight">
                Contact Us
              </h3>
            </Card.Title>
            <Card.Subtitle id="contact-subtitle">
              Fill out the form below to get in touch with us.
            </Card.Subtitle>
          </div>
          <Card.Text className="p-6">
            <ContactForm />
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
