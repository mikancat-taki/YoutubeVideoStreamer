import { Link, Smartphone, CheckCircle } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Link,
      title: "Multiple URL Formats",
      description: "Supports standard, short, embedded, and Shorts URLs"
    },
    {
      icon: Smartphone,
      title: "Responsive Design", 
      description: "Works perfectly on desktop, tablet, and mobile devices"
    },
    {
      icon: CheckCircle,
      title: "URL Validation",
      description: "Real-time validation with helpful error messages"
    }
  ];

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div
            key={index}
            className="p-6 rounded-xl text-center"
            style={{ backgroundColor: "var(--youtube-gray)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "var(--youtube-red)" }}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--youtube-text)" }}>
              {feature.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--youtube-text-secondary)" }}>
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
