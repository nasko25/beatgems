import { ChevronRight } from "lucide-react";

import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function PlanCard({
  title,
  subtitle,
  text,
  cta,
  price,
}: {
  title: string;
  subtitle: string;
  text: string[];
  cta: string;
  price: string;
}) {
  return (
    <Card>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle>{subtitle}</Card.Subtitle>
        <Card.Text>
          <div className="text-4xl font-bold">{price}</div>
          <ul className="mt-4 space-y-2">
            {text.map((t) => (
              <li className="flex items-center">
                <ChevronRight className="mr-2 h-4 w-4" /> {t}
              </li>
            ))}
          </ul>
        </Card.Text>
        <Button
          variant="light"
          className="w-full bg-[#f8f8f8] rounded-[0.20rem] h-[40px] mt-auto"
          onClick={() => {
            window.location.href = "/contact?p=" + title;
          }}
        >
          {cta}
        </Button>
      </Card.Body>
    </Card>
  );
}

export function Plans() {
  return (
    <div className="container px-4 md:px-6 m-auto">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
        Choose Your Plan
      </h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <PlanCard
          title="Hobbyist"
          subtitle="For hobbyists and beginners"
          price="$1/mo"
          text={[
            "Non-commercial use for every song/beat in the library for as long as the trial is active",
            "Access to all 1000+ AI generated beats and a limited selection of 100 user-generated beats",
            "100 uploads/month",
            "$2 single time fee to license a particular beat forever",
            // "Community forum access",
          ]}
          cta="Choose Hobbyist"
        ></PlanCard>
        <PlanCard
          title="Pro"
          subtitle="For serious producers and professionals"
          price="$10/mo"
          text={[
            "Commercial use for every song/beat in the library for as long as the trial is active",
            "Access to our full library of 10,000+ AI and user-generated samples", // or "Access to a rich library of..."?
            "Unlimited uploads",
            "Only $1 single time fee to license a particular beat forever",
            // "Exclusive pro community",
            // "Early access to new samples every Friday", // available to all other paying customers in 1 week?
          ]}
          cta="Choose Pro"
        ></PlanCard>
      </div>
    </div>
  );
}
