import { ChevronRight } from "lucide-react";

import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

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
        <button className="w-full bg-[#f8f8f8] rounded-[0.20rem] h-[40px] mt-auto">
          {cta}
        </button>
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
          title="Basic"
          subtitle="For hobbyists and beginners"
          price="$9.99/mo"
          text={[
            "Access to 1000+ samples",
            "Basic mixing tools",
            "Community forum access",
          ]}
          cta="Choose Basic"
        ></PlanCard>
        <PlanCard
          title="Pro"
          subtitle="For serious producers and professionals"
          price="$24.99/mo"
          text={[
            "Access to 10,000+ samples",
            "Advanced mixing and effects",
            "Exclusive pro community",
            "Early access to new samples",
          ]}
          cta="Choose Pro"
        ></PlanCard>
      </div>
    </div>
  );
}
